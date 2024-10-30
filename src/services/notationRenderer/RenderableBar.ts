import { mainViewMargin, staveMinimumHeightDistance } from '@data/config';
import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';

class RenderableBar implements IRenderable {
    bar: Stave;
    previousBar?: Stave;

    constructor(barLength: number, previousBar?: Stave) {
        this.previousBar = previousBar;

        if (!this.previousBar) {
            this.bar = new Stave(mainViewMargin, 0, barLength);
            return;
        }

        this.bar = new Stave(
            this.previousBar.getX() + this.previousBar.getWidth(),
            this.previousBar.getY(),
            barLength,
        );
    }

    Draw(context: RenderContext) {
        this.bar.setContext(context).draw();
    }
}

export default RenderableBar;
