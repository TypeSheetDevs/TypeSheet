import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ChosenEntityData } from '@services/notationRenderer/ChosenEntityData';
import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';
import { EventParams } from '@services/eventNotifier/eventNotifier.types';
import { AddingNoteIndicator } from '@services/notationRenderer/NoteIndicator/AddingNoteIndicator';
import { NullNoteIndicator } from '@services/notationRenderer/NoteIndicator/NullNoteIndicator';

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
    private focusedEntities: ChosenEntityData = null!;
    private actualNoteIndicator: NoteIndicator = null!;
    private state: NotationRendererState = null!;

    private _AddEventListeners() {
        EventNotifier.AddListener('clickedInsideRenderer', this.OnClick.bind(this));
        EventNotifier.AddListener('resized', this.OnResize.bind(this));
        EventNotifier.AddListener('viewportChanged', this.OnViewportChange.bind(this));
        EventNotifier.AddListener('needsRender', this.OnRender.bind(this));
        EventNotifier.AddListener('addNewBar', this.AddNewBar.bind(this));
        EventNotifier.AddListener('removeBar', this.RemoveFocusedBar.bind(this));
        EventNotifier.AddListener('removeStave', this.RemoveFocusedStave.bind(this));
        EventNotifier.AddListener('movedInsideRenderer', this.OnMouseMove.bind(this));
    }

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            this.focusedEntities = new ChosenEntityData(this.notation);
            this.state = NotationRendererState.Idle;
            this.actualNoteIndicator = new NullNoteIndicator();
            this._AddEventListeners();
            return this;
        } else return NotationRenderer._instance;
    }

    private ChangeState(state: NotationRendererState): void {
        if (state === this.state) return;
        this.actualNoteIndicator.OnDestroy();
        this.state = state;

        switch (this.state) {
            case NotationRendererState.Idle:
                this.actualNoteIndicator = new NullNoteIndicator();
                break;
            case NotationRendererState.AddingNote:
                this.actualNoteIndicator = new AddingNoteIndicator(this.notation);
                break;
            case NotationRendererState.ModifyingNote:
                this.actualNoteIndicator = new AddingNoteIndicator(this.notation);
                break;
        }
        this.actualNoteIndicator.OnCreation();
        EventNotifier.Notify('rendererStateChanged', this.State);
        this.OnRender();
    }

    private AddNewBar(params: EventParams<'addNewBar'>) {
        if (!this.focusedEntities.Bar) {
            const newStaveIndex = this.notation.getStaves().length;
            this.notation.AddNewBar(params.newStave, newStaveIndex);
            this.focusedEntities.SetBarIndex(newStaveIndex, 0);
            return this.OnRender();
        }

        this.notation.AddNewBar(
            params.newStave,
            this.focusedEntities.StaveIndex,
            this.focusedEntities.BarIndex,
        );
    }

    private RemoveFocusedStave() {
        if (!this.focusedEntities.Stave) return;
        this.focusedEntities.StaveIndex = this.notation.RemoveStave(
            this.focusedEntities.StaveIndex,
        );
        this.OnRender();
    }

    private RemoveFocusedBar() {
        if (!this.focusedEntities.Bar) return;
        this.focusedEntities.SetBarIndex(
            ...this.notation.RemoveBar(
                this.focusedEntities.StaveIndex,
                this.focusedEntities.BarIndex,
            ),
        );
        this.OnRender();
    }

    private SetFocusBasedOnPosition(positionX: number, positionY: number) {
        this.focusedEntities.SetBarIndex(...this.FindBarIndexByPosition(positionX, positionY));
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

    get StaveHeight() {
        const tempStave = new Stave(0, 0, 10);
        return (
            tempStave.getBottomY() -
            tempStave.getY() +
            this.configService.getValue(SavedParameterName.StaveMinimumHeightDistance)
        );
    }

    get AddingNoteIndicator() {
        return this.actualNoteIndicator;
    }

    get State() {
        return this.state;
    }

    ChangeStateAction(state: NotationRendererState) {
        return () => this.ChangeState(state);
    }

    ClearFocus(): void {
        this.focusedEntities.StaveIndex = -1;
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
        this.SetFocusBasedOnPosition(params.positionX, params.positionY);
        switch (this.state) {
            case NotationRendererState.RemovingNote:
                this.focusedEntities.Bar?.removeClickedNote(params.positionX);
                break;
            case NotationRendererState.AddingNote:
                this.actualNoteIndicator.OnMouseClick();
                break;
            case NotationRendererState.ModifyingNote:
                this.actualNoteIndicator.OnMouseClick();
                break;
        }

        this.OnRender();
    }

    private GetNoteIndexUnderMouse(positionX: number): number {
        const newNoteIndicatorIndex =
            this.focusedEntities.Voice?.GetNoteIndexByPositionX(positionX) ?? -1;
        const note = this.focusedEntities.Voice?.GetNote(newNoteIndicatorIndex);

        if (!note?.IsInRect(positionX)) return -1;

        return newNoteIndicatorIndex;
    }

    private OnMouseMove(params: EventParams<'movedInsideRenderer'>): void {
        this.SetFocusBasedOnPosition(params.positionX, params.positionY);

        const entityUnderMouse = new ChosenEntityData(this.notation);
        entityUnderMouse.SetNoteIndex(
            this.focusedEntities.StaveIndex,
            this.focusedEntities.BarIndex,
            this.GetNoteIndexUnderMouse(params.positionX),
        );

        this.actualNoteIndicator.MovedAtNote(entityUnderMouse, params.positionY);

        this.OnRender();
    }

    private DrawFocusedBarIndication(context: RenderContext): void {
        const focusedBar = this.focusedEntities.Bar;
        if (!focusedBar) return;

        const focusedRect = focusedBar.Rect;
        context
            .setStrokeStyle('')
            .rect(focusedRect.x, focusedRect.y, focusedRect.width, focusedRect.height)
            .stroke();
    }

    private OnRender() {
        if (!this.context) return;

        this.context.clear();
        this.DrawHeader();
        this.DrawVisibleBars();
        this.DrawFocusedBarIndication(this.context);
    }
}
