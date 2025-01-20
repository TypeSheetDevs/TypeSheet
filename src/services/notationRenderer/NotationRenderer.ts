import { RenderContext, Stave } from 'vexflow';
import { Notation } from './Notation';
import { ConfigService } from '@services/ConfigService/ConfigService';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ChosenEntityData } from '@services/notationRenderer/ChosenEntityData';
import { NoteIndicator } from '@services/notationRenderer/NoteIndicator';
import { NoteDuration } from './notes/Notes.enums';

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
    private focusedEntities: ChosenEntityData = null!;
    private addingNoteIndicator: NoteIndicator = null!;
    private state: NotationRendererState = null!;

    private _AddEventListeners() {
        EventNotifier.AddListener('clickedInsideRenderer', this.OnClick.bind(this));
        EventNotifier.AddListener('resized', this.OnResize.bind(this));
        EventNotifier.AddListener('viewportChanged', this.OnViewportChange.bind(this));
        EventNotifier.AddListener('needsRender', this.OnRender.bind(this));
        EventNotifier.AddListener('addNewBar', this.AddNewBar.bind(this));
        EventNotifier.AddListener('removeBar', this.RemoveBar.bind(this));
        EventNotifier.AddListener('removeStave', this.RemoveStave.bind(this));
        EventNotifier.AddListener('startAddingNotes', this.StartAddingNotes.bind(this));
        EventNotifier.AddListener('startRemovingNotes', this.StartRemovingNotes.bind(this));
        EventNotifier.AddListener('movedInsideRenderer', this.OnMouseMove.bind(this));
    }

    constructor() {
        if (NotationRenderer._instance === null) {
            NotationRenderer._instance = this;
            this.focusedEntities = new ChosenEntityData(this.notation);
            this.addingNoteIndicator = new NoteIndicator(this.notation);
            this.state = NotationRendererState.Idle;

            this._AddEventListeners();
            return this;
        } else return NotationRenderer._instance;
    }

    private ChangeState(state: NotationRendererState): void {
        if (state === this.state) return;
        switch (this.state) {
            case NotationRendererState.AddingNote:
                this.addingNoteIndicator.Visible = false;
        }

        this.state = state;

        switch (this.state) {
            case NotationRendererState.AddingNote:
                this.addingNoteIndicator.Visible = true;
        }

        this.OnRender();
    }

    private AddNewBar(params: EventParams<'addNewBar'>) {
        if (!this.focusedEntities.Bar) {
            this.notation.AddNewBar(params.newStave, this.notation.getStaves().length);
            this.focusedEntities.NoteIndex = 0;
            return;
        }

        this.notation.AddNewBar(
            params.newStave,
            this.focusedEntities.StaveIndex,
            this.focusedEntities.BarIndex,
        );
    }

    //TODO: check for state
    private RemoveStave() {
        if (this.focusedEntities.StaveIndex < 0) return;
        this.focusedEntities.StaveIndex = this.notation.RemoveStave(
            this.focusedEntities.StaveIndex,
        );
        this.OnRender();
    }

    //TODO: check for state
    private RemoveBar() {
        if (this.focusedEntities.StaveIndex < 0 || this.focusedEntities.BarIndex < 0) return;
        this.focusedEntities.SetBarIndex(
            ...this.notation.RemoveBar(
                this.focusedEntities.StaveIndex,
                this.focusedEntities.BarIndex,
            ),
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

    set AddedDurationNote(value: NoteDuration) {
        this.addingNoteIndicator.SetNoteDuration(value);
    }

    ClearBarSelection(): void {
        this.focusedEntities.StaveIndex = -1;
        this.OnRender();
    }

    SetContext(context: RenderContext): void {
        this.context = context;
        this.OnRender();
    }

    private StartAddingNotes() {
        this.ChangeState(NotationRendererState.AddingNote);
    }

    private StartRemovingNotes() {
        this.ChangeState(NotationRendererState.RemovingNote);
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
                this.focusedEntities.SetBarIndex(
                    ...this.FindBarIndexByPosition(params.positionX, params.positionY),
                );
                break;
            }
            case NotationRendererState.RemovingNote:
                this.focusedEntities.SetBarIndex(
                    ...this.FindBarIndexByPosition(params.positionX, params.positionY),
                );
                this.focusedEntities.Bar?.removeClickedNote(params.positionX);
                break;
            case NotationRendererState.AddingNote: {
                this.focusedEntities.SetBarIndex(
                    ...this.FindBarIndexByPosition(params.positionX, params.positionY),
                );
                this.addingNoteIndicator.SaveToNotation();
            }
        }

        this.OnRender();
    }

    private OnMouseMove(params: EventParams<'movedInsideRenderer'>): void {
        if (this.state !== NotationRendererState.AddingNote) {
            return;
        }

        this.focusedEntities.SetBarIndex(
            ...this.FindBarIndexByPosition(params.positionX, params.positionY),
        );

        const newNoteIndicatorIndex =
            this.focusedEntities.Voice?.GetNoteIndexByPositionX(params.positionX) ?? -1;

        if (newNoteIndicatorIndex == -1) {
            return;
        }

        const note = this.focusedEntities.Voice?.GetNote(newNoteIndicatorIndex);

        if (note?.IsInRect(params.positionX)) {
            this.addingNoteIndicator.MoveIndicator(
                this.focusedEntities.StaveIndex,
                this.focusedEntities.BarIndex,
                newNoteIndicatorIndex,
            );
        }

        this.addingNoteIndicator.AdjustPitch(params.positionY);

        this.OnRender();
    }

    private OnRender() {
        if (!this.context) return;

        this.context.clear();
        this.DrawVisibleBars();

        const focusedBar = this.focusedEntities.Bar;
        if (!focusedBar) return;

        const focusedRect = focusedBar.Rect;
        this.context
            .setStrokeStyle('')
            .rect(focusedRect.x, focusedRect.y, focusedRect.width, focusedRect.height)
            .stroke();
    }
}
