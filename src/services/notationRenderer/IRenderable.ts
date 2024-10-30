import { RenderContext } from 'vexflow';

export interface IRenderable {
    Draw: (renderer: RenderContext) => void;
}
