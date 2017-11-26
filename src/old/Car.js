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
	constructor(game) {
		super();

		this.game = game;

		this.body = new Body({
			mass: 1,
		});

		this.body.addShape(new Box({ width: 4, height: 2 }));
		this.game.physics.world.addBody(this.body);

		this.steering = 0;

		this.wheels = {
			frontLeft: new Wheel(game, -1.5, 1.2, { power: false, steering: false }),
			frontRight: new Wheel(game, -1.5, -1.2, { power: false, steering: false }),
			backLeft: new Wheel(game, 1.5, 1.2, { power: true }),
			backRight: new Wheel(game, 1.5, -1.2, { power: true }),
		};

		this.chassis = new Mesh(
			new BoxGeometry(4, 1, 2),
			new MeshNormalMaterial(),
		);

		this.game.physics.world.addConstraint(new RevoluteConstraint(this.body, this.wheels.frontLeft.body, { localPivotA: [-1.5, 1.5], localPivotB: [0, 0]}));
		this.game.physics.world.addConstraint(new RevoluteConstraint(this.body, this.wheels.frontRight.body, { localPivotA: [-1.5, -1.5], localPivotB: [0, 0]}));
		this.game.physics.world.addConstraint(new RevoluteConstraint(this.body, this.wheels.backLeft.body, { localPivotA: [1.5, 1.5], localPivotB: [0, 0]}));
		this.game.physics.world.addConstraint(new RevoluteConstraint(this.body, this.wheels.backRight.body, { localPivotA: [1.5, -1.5], localPivotB: [0, 0]}));

		this.add(this.chassis);
		this.add(this.wheels.frontLeft);
		this.add(this.wheels.frontRight);
		this.add(this.wheels.backLeft);
		this.add(this.wheels.backRight);
	}

	update = (delta) => {
		this.chassis.position.x = this.body.interpolatedPosition[0];
		this.chassis.position.z = this.body.interpolatedPosition[1];
		this.chassis.rotation.y = -this.body.interpolatedAngle;

		if (this.game.keys[KEYS.A]) {
			this.steering += (0.8 - this.steering) / 20;
		}
		else if (this.game.keys[KEYS.D]) {
			this.steering += (-0.8 - this.steering) / 20;
		}
		else {
			this.steering += (-0 - this.steering) / 5;
		}

		this.wheels.frontLeft.body.angle = this.body.angle + this.steering;
		this.wheels.frontRight.body.angle = this.body.angle + this.steering;
		this.wheels.backLeft.body.angle = this.body.angle;
		this.wheels.backRight.body.angle = this.body.angle;

		this.wheels.frontLeft.update(delta);
		this.wheels.frontRight.update(delta);
		this.wheels.backLeft.update(delta);
		this.wheels.backRight.update(delta);
	}
}
