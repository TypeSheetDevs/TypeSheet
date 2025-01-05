import { IRenderable } from './IRenderable';
import RenderableBar from './RenderableBar';
import { RenderContext } from 'vexflow';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';
import { RenderableStaveData } from '@services/notationRenderer/DataStructures/IRecoverable.types';

class RenderableStave implements IRenderable, IRecoverable<RenderableStave, RenderableStaveData> {
    bars: RenderableBar[] = [];
    currentPositionY = 0;
    barsPerStave = ConfigService.getInstance().getValue(SavedParameterName.BarsPerStave);

    constructor(numberOfBars?: number) {
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
        return this.bars[index - 1].NextPositionX;
    }

    GetClickedBar(positionX: number, positionY: number): number {
        for (let i = 0; i < this.bars.length; i++) {
            if (this.bars[i].isClicked(positionX, positionY)) return i;
        }
        return -1;
    }

    Draw(context: RenderContext, width: number, positionY: number) {
        const ratioValue = this.GetRatioValue(width);
        this.bars.forEach((bar, idx) =>
            bar.Draw(context, positionY, this.GetBarPositionX(idx), ratioValue * bar.ratio),
        );
        this.currentPositionY = this.bars.length != 0 ? this.bars[0].NextPositionY : 0;
    }

    FromData(data: RenderableStaveData): RenderableStave {
        console.log(data);
        return null!;
    }

    ToData(): RenderableStaveData {
        return { barsData: this.bars.map(bar => bar.ToData()) };
    }

    static FromData(data: RenderableStaveData): RenderableStave {
        const stave = new RenderableStave(data.barsData.length);
        stave.bars = (data.barsData ?? [])
            .map(barData => RenderableBar.FromData(barData))
            .filter(bar => bar);
        return stave;
    }
}

export default RenderableStave;
