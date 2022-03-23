import {
    LinearFilter,
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    RGBAFormat,
    Scene,
    WebGLRenderer,
    WebGLRenderTarget,
} from 'three';
import CopyShader from '../shaders/CopyShader';
import { Pass } from '../types/types';
import { ClearMaskPass, MaskPass } from './MaskPass';
import ShaderPass from './ShaderPass';

/**
 * @author alteredq / http://alteredqualia.com/
 */
export default class {
    renderer: WebGLRenderer;
    renderTarget1: WebGLRenderTarget;
    renderTarget2: WebGLRenderTarget;
    writeBuffer: WebGLRenderTarget;
    readBuffer: WebGLRenderTarget;
    passes: Pass[];
    copyPass: Pass;

    constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget) {
        this.renderer = renderer;

        if (renderTarget === undefined) {
            var width = window.innerWidth || 1;
            var height = window.innerHeight || 1;
            var parameters = {
                minFilter: LinearFilter,
                magFilter: LinearFilter,
                format: RGBAFormat,
                stencilBuffer: false,
            };

            renderTarget = new WebGLRenderTarget(width, height, parameters);
        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        this.passes = [];

        this.copyPass = new ShaderPass(CopyShader);
    }

    swapBuffers() {
        var tmp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = tmp;
    }

    addPass(pass: Pass) {
        this.passes.push(pass);
    }

    insertPass(pass: Pass, index: number) {
        this.passes.splice(index, 0, pass);
    }

    render() {
        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        var maskActive = false;

        var pass,
            i,
            il = this.passes.length;

        for (i = 0; i < il; i++) {
            pass = this.passes[i];

            if (!pass.enabled) continue;

            pass.render(this.renderer, this.writeBuffer, this.readBuffer);

            if (pass.needsSwap) {
                if (maskActive) {
                    var context = this.renderer.context;

                    context.stencilFunc(context.NOTEQUAL, 1, 0xffffffff);

                    this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer);

                    context.stencilFunc(context.EQUAL, 1, 0xffffffff);
                }

                this.swapBuffers();
            }

            if (pass instanceof MaskPass) {
                maskActive = true;
            } else if (pass instanceof ClearMaskPass) {
                maskActive = false;
            }
        }
    }

    reset(renderTarget: WebGLRenderTarget) {
        if (renderTarget === undefined) {
            renderTarget = this.renderTarget1.clone();

            renderTarget.width = window.innerWidth;
            renderTarget.height = window.innerHeight;
        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;
    }

    setSize(width: number, height: number) {
        var renderTarget = this.renderTarget1.clone();

        renderTarget.width = width;
        renderTarget.height = height;

        this.reset(renderTarget);
    }
}

// shared ortho camera

export const SharedCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
export const SharedQuad = new Mesh(new PlaneGeometry(2, 2));
export const SharedScene = new Scene();
SharedScene.add(SharedQuad);
