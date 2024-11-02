import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';

class RenderableBar implements IRenderable {
    ratio: number;
    currentPosX: number = 0;
    currentPosY: number = 0;

    constructor(ratio?: number) {
        this.ratio = ratio ?? 1;
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        let bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX() + bar.getWidth();
        this.currentPosY = bar.getY() + bar.getHeight();
    }
}

export default RenderableBar;
