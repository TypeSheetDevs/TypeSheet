import { RenderContext, Stave } from 'vexflow';
import RenderableStave from './RenderableStave';
import { staveMinimumHeightDistance } from '@data/config';

export class NotationRenderer {
    static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }

    staves: RenderableStave[] = [];

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            return this;
        } else return NotationRenderer._instance;
    }

    private GetMaximumVisibleStavesAmount(height: number) {
        const tempStave = new Stave(0, 0, 10);
        const staveHeight = tempStave.getHeight() + staveMinimumHeightDistance;
        return Math.floor(height / staveHeight);
    }

    get PagesAmount() {
        return 0;
        //return Math.floor(this.staves.length / this.GetMaximumVisibleStavesAmount());
    }

    GetStavePositionY(index: number, defaultValue: number = 0) {
        if (index <= 0) return defaultValue;
        return this.staves[index - 1].currentPositionY;
    }

    AddNewStave(numberOfBars?: number) {
        this.staves.push(new RenderableStave(numberOfBars));
        document.dispatchEvent(
            new CustomEvent<number>('notePagesAmountChanged', {
                detail: this.PagesAmount,
            }),
        );
        document.dispatchEvent(new CustomEvent<never>('needRender'));
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
        console.log('GetMaximumVisibleStavesAmount: ', this.GetMaximumVisibleStavesAmount(height));
    }
}
