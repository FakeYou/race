import { World } from 'p2';


export default class Physics {
	constructor(game) {
		this.game = game;

		this.world = new World({
			gravity: [0, 0],
		});
	}

	update(delta) {
		this.world.step(1 / 60, delta, 10);
	}
}