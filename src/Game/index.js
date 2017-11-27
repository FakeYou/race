import { Scene, PerspectiveCamera, Vector3, WebGLRenderer, AxesHelper, Clock } from 'three';
import OrbitControls from 'orbit-controls-es6';

import Loader from './utils/Loader';
import Physics from './Physics';
import Track from './Track';

export default class Game {
	constructor(container) {
		this.scene = new Scene();

		const width = container.clientWidth;
		const height = container.clientHeight;

		const aspect = width / height;
		this.camera = new PerspectiveCamera(60, aspect, 0.1, 1000);
		this.camera.position.set(0, 50, 0);
		this.camera.lookAt(new Vector3(0, 0, 0));

		this.clock = new Clock(true);

		this.renderer = new WebGLRenderer({ antialias: false });
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(0xeeeeee);
		console.log(this.renderer)
		container.appendChild(this.renderer.domElement);

		this.loader = new Loader(this);
		this.physics = new Physics(this);
		this.track = new Track(this);
		this.track.load(Track.HOME);

		this.scene.add(this.track);

		this.keys = {};
		window.addEventListener('keydown', (e) => this.keys[e.keyCode] = true, false);
		window.addEventListener('keyup', (e) => this.keys[e.keyCode] = false, false);

		if (process.env.NODE_ENV === 'development') {
			this.scene.add(new AxesHelper());
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enabled = true;
			this.controls.maxDistance = 1500;
			this.controls.minDistance = 0;
		}

		this.update();
	}

	update = () => {
		const delta = this.clock.getDelta();

		this.physics.update(delta);
		this.track.update(delta);

		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.update);
	}
}