import { LoadingManager, FileLoader } from 'three';
import TSXLoader from './TSXLoader';
import LevelLoader from './LevelLoader';

export default class Loader {
	constructor(game) {
		this.game = game;

		this.manager = new LoadingManager();
		this.manager.onStart = this.onStart;
		this.manager.onProgress = this.onProgress;
		this.manager.onLoad = this.onLoad;

		this.fileLoader = new FileLoader(this.manager);
		this.tsxLoader = new TSXLoader(this.manager);
		this.levelLoader = new LevelLoader(this.manager);

		this.files = {};
	}

	load = (type, url, cb = () => {}) => {
		switch (type) {
			case 'json':
				this.fileLoader.load(url, data => {
					this.files[url] = JSON.parse(data);
					cb(data);
				});
				break;

			case 'level':
				this.levelLoader.load(url, level => {
					this.files[url] = level;
					cb(level);
				});
				break;

			case 'tsx':
				this.tsxLoader.load(url, tiles => {
					this.files[url] = tiles;
					cb(tiles);
				});
				break;

			default:
				throw new Error(`Unknown file type: ${type} for url ${url}`);
		}
	}

	onStart = (url, loaded, total) => {
		console.log(`Started loading file: ${url}. Loaded ${loaded} of ${total} files.`);
	}

	onProgress = (url, loaded, total) => {
		console.log(`Loading file: ${url}. Loaded ${loaded} of ${total} files.`);
	}

	onLoad = () => {
		console.log('Loading complete');
	}
}
