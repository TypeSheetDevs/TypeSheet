import { barsPerStave } from '@data/config';
import { IRenderable } from './IRenderable';
import RenderableBar from './RenderableBar';

class RenderableStave implements IRenderable {
    bars: RenderableBar[] = [];
    positionY: number = 0;

    constructor(width: number, previousStave?: RenderableStave, numberOfBars?: number) {
        numberOfBars ??= barsPerStave;
        const barWidth = width / numberOfBars;
        for (let i = 0; i < barWidth; i++) {
            this.bars.push(new RenderableBar(barWidth, i > 0 ? this.bars[i - 1].bar : undefined));
        }
    }

    Draw(context) {
        this.bars.forEach(bar => bar.Draw(context));
    }
}

export default RenderableStave;
