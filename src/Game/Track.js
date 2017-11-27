import { Group, PlaneGeometry, Mesh } from 'three';

import Fence from './entities/Fence';
import Player from './entities/Player';

export default class Track extends Group {
	static HOME = 'home';

	constructor(game) {
		super();

		this.game = game;
	}

	load = (name) => {
		this.game.loader.load('level', `assets/tracks/${name}.json`, this.build);
	}

	build = (level) => {
		this.buildTrack(level);
		level.layers.objects.forEach(this.buildObject);
	}

	buildTrack = (level) => {
		level.layers.track.forEach((num, i) => {
			const tile = level.tiles[num];

			const plane = new PlaneGeometry(8, 8);
			const mesh = new Mesh(plane, tile.material);

			plane.faceVertexUvs[0].forEach(face => {
				face.forEach(corner => {
					corner.x = tile.uv.x + tile.size.x * corner.x;
					corner.y = tile.uv.y - tile.size.y * corner.y;
				});
			});

			const offset = {
				x: (i % level.width) * 8,
				y: Math.floor(i / level.width) * 8
			};

			mesh.position.x = offset.x + 4;
			mesh.position.z = offset.y + 4;
			mesh.rotation.x = -Math.PI / 2;

			this.add(mesh);

			tile.objects.forEach(object => this.buildObject(object, offset));
		});
	}

	buildObject = (object, offset = null) => {
		switch (object.type) {
			case 'player':
				return this.add(new Player(this.game, object, offset));

			case 'fence':
				return this.add(new Fence(this.game, object, offset));
	
			default:
				console.warn(`Unknown object type: ${object.type}`, object);
		}
	}

	update = (delta) => {
		this.children.forEach(child => {
			if (child.update) {
				child.update(delta);
			}
		});
	}
}
