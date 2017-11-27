import { Group, Vector2, BoxGeometry, MeshNormalMaterial, Mesh } from 'three';
import { Body, Box, RevoluteConstraint, PrismaticConstraint } from 'p2';


export default class Wheel extends Group {
	constructor(game, car, config = { x: 0, y: 0 }) {
		super();

		this.game = game;
		this.car = car;
		this.config = config;

		this.body = new Body({
			mass: 1,
			position: [config.x, config.y],
		});

		console.log(this.body.position);

		this.body.addShape(new Box({
			width: 0.2,
			height: 0.4,
			sensor: true
		}));

		this.mesh = new Mesh(
			new BoxGeometry(0.2, 0.4, 0.4),
			new MeshNormalMaterial({ wireframe: true }),
		);

		this.game.physics.world.addBody(this.body);

		if (this.config.steering) {
			const constraint = new RevoluteConstraint(this.car.body, this.body, {
				localPivotA: [-this.config.x, this.config.y],
				localPivotB: [0, 0],
			});
			constraint.motorEnabled = false;
			constraint.collideConnected = false;
			constraint.lowerLimitEnabled = true;
			constraint.upperLimitEnabled = true;
			this.game.physics.world.addConstraint(constraint);
		}
		else {
			const constraint = new PrismaticConstraint(this.car.body, this.body, {
				localAnchorA: [-this.config.x, this.config.y],
				localAnchorB: [0, 0],
				upperLimit: 0,
				lowerLimit: 0,
			});
			constraint.motorEnabled = false;
			constraint.collideConnected = false;
			this.game.physics.world.addConstraint(constraint);
		}
	}

	update() {
		this.mesh.position.x = this.body.interpolatedPosition[0];
		this.mesh.position.z = this.body.interpolatedPosition[1];
		this.mesh.rotation.y = -this.body.interpolatedAngle;

		this.killSidewaysVelocity();
		this.applyDrag();
	}

	setAngle = (angle) => {
		this.body.angle = this.car.body.angle + angle;
	}

	killSidewaysVelocity = () => {
		const lateralVelocity = this.getLateralVelocity();
		const impulse = lateralVelocity.negate().multiplyScalar(this.body.mass);
		this.body.applyImpulse(impulse.toArray());
	}

	applyDrag() {
		const forwardNormal = this.getForwardVelocity();
		const forwardSpeed = forwardNormal.length();
		const dragForce = -.05 * forwardSpeed;
		this.body.applyForce(forwardNormal.multiplyScalar(dragForce).toArray());
	}

	updateDrive() {

	}
	
	getLateralVelocity() {
		const velocity = new Vector2(this.body.velocity[0], this.body.velocity[1]);
		const normal = new Vector2(1, 0).rotateAround({ x: 0, y: 0 }, this.body.angle);
		return normal.multiplyScalar(normal.dot(velocity));
	}

	getForwardVelocity() {
		const velocity = new Vector2(this.body.velocity[0], this.body.velocity[1]);
		const normal = new Vector2(0, -1).rotateAround({ x: 0, y: 0 }, this.body.angle);
		return normal.multiplyScalar(normal.dot(velocity));
	}
}
