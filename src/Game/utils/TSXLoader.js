import {
	Loader,
	FileLoader,
	TextureLoader,
	MeshBasicMaterial,
	Vector2,
	NearestFilter,
	NearestMipMapLinearFilter,
	FaceColors,
} from 'three';
import { parseString } from 'xml2js';
import { fromPairs } from 'lodash';
import path from 'path';

export default class TSXLoader extends Loader {
	constructor(manager) {
		super(manager);

		this.fileLoader = new FileLoader(this.manager);
		this.textureLoader = new TextureLoader(this.manager);
	}

	load(url, onLoad, onProgress, onError) {
		this.fileLoader.load(url, (xml) => {
			parseString(xml, (err, tsx) => {
				if (err) {
					return onError(err);
				}

				const tileset = {
					name: tsx.tileset.$.name,
					columns: parseInt(tsx.tileset.$.columns, 10),
					tileCount: parseInt(tsx.tileset.$.tilecount, 10),
					tileWidth: parseInt(tsx.tileset.$.tilewidth, 10),
					tileHeight: parseInt(tsx.tileset.$.tileheight, 10),
				};
				tileset.rows = tileset.tileCount / tileset.columns;

				const image = tsx.tileset.image[0].$.source;
				const imageUrl = path.resolve(path.dirname(url), image);
				const tiles = this.loadTiles(imageUrl, tileset);

				tsx.tileset.tile.forEach(tile => {
					const index = parseInt(tile.$.id, 10);

					const objects = tile.objectgroup[0].object.map(object => ({
						id: parseInt(object.$.id, 10),
						type: object.$.type,
						position: {
							x: parseFloat(object.$.x),
							y: parseFloat(object.$.y),
						},
						width: object.$.width && parseFloat(object.$.width),
						height: object.$.height && parseFloat(object.$.height),
						polygon: object.polygon && object.polygon[0].$.points.split(' ')
							.map(x => x.split(',').map(x => parseFloat(x))),
						properties: fromPairs(object.properties && object.properties[0].property.map(property => ([
							property.$.name,
							JSON.parse(property.$.value),
						]))),
					}));

					tiles[index].objects = objects;
				});

				onLoad(tiles);
			});

		}, onProgress, onError);
	}

	loadTiles(url, tileset) {
		const texture = this.textureLoader.load(url);
		texture.magFilter = NearestFilter;
		texture.minFilter = NearestMipMapLinearFilter;

		const material = new MeshBasicMaterial({
			map: texture,
			vertexColors: FaceColors,
		});

		const tiles = [];
	
		const ratio = tileset.rows / tileset.columns;
		const bleed = 0.005;

		for (let i = 0; i < tileset.tileCount; i++) {
			const x = i % tileset.columns;
			const y = Math.floor(i / tileset.columns);
		
			const uv = new Vector2(
				((x % tileset.columns) / tileset.columns) + (bleed / 2),
				(1 - ((y + 1) / tileset.rows)) + (bleed / 2 / ratio),
			);
			const size = new Vector2(
				(1 / tileset.columns) - (bleed),
				(-1 / tileset.rows) + (bleed / ratio)
			);
		
			tiles.push({
				material,
				uv,
				size,
				objects: [],
			});
		}

		return tiles;
	}
}