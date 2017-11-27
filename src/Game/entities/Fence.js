import { Mesh, BoxGeometry, MeshNormalMaterial } from 'three';
import { Body, Box } from 'p2';

export default class Fence extends Mesh {
	constructor(game, object, offset = { x: 0, y: 0 }) {
		super(
			new BoxGeometry(object.width / 8, 1, object.height / 8),
			new MeshNormalMaterial()
		);

		this.game = game;
		this.object = object;

		this.position.x = object.position.x / 8 + object.width / 16 + offset.x;
		this.position.z = object.position.y / 8 + object.height / 16 + offset.y;
		
		this.body = new Body({ mass: 0 });
		this.body.addShape(new Box({ width: object.width / 8, height: object.height / 8 }));
		this.body.position[0] = this.position.x;
		this.body.position[1] = this.position.z;

		this.game.physics.world.addBody(this.body);
	}
}