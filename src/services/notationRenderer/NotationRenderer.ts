import { RenderContext, Stave } from 'vexflow';
import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { ConfigKey } from '@services/ConfigService/ConfigKey';
import { ConfigService } from '@services/ConfigService/ConfigService';

export class NotationRenderer {
    private static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }

    staves: RenderableStave[] = [];
    staveMinimumHeightDistance: number = 40;

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            const staveConfig = Number(
                ConfigService.getInstance().getValue(ConfigKey.StaveMinimumHeightDistance),
            );
            if (!Number.isNaN(staveConfig)) {
                this.staveMinimumHeightDistance = Number(staveConfig);
            }
            return this;
        } else return NotationRenderer._instance;
    }

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return tempStave.getHeight() + this.staveMinimumHeightDistance;
    }

    GetStavePositionY(index: number, defaultValue: number = 0) {
        if (index <= 0) return defaultValue;
        return this.staves[index - 1].currentPositionY;
    }

    AddNewStave(numberOfBars?: number) {
        this.staves.push(new RenderableStave(numberOfBars));
        EventNotifier.Notify('numberOfStavesChanged', this.staves.length);
        EventNotifier.Notify('needsRender');
    }

    Render(
        context: RenderContext,
        width: number,
        height: number,
        startingHeight: number,
        startingStaveIndex: number,
        lastStaveIndex: number,
    ) {
        context.clear();
        for (let i = startingStaveIndex; i <= lastStaveIndex && i < this.staves.length; i++)
            this.staves[i].Draw(
                context,
                width - 1,
                i == startingStaveIndex ? startingHeight : this.staves[i - 1].currentPositionY,
            );
        console.log('Staves: ', this.staves);
        console.log('Height: ', height, 'Width: ', width);
    }
}
