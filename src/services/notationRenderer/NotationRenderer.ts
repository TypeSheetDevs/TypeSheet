import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';

export class NotationRenderer {
    private static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }

    notation: Notation = Notation.getInstance();
    readonly staveMinimumHeightDistance: number = ConfigService.getInstance().getValue(
        'StaveMinimumHeightDistance',
    );

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            return this;
        } else return NotationRenderer._instance;
    }

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return tempStave.getHeight() + this.staveMinimumHeightDistance;
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
        const staves = this.notation.getStaves();

        for (let i = startingStaveIndex; i <= lastStaveIndex && i < staves.length; i++)
            staves[i].Draw(
                context,
                width - 1,
                i == startingStaveIndex ? startingHeight : staves[i - 1].currentPositionY,
            );
        console.log('Staves: ', staves);
        console.log('Height: ', height, 'Width: ', width);
    }
}
