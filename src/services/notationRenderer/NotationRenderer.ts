import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

export class NotationRenderer {
    private static _instance: NotationRenderer = null!;
    static getInstance() {
        return NotationRenderer._instance || new NotationRenderer();
    }
    private context: RenderContext | null = null;
    private width: number = 0;
    private height: number = 0;
    private viewport: RenderArguments = {
        startingHeight: 0,
        startingStaveIndex: 0,
        lastStaveIndex: 0,
    };

    private configService: ConfigService = ConfigService.getInstance();
    private notation: Notation = Notation.getInstance();

    private state: NotationRendererState = NotationRendererState.Idle;

    private selectedBar: RenderableBar | null = null;
    private hoveredNoteIndex: number = -1;
    private hoveredBar: RenderableBar | null = null;

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            EventNotifier.AddListener('clickedInsideRenderer', this.OnClick.bind(this));
            EventNotifier.AddListener('resized', this.OnResize.bind(this));
            EventNotifier.AddListener('viewportChanged', this.OnViewportChange.bind(this));
            EventNotifier.AddListener('needsRender', this.OnRender.bind(this));
            EventNotifier.AddListener('movedInsideRenderer', this.OnMouseMove.bind(this));
            return this;
        } else return NotationRenderer._instance;
    }

    private FindBarByPosition(positionX: number, positionY: number) {
        const staves = this.notation.getStaves();
        for (
            let i = this.viewport.startingStaveIndex;
            i <= this.viewport.lastStaveIndex && i < staves.length;
            i++
        ) {
            const foundBarIndex = staves[i].GetClickedBar(positionX, positionY);
            if (foundBarIndex != -1) {
                return staves[i].bars[foundBarIndex];
            }
        }
        return null;
    }

    private DrawVisibleBars() {
        const staves = this.notation.getStaves();
        for (
            let i = this.viewport.startingStaveIndex;
            i <= this.viewport.lastStaveIndex && i < staves.length;
            i++
        )
            staves[i].Draw(
                this.context!,
                this.width - 1,
                i == this.viewport.startingStaveIndex
                    ? this.viewport.startingHeight
                    : staves[i - 1].currentPositionY,
            );
    }

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return (
            tempStave.getBottomY() -
            tempStave.getY() +
            this.configService.getValue(SavedParameterName.StaveMinimumHeightDistance)
        );
    }

    ClearSelectedBar(): void {
        this.selectedBar = null;
        this.OnRender();
    }

    SetContext(context: RenderContext): void {
        this.context = context;
        this.OnRender();
    }

    private OnMouseMove(params: EventParams<'movedInsideRenderer'>): void {
        const bar = this.FindBarByPosition(params.positionX, params.positionY);
        if (!bar) {
            this.hoveredBar?.colorChosenNote(this.hoveredNoteIndex, 'black');
            this.hoveredBar = null;
            this.hoveredNoteIndex = -1;
            this.OnRender();
            return;
        }

        const noteIndex = bar.getClickedNote(0, params.positionX);

        if (this.hoveredBar === bar && this.hoveredNoteIndex == noteIndex) return;
        console.log(bar);

        this.hoveredBar?.colorChosenNote(this.hoveredNoteIndex, 'black');
        bar.colorChosenNote(noteIndex, 'red');
        this.hoveredBar = bar;
        this.hoveredNoteIndex = noteIndex;
        this.OnRender();
    }

    private OnResize(params: EventParams<'resized'>): void {
        this.width = params.width;
        this.height = params.height;

        console.log(this.height);

        this.OnRender();
    }

    private OnViewportChange(params: EventParams<'viewportChanged'>): void {
        this.viewport = params;
        this.OnRender();
    }

    private OnClick(params: EventParams<'clickedInsideRenderer'>) {
        switch (this.state) {
            case NotationRendererState.Idle: {
                this.selectedBar = this.FindBarByPosition(params.positionX, params.positionY);
                break;
            }
            case NotationRendererState.RemovingNote:
                this.selectedBar?.removeClickedNote(params.positionX);
                break;
        }

        this.OnRender();
    }

    private OnRender() {
        if (!this.context) return;

        this.context.clear();
        this.selectedBar?.colorChosenNote(0, 'red');
        this.DrawVisibleBars();

        if (!this.selectedBar) return;

        const selectedRect = this.selectedBar.Rect;
        this.context
            .rect(selectedRect.x, selectedRect.y, selectedRect.width, selectedRect.height)
            .setStrokeStyle('blue')
            .stroke()
            .setStrokeStyle('black');
    }
}
