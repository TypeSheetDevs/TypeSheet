import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
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
    private metaDataPadding: number = 0;

    private configService: ConfigService = ConfigService.getInstance();
    private notation: Notation = Notation.getInstance();
    private selectedBarIndex: number = -1;
    private selectedStaveIndex: number = -1;
    private state: NotationRendererState = NotationRendererState.Idle;

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            EventNotifier.AddListener('clickedInsideRenderer', this.OnClick.bind(this));
            EventNotifier.AddListener('resized', this.OnResize.bind(this));
            EventNotifier.AddListener('viewportChanged', this.OnViewportChange.bind(this));
            EventNotifier.AddListener('needsRender', this.OnRender.bind(this));
            EventNotifier.AddListener('addNewBar', this.AddNewBar.bind(this));
            EventNotifier.AddListener('removeBar', this.RemoveBar.bind(this));
            EventNotifier.AddListener('removeStave', this.RemoveStave.bind(this));
            return this;
        } else return NotationRenderer._instance;
    }

    private AddNewBar(params: EventParams<'addNewBar'>) {
        if (this.selectedBarIndex < 0 || this.selectedStaveIndex < 0) {
            this.notation.AddNewBar(params.newStave, this.notation.getStaves().length);
            return;
        }

        this.notation.AddNewBar(params.newStave, this.selectedStaveIndex, this.selectedBarIndex);
    }
    //TODO: check for state
    private RemoveStave() {
        if (this.selectedStaveIndex < 0) return;
        this.selectedStaveIndex = this.notation.RemoveStave(this.selectedStaveIndex);
        this.selectedBarIndex = -1;
        this.OnRender();
    }

    //TODO: check for state
    private RemoveBar() {
        if (this.selectedStaveIndex < 0 || this.selectedBarIndex < 0) return;
        [this.selectedStaveIndex, this.selectedBarIndex] = this.notation.RemoveBar(
            this.selectedStaveIndex,
            this.selectedBarIndex,
        );
        this.OnRender();
    }

    private FindBarIndexByPosition(positionX: number, positionY: number): [number, number] {
        const staves = this.notation.getStaves();
        for (
            let i = this.viewport.startingStaveIndex;
            i <= this.viewport.lastStaveIndex && i < staves.length;
            i++
        ) {
            const foundBarIndex = staves[i].GetClickedBar(positionX, positionY);
            if (foundBarIndex != -1) {
                return [i, foundBarIndex];
            }
        }
        return [-1, -1];
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
                    ? this.viewport.startingHeight +
                          (this.viewport.startingStaveIndex === 0 ? this.metaDataPadding : 0)
                    : staves[i - 1].currentPositionY,
            );
    }

    private DrawHeader() {
        if (!this.context || this.viewport.startingStaveIndex !== 0) return;

        const title = this.notation.Title;
        const author = this.notation.Author;

        const titleFontSize = 20;
        const authorFontSize = 14;
        let padding = 0;
        if (title.length > 0) {
            this.context.setFont('Arial', titleFontSize, '').setFillStyle('#000');
            this.context.fillText(
                title,
                (this.width - this.context.measureText(title).width) / 2,
                titleFontSize,
            );
            padding += titleFontSize + 5;
        }

        if (author.length > 0) {
            padding += authorFontSize;
            this.context.setFont('Arial', authorFontSize, '');
            this.context.fillText(
                author,
                (this.width - this.context.measureText(author).width) / 2,
                padding,
            );
            padding += 5;
        }

        this.metaDataPadding = padding;
        EventNotifier.Notify('metaDataSet', padding);
    }

    get SelectedBar() {
        return this.notation.GetBar(this.selectedStaveIndex, this.selectedBarIndex);
    }

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return (
            tempStave.getBottomY() -
            tempStave.getY() +
            this.configService.getValue(SavedParameterName.StaveMinimumHeightDistance)
        );
    }

    ClearBarSelection(): void {
        this.selectedBarIndex = -1;
        this.selectedStaveIndex = -1;
        this.OnRender();
    }

    SetContext(context: RenderContext): void {
        this.context = context;
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
                [this.selectedStaveIndex, this.selectedBarIndex] = this.FindBarIndexByPosition(
                    params.positionX,
                    params.positionY,
                );
                break;
            }
            case NotationRendererState.RemovingNote:
                this.SelectedBar?.removeClickedNote(params.positionX);
                break;
        }

        this.OnRender();
    }

    private OnRender() {
        if (!this.context) return;

        this.context.clear();
        this.DrawHeader();
        this.DrawVisibleBars();

        if (!this.SelectedBar) return;

        const selectedRect = this.SelectedBar.Rect;
        this.context
            .setStrokeStyle('')
            .rect(selectedRect.x, selectedRect.y, selectedRect.width, selectedRect.height)
            .stroke();
    }
}
