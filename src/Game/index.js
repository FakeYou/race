import { Scene, PerspectiveCamera, Vector3, WebGLRenderer, AxesHelper, Clock } from 'three';

import Physics from './Physics';
import Car from './Car';

export default class Game {
	constructor(container) {
		this.scene = new Scene();

		const width = container.clientWidth;
		const height = container.clientHeight;

		const aspect = width / height;
		this.camera = new PerspectiveCamera(60, aspect, 0.1, 1000);
		this.camera.position.set(0, -50, 0);
		this.camera.lookAt(new Vector3(0, 0, 0));

		if (process.env.NODE_ENV === 'development') {
			this.scene.add(new AxesHelper());
		}

		this.clock = new Clock(true);

		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(0xeeeeee);
		container.appendChild(this.renderer.domElement);

		this.physics = new Physics(this);
		this.car = new Car(this);

		this.scene.add(this.car);

		this.keys = {};
		window.addEventListener('keydown', (e) => this.keys[e.keyCode] = true, false);
		window.addEventListener('keyup', (e) => this.keys[e.keyCode] = false, false);

		this.update();
		this.instance = Date.now();
	}

	update = () => {
		const delta = this.clock.getDelta();

		this.physics.update(delta);
		this.car.update(delta);

		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.update);
	}
}