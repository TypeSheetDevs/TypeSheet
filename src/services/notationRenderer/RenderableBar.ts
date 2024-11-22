import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';

class RenderableBar implements IRenderable {
    ratio: number;
    currentPosX: number = 0;
    currentPosY: number = 0;
    staveMinimumHeightDistance: number = 40;

    constructor(ratio?: number) {
        this.ratio = ratio ?? 1;
        const staveConfig = Number(
            ConfigService.getInstance().getValue('StaveMinimumHeightDistance'),
        );
        if (!Number.isNaN(staveConfig)) {
            this.staveMinimumHeightDistance = staveConfig;
        }
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        let bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX() + bar.getWidth();
        this.currentPosY = bar.getY() + bar.getHeight() + this.staveMinimumHeightDistance;
    }
}

export default RenderableBar;
