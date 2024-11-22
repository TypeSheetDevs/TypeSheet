import { RenderContext } from 'vexflow';

export interface IRenderable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Draw: (renderer: RenderContext, ...args: any[]) => void;
}
