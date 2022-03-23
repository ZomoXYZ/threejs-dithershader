import { Camera, Color, ColorRepresentation, Material, Scene, WebGLRenderer, WebGLRenderTarget } from 'three';
/**
 * @author alteredq / http://alteredqualia.com/
 */

export default class RenderPass {
    scene: Scene;
    camera: Camera;
    overrideMaterial: Material | null;
    clearColor: ColorRepresentation;
    clearAlpha: number;
    oldClearColor: Color;
    oldClearAlpha: number;
    enabled: boolean;
    clear: boolean;
    needsSwap: boolean;

    constructor(
        scene: Scene,
        camera: Camera,
        overrideMaterial: Material | null = null,
        clearColor: ColorRepresentation = '000000',
        clearAlpha: number = 1,
    ) {
        this.scene = scene;
        this.camera = camera;

        this.overrideMaterial = overrideMaterial;

        this.clearColor = clearColor;
        this.clearAlpha = clearAlpha;

        this.oldClearColor = new Color();
        this.oldClearAlpha = 1;

        this.enabled = true;
        this.clear = true;
        this.needsSwap = false;
    }

    render(renderer: WebGLRenderer, _writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
        this.scene.overrideMaterial = this.overrideMaterial;

        if (this.clearColor) {
            renderer.getClearColor(this.oldClearColor);
            this.oldClearAlpha = renderer.getClearAlpha();

            renderer.setClearColor(this.clearColor, this.clearAlpha);
        }

        renderer.setRenderTarget(readBuffer);
        renderer.render(this.scene, this.camera); //, this.clear

        if (this.clearColor) {
            renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
        }

        this.scene.overrideMaterial = null;
    }
}
