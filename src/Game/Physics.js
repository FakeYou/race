import { World, Body, Plane } from 'p2';

console.log(World);

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