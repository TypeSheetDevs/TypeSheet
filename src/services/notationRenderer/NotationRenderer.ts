import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import RenderableBar from '@services/notationRenderer/RenderableBar';

export class NotationRenderer {
    private static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }

    notation: Notation = Notation.getInstance();
    readonly staveMinimumHeightDistance: number = ConfigService.getInstance().getValue(
        'StaveMinimumHeightDistance',
    );
    private selectedBar: RenderableBar | null = null;

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            EventNotifier.AddListener('clickedInsideRenderer', this.OnClick.bind(this));
            return this;
        } else return NotationRenderer._instance;
    }

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return tempStave.getBottomY() - tempStave.getY() + this.staveMinimumHeightDistance;
    }

    OnClick(params: EventParams<'clickedInsideRenderer'>) {
        const staves = this.notation.getStaves();
        for (
            let i = params.startingStaveIndex;
            i <= params.lastStaveIndex && i < staves.length;
            i++
        ) {
            const foundBarIndex = staves[i].GetClickedBar(params.positionX, params.positionY);
            if (foundBarIndex == -1) {
                continue;
            }

            this.selectedBar = staves[i].bars[foundBarIndex];
            EventNotifier.Notify('needsRender');
            break;
        }
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

        if (!this.selectedBar) return;

        console.log(this.selectedBar);

        const selectedRect = this.selectedBar.Rect;
        context
            .beginPath()
            .rect(selectedRect.x, selectedRect.y, selectedRect.width, selectedRect.height)
            .closePath()
            .fill({ fillColor: 'pink' });
    }
}
