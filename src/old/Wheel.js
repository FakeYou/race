import { Group, Vector2, CylinderGeometry, MeshNormalMaterial, Mesh } from 'three';
import { Body, Box } from 'p2';

const KEYS = {
	W: 87,
	S: 83,
	A: 65,
	D: 68,
};

export default class Wheel extends Group {
	static DRAG = -0.5;
	static MAX_FORWARD_SPEED = 500;
	static MAX_BACKWARD_SPEED = -50;
	static MAX_DRIVE_FORCE = 2000;

	constructor(game, x = 0, y = 0, options = {}) {
		super();

		this.game = game;
		this.options = options;

		this.body = new Body({
			mass: 5,
			position: [x, y],
		});
		this.body.angularDamping = 1;

		this.body.addShape(new Box({ width: 0.4, height: 0.3 }));
		this.game.physics.world.addBody(this.body);

		const mesh = new Mesh(
			new CylinderGeometry(0.4, 0.4, 0.3, 6),
			new MeshNormalMaterial(),
		);

		this.rotation.x = Math.PI / 2;
		this.game.physics.world.on('postStep', this.postStep);

		this.add(mesh);
	}

	update = (delta) => {
		this.position.x = this.body.interpolatedPosition[0];
		this.position.z = this.body.interpolatedPosition[1];
		this.rotation.z = this.body.interpolatedAngle;
	}

	postStep = () => {
		this.updateTraction();

		if (this.options.power) {
			this.updateDrive();
		}

		if (this.options.steering) {
			this.updateSteering();
		}
	}

	updateTraction = () => {
		// Keep tire straight
		const lateralVelocity = this.getLateralVelocity();
		const impulse = lateralVelocity.negate().multiplyScalar(this.body.mass);

		if (impulse.length() > 30) {
			impulse.multiplyScalar(30 / impulse.length());
		}

		this.body.applyImpulse(impulse.toArray());

		// Apply drag to tire
		const forwardNormal = this.getForwardVelocity();
		const forwardSpeed = forwardNormal.length();
		const dragForce = Wheel.DRAG * forwardSpeed;
		this.body.applyForce(forwardNormal.multiplyScalar(dragForce).toArray());
	}

	updateDrive = () => {
		const forwardNormal = new Vector2(1, 0).rotateAround({ x: 0, y: 0 }, this.body.angle);
		const currentSpeed = this.getForwardVelocity().dot(forwardNormal);
		let desiredSpeed = 0;
		let force = 0;

		if (this.game.keys[KEYS.W]) {
			desiredSpeed += Wheel.MAX_FORWARD_SPEED;
		}
		else if (this.game.keys[KEYS.S]) {
			desiredSpeed += Wheel.MAX_BACKWARD_SPEED;
		}
		else {
			return;
		}

		if (desiredSpeed > 0 && desiredSpeed > currentSpeed) {
			force = Wheel.MAX_DRIVE_FORCE;
		}
		else if (desiredSpeed < 0 && desiredSpeed < currentSpeed) {
			force = -Wheel.MAX_DRIVE_FORCE;
		}

		this.body.applyForce(forwardNormal.negate().multiplyScalar(force).toArray());
	}

	updateSteering() {
		if (this.game.keys[KEYS.A]) {
			this.body.angle += 0.05;
		}
		else if (this.game.keys[KEYS.D]) {
			this.body.angle -= 0.05;
		}
	}

	getLateralVelocity() {
		const velocity = new Vector2(this.body.velocity[0], this.body.velocity[1]);
		const normal = new Vector2(0, 1).rotateAround({ x: 0, y: 0 }, this.body.angle);
		return normal.multiplyScalar(normal.dot(velocity));
	}

	getForwardVelocity() {
		const velocity = new Vector2(this.body.velocity[0], this.body.velocity[1]);
		const normal = new Vector2(1, 0).rotateAround({ x: 0, y: 0 }, this.body.angle);
		return normal.multiplyScalar(normal.dot(velocity));
	}
}