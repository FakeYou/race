import { Group, Vector2, MeshNormalMaterial, Mesh, BoxGeometry } from 'three';
import { Body, Box, TopDownVehicle } from 'p2';

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
			mass: 2,
		});

		this.mesh = new Mesh(
			new BoxGeometry(1, 1, 3),
			new MeshNormalMaterial(),
		);

		this.body.addShape(new Box({ width: 1, height: 3 }));
		this.game.physics.world.addBody(this.body);

		this.vehicle = new TopDownVehicle(this.body);

		this.frontWheel = this.vehicle.addWheel({ localPosition: [0, 1.2] });
		this.backWheel = this.vehicle.addWheel({ localPosition: [0, -1.2] });

		this.frontWheel.setSideFriction(5);
		this.backWheel.setSideFriction(4);

		this.vehicle.addToWorld(this.game.physics.world);
		this.add(this.mesh);
	}

	update() {
		this.mesh.position.x = this.body.interpolatedPosition[0];
		this.mesh.position.z = this.body.interpolatedPosition[1];
		this.mesh.rotation.y = -this.body.interpolatedAngle;

		this.frontWheel.steerValue = 0;
		this.backWheel.engineForce = 0;
		this.backWheel.setBrakeForce(0);

		if (this.game.keys[KEYS.A]) {
			this.frontWheel.steerValue = Math.PI / 8;
		}
		else if (this.game.keys[KEYS.D]) {
			this.frontWheel.steerValue -= Math.PI / 8;
		}

		if (this.game.keys[KEYS.W]) {
			this.backWheel.engineForce = 8;
		}


		if (this.game.keys[KEYS.S]) {
			if (this.backWheel.getSpeed() > 0.1) {
				this.backWheel.setBrakeForce(5);
			}
			else {
				this.backWheel.setBrakeForce(0);
				this.backWheel.engineForce = -2;
			}
		}
	}
}
