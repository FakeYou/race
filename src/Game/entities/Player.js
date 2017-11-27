import { Group } from 'three';

import Car from '../../old/Car';

const KEYS = {
	W: 87,
	S: 83,
	A: 65,
	D: 68,
};

export default class Player extends Group {
	constructor(game, object, offset = { x: 0, y: 0 }) {
		super();

		this.game = game;
		this.object = object;

		this.car = new Car(this.game);
		// this.car.body.position[0] = object.x / 64 * 8;
		// this.car.body.position[1] = object.y / 64 * 8;
		// this.car.body.angle = object.rotation * (Math.PI / 180);

		this.add(this.car);
	}

	update(delta) {
		this.car.update(delta);

	// 	this.car.frontLeft.steerValue = 0;
	// 	this.car.frontRight.steerValue = 0;
	// 	this.car.backLeft.engineForce = 0;
	// 	this.car.backRight.engineForce = 0;
	// 	this.car.backLeft.setBrakeForce(0);
	// 	this.car.backRight.setBrakeForce(0);

	// 	if (this.game.keys[KEYS.A]) {
	// 		this.car.frontLeft.steerValue = -this.car.config.steering;
	// 		this.car.frontRight.steerValue = -this.car.config.steering;
	// 	}
	// 	else if (this.game.keys[KEYS.D]) {
	// 		this.car.frontLeft.steerValue = this.car.config.steering;
	// 		this.car.frontRight.steerValue = this.car.config.steering;
	// 	}

	// 	if (this.game.keys[KEYS.W]) {
	// 		this.car.backLeft.engineForce = this.car.config.forwardEngineForce;
	// 		this.car.backRight.engineForce = this.car.config.forwardEngineForce;
	// 	}

	// 	if (this.game.keys[KEYS.S]) {
	// 		if (this.car.backLeft.getSpeed() > 0.1) {
	// 			this.car.backLeft.setBrakeForce(this.car.config.brakingForce);
	// 			this.car.backRight.setBrakeForce(this.car.config.brakingForce);
	// 		}
	// 		else {
	// 			this.car.backLeft.setBrakeForce(0);
	// 			this.car.backRight.setBrakeForce(0);
	// 			this.car.backLeft.engineForce = this.car.config.backwardEngineForce;
	// 			this.car.backRight.engineForce = this.car.config.backwardEngineForce;
	// 		}
	// 	}
	}
}