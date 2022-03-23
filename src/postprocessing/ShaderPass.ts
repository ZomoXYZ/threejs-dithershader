import * as THREE from 'three';
import { IUniform, ShaderMaterial, ShaderMaterialParameters, WebGLRenderer, WebGLRenderTarget } from 'three';
import { SharedQuad, SharedCamera, SharedScene } from './EffectComposer';
/**
 * @author alteredq / http://alteredqualia.com/
 */

export default class ShaderPass {
  textureID: string;
  uniforms: { [uniform: string]: IUniform };
  material: ShaderMaterial;
  renderToScreen: boolean;
  enabled: boolean;
  needsSwap: boolean;
  clear: boolean;

  constructor(shader: ShaderMaterialParameters, textureID = 'tDiffuse') {
    this.textureID = textureID;

    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });

    this.renderToScreen = false;

    this.enabled = true;
    this.needsSwap = true;
    this.clear = false;
  }

  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    if (this.uniforms[this.textureID]) {
      this.uniforms[this.textureID].value = readBuffer;
    }

    SharedQuad.material = this.material;

    if (this.renderToScreen) {
      renderer.setRenderTarget(writeBuffer);
      renderer.render(SharedScene, SharedCamera);
    } else {
      renderer.setRenderTarget(writeBuffer);
      renderer.render(SharedScene, SharedCamera); //, this.clear
    }
  }
}
