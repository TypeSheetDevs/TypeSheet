import { RenderContext } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';

export class RenderableVoice implements IRenderable {
    Draw(renderer: RenderContext) {
        console.log(renderer);
    }
}
