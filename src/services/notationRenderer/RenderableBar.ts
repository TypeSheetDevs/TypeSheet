import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';

class RenderableBar implements IRenderable {
    ratio: number;
    currentPosX = 0;
    currentPosY = 0;
    staveMinimumHeightDistance = ConfigService.getInstance().getValue('StaveMinimumHeightDistance');

    constructor(ratio?: number) {
        this.ratio = ratio ?? 1;
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        const bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX() + bar.getWidth();
        this.currentPosY = bar.getY() + bar.getHeight() + this.staveMinimumHeightDistance;
    }
}

export default RenderableBar;
