import { MaskPass } from '../postprocessing/MaskPass';
import RenderPass from '../postprocessing/RenderPass';
import ShaderPass from '../postprocessing/ShaderPass';

export type Pass = MaskPass | RenderPass | ShaderPass;
