import * as THREE from 'three';
import { Camera, Material, Scene, WebGLRenderer } from 'three';
/**
 * @author alteredq / http://alteredqualia.com/
 */

export default class RenderPass {

	scene: Scene;
	camera: Camera;
	overrideMaterial: Material;
	clearColor;
	clearAlpha;
	oldClearColor;
	oldClearAlpha;
	enabled;
	clear;
	needsSwap;
	
	constructor(scene: Scene, camera: Camera, overrideMaterial: Material, clearColor, clearAlpha) {

		this.scene = scene;
		this.camera = camera;

		this.overrideMaterial = overrideMaterial;

		this.clearColor = clearColor;
		this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

		this.oldClearColor = new THREE.Color();
		this.oldClearAlpha = 1;

		this.enabled = true;
		this.clear = true;
		this.needsSwap = false;

	}

	render(renderer: WebGLRenderer, writeBuffer, readBuffer, delta) {

		this.scene.overrideMaterial = this.overrideMaterial;

		if (this.clearColor) {

			this.oldClearColor.copy(renderer.getClearColor());
			this.oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor(this.clearColor, this.clearAlpha);

		}

		renderer.render(this.scene, this.camera, readBuffer, this.clear);

		if (this.clearColor) {

			renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);

		}

		this.scene.overrideMaterial = null;

	}
}
