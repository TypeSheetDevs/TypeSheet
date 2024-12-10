import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';

export class NotationRenderer {
    private static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }

    private configService: ConfigService = ConfigService.getInstance();
    private notation: Notation = Notation.getInstance();
    private selectedBar: RenderableBar | null = null;
    private state: NotationRendererState = NotationRendererState.Idle;

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            EventNotifier.AddListener('clickedInsideRenderer', this.OnClick.bind(this));
            return this;
        } else return NotationRenderer._instance;
    }

    private FindBarByPosition(
        positionX: number,
        positionY: number,
        startingStaveIndex: number,
        lastRenderedStave: number,
    ) {
        const staves = this.notation.getStaves();
        for (let i = startingStaveIndex; i <= lastRenderedStave && i < staves.length; i++) {
            const foundBarIndex = staves[i].GetClickedBar(positionX, positionY);
            if (foundBarIndex != -1) {
                return staves[i].bars[foundBarIndex];
            }
        }
        return null;
    }

    private DrawVisibleBars(
        startingStaveIndex: number,
        lastStaveIndex: number,
        context: RenderContext,
        startingHeight: number,
        width: number,
    ) {
        const staves = this.notation.getStaves();
        for (let i = startingStaveIndex; i <= lastStaveIndex && i < staves.length; i++)
            staves[i].Draw(
                context,
                width - 1,
                i == startingStaveIndex ? startingHeight : staves[i - 1].currentPositionY,
            );
    }

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return (
            tempStave.getBottomY() -
            tempStave.getY() +
            this.configService.getValue('StaveMinimumHeightDistance')
        );
    }

    ClearSelectedBar(): void {
        this.selectedBar = null;
        EventNotifier.Notify('needsRender');
    }

    OnClick(params: EventParams<'clickedInsideRenderer'>) {
        switch (this.state) {
            case NotationRendererState.Idle: {
                this.selectedBar = this.FindBarByPosition(
                    params.positionX,
                    params.positionY,
                    params.startingStaveIndex,
                    params.lastStaveIndex,
                );
                break;
            }
            case NotationRendererState.RemovingNote:
                this.selectedBar?.removeClickedNote(params.positionX);
                break;
        }

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
        this.DrawVisibleBars(startingStaveIndex, lastStaveIndex, context, startingHeight, width);

        console.log('Height: ', height, 'Width: ', width);

        if (!this.selectedBar) return;

        const selectedRect = this.selectedBar.Rect;
        context
            .rect(selectedRect.x, selectedRect.y, selectedRect.width, selectedRect.height)
            .fill({ fillColor: 'pink' });
    }
}
