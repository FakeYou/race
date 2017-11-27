import { Loader, FileLoader } from 'three';
import path from 'path';
import { find, times } from 'lodash';
import TSXLoader from './TSXLoader';

export default class LevelLoader extends Loader {
	constructor(manager) {
		super(manager);

		this.fileLoader = new FileLoader(this.manager);
		this.tsxLoader = new TSXLoader(this.manager);
	}

	load(url, onLoad, onPress, onError) {
		this.fileLoader.load(url, (json) => {
			const data = JSON.parse(json);
			const level = {
				height: data.height,
				width: data.width,
				layers: {},
				tiles: [],
			};

			level.layers.track = find(data.layers, { name: 'track' }).data;
			level.layers.objects = find(data.layers, { name: 'objects' }).objects;

			const promises = data.tilesets.map(tileset => {
				const startingIndex = tileset.firstgid;
				const tilesetUrl = path.resolve(path.dirname(url), tileset.source);

				return new Promise((resolve, reject) => {
					this.tsxLoader.load(tilesetUrl, (tiles) => {
						times(startingIndex, i => level.tiles[i] = level.tiles[i] || null);
						tiles.map((tile, i) => level.tiles[i + startingIndex] = tile);

						resolve();
					}, null, reject);
				});
			});

			Promise.all(promises)
				.then(() => onLoad(level))
				.catch(onError);
		});
	}	
}
