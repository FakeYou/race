import { Group, Vector2, MeshNormalMaterial, Mesh, BoxGeometry } from 'three';
import { Body, Box, RevoluteConstraint } from 'p2';

import Wheel from './Wheel';

const KEYS = {
	W: 87,
	S: 83,
	A: 65,
	D: 68,
};

export default class Car extends Group {
	static DEFAULT = {
		mass: 2,
		damping: 0.3,
		width: 1,
		height: 2,
		power: 160,
		maxSteeringAngle: 0.3,
		maxSpeed: 60,
		wheels: [
			{ x: -0.5, y: -0.6, steering: true, powered: false },
			{ x: 0.5, y: -0.6, steering: true, powered: false },
			{ x: -0.5, y: 0.6, steering: false, powered: true },
			{ x: 0.5, y: 0.6, steering: false, powered: true },
		]
	}

	constructor(game, config = Car.DEFAULT) {
		super();

		this.game = game;
		this.config = config;

		this.body = new Body({
			mass: config.mass,
			damping: config.damping,
		});

		this.body.addShape(new Box({ width: config.width, height: config.height }));
		this.game.physics.world.addBody(this.body);

		this.wheels = config.wheels.map(config => new Wheel(game, this, config));
		this.steering = 0;

		this.mesh = new Mesh(
			new BoxGeometry(config.width, 1, config.height),
			new MeshNormalMaterial({ wireframe: true }),
		);

		this.add(this.mesh);
		this.wheels.forEach(wheel => this.add(wheel.mesh));
	}

	update = (delta) => {
		this.mesh.position.x = this.body.interpolatedPosition[0];
		this.mesh.position.z = this.body.interpolatedPosition[1];
		this.mesh.rotation.y = -this.body.interpolatedAngle;

		this.wheels.forEach(wheel => wheel.update(delta));

		if (this.game.keys[KEYS.A]) {
			this.steering = -this.config.maxSteeringAngle;
		}
		else if (this.game.keys[KEYS.D]) {
			this.steering = this.config.maxSteeringAngle;
		}
		else {
			this.steering = 0;
		}

		this.wheels.forEach(wheel => {
			if (wheel.config.steering && this.steering) {
				wheel.setAngle(this.steering);
			}
		});

		const currentSpeed = this.getSpeed();
		const forward = this.getForwardNormal();
		let force = 0;

		if (this.game.keys[KEYS.W] && currentSpeed < this.config.maxSpeed) {
			force = this.config.power;
		}
		else if (this.game.keys[KEYS.S]) {
			if (currentSpeed > 0) {
				force = -this.config.power * 1.3;
			}
			else {
				force = -this.config.power * 0.8;
			}
		}

		if (force !== 0) {
			forward.multiplyScalar(force);
			this.wheels.forEach(wheel => {
				if (wheel.config.powered) {
					wheel.body.applyForce(forward.toArray());
				}
			});
		}
	}

	getForwardNormal() {
		return new Vector2(0, -1).rotateAround({ x: 0, y: 0 }, this.body.angle);
	}

	getForwardVelocity() {
		const velocity = new Vector2(this.body.velocity[0], this.body.velocity[1]);
		const normal = new Vector2(0, -1).rotateAround({ x: 0, y: 0 }, this.body.angle);
		return normal.multiplyScalar(normal.dot(velocity));
	}

	getSpeed() {
		const forwardNormal = this.getForwardNormal();
		return this.getForwardVelocity().dot(forwardNormal);
	}
}
