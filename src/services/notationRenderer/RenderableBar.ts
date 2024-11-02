import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';

class RenderableBar implements IRenderable {
    bar: Stave;

    constructor(barLength: number, posX: number, posY: number) {
        this.bar = new Stave(posX, posY, barLength);
    }

    Draw(context: RenderContext) {
        this.bar.setContext(context).draw();
    }
}

export default RenderableBar;
