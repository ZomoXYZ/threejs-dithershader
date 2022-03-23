/**
 * @author alteredq / http://alteredqualia.com/
 */

import { Camera, Scene, WebGLRenderer, WebGLRenderTarget } from "three";

export class MaskPass {

	scene: Scene;
	camera: Camera;
	enabled: boolean;
	clear: boolean;
	needsSwap: boolean;
	inverse: boolean;
	
	constructor(scene: Scene, camera: Camera) {

		this.scene = scene;
		this.camera = camera;

		this.enabled = true;
		this.clear = true;
		this.needsSwap = false;

		this.inverse = false;
	}

	render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {

		var context = renderer.context;

		// don't update color or depth

		context.colorMask(false, false, false, false);
		context.depthMask(false);

		// set up stencil

		var writeValue, clearValue;

		if (this.inverse) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		context.enable(context.STENCIL_TEST);
		context.stencilOp(context.REPLACE, context.REPLACE, context.REPLACE);
		context.stencilFunc(context.ALWAYS, writeValue, 0xffffffff);
		context.clearStencil(clearValue);

		// draw into the stencil buffer

		renderer.setRenderTarget(readBuffer);
		renderer.render(this.scene, this.camera); //this.clear
		renderer.setRenderTarget(writeBuffer);
		renderer.render(this.scene, this.camera); //this.clear

		// re-enable update of color and depth

		context.colorMask(true, true, true, true);
		context.depthMask(true);

		// only render where stencil is set to 1

		context.stencilFunc(context.EQUAL, 1, 0xffffffff);  // draw if == 1
		context.stencilOp(context.KEEP, context.KEEP, context.KEEP);

	}

}

export class ClearMaskPass {

	enabled;

	constructor() {
		this.enabled = true;
	}

	render(renderer: WebGLRenderer) {

		var context = renderer.context;

		context.disable(context.STENCIL_TEST);

	}


}
