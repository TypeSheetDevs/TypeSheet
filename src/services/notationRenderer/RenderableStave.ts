import { IRenderable } from './IRenderable';
import RenderableBar from './RenderableBar';
import { RenderContext } from 'vexflow';
import { ConfigService } from '@services/ConfigService/ConfigService';

class RenderableStave implements IRenderable {
    bars: RenderableBar[] = [];
    currentPositionY: number = 0;
    barsPerStave: number = 7;

    constructor(numberOfBars?: number) {
        const barsPerStaveConfig = Number(
            ConfigService.getInstance().getValue("BarsPerStave"),
        );
        if (!Number.isNaN(barsPerStaveConfig)) {
            this.barsPerStave = barsPerStaveConfig;
        }

        numberOfBars ??= this.barsPerStave;
        for (let i = 0; i < numberOfBars; i++) {
            this.bars.push(new RenderableBar());
        }
    }

    GetRatioValue(width: number) {
        let acc = 0;
        this.bars.forEach(v => (acc += v.ratio));
        return width / acc;
    }

    GetBarPositionX(index: number) {
        if (index <= 0) {
            return 0;
        }
        return this.bars[index - 1].currentPosX;
    }

    Draw(context: RenderContext, width: number, positionY: number) {
        const ratioValue = this.GetRatioValue(width);
        this.bars.forEach((bar, idx) =>
            bar.Draw(context, positionY, this.GetBarPositionX(idx), ratioValue * bar.ratio),
        );
        this.currentPositionY = this.bars.length != 0 ? this.bars[0].currentPosY : 0;
    }
}

export default RenderableStave;
