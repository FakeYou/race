import { Group, Vector2, MeshNormalMaterial, Mesh, BoxGeometry } from 'three';
import { Body, Box, TopDownVehicle } from 'p2';

export default class Car extends Group {
	static EAGLE = {
		mass: 50,
		width: 0.5,
		height: 1.6,
		frontWheels: { position: 0.5, friction: 180 },
		backWheels: { position: -0.5, friction: 160 },
		forwardEngineForce: 120,
		backwardEngineForce: -60,
		brakingForce: 100,
		steering: Math.PI / 8,
	};

	constructor(game, config = Car.EAGLE) {
		super();

		this.game = game;
		this.config = config;

		this.body = new Body({
			mass: config.mass,
		});

		this.mesh = new Mesh(
			new BoxGeometry(config.width, 1, config.height),
			new MeshNormalMaterial(),
		);

		this.body.addShape(new Box({ width: config.width, height: config.height }));
		this.game.physics.world.addBody(this.body);

		this.vehicle = new TopDownVehicle(this.body);

		this.frontLeft = this.vehicle.addWheel({ localPosition: [-config.width / 4, config.frontWheels.position] });
		this.frontRight = this.vehicle.addWheel({ localPosition: [config.width / 4, config.frontWheels.position] });
		this.backLeft = this.vehicle.addWheel({ localPosition: [-config.width / 4, config.backWheels.position] });
		this.backRight = this.vehicle.addWheel({ localPosition: [config.width / 4, config.backWheels.position] });

		this.frontLeft.setSideFriction(config.frontWheels.friction);
		this.frontRight.setSideFriction(config.frontWheels.friction);
		this.backLeft.setSideFriction(config.backWheels.friction);
		this.backRight.setSideFriction(config.backWheels.friction);

		this.vehicle.addToWorld(this.game.physics.world);
		this.add(this.mesh);
	}

	update() {
		this.mesh.position.x = this.body.interpolatedPosition[0];
		this.mesh.position.z = this.body.interpolatedPosition[1];
		this.mesh.rotation.y = -this.body.interpolatedAngle;
	}
}
