import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class MoveNoteIndicator extends NoteIndicator {
    private selectedKeyData: ChosenEntityData;
    private hoveredKeyData: ChosenEntityData;

    constructor(notation: Notation) {
        super(notation);
        this.selectedKeyData = new ChosenEntityData(this.notation);
        this.hoveredKeyData = new ChosenEntityData(this.notation);
    }

    private ClearColors() {
        if (this.selectedKeyData.Key) {
            this.selectedKeyData.Key.Color = 'black';
        }
        if (this.hoveredKeyData.Key) {
            this.hoveredKeyData.Key.Color = 'black';
        }
    }

    private ColorSelectedKey(isColored: boolean) {
        if (!this.selectedKeyData.Key) return;
        if (this.hoveredKeyData.Key === this.selectedKeyData.Key) {
            this.selectedKeyData.Key.Color = isColored ? 'red' : 'blue';
        } else {
            this.selectedKeyData.Key.Color = isColored ? 'red' : 'black';
        }
    }

    private ColorHoveredKey(isColored: boolean) {
        if (!this.hoveredKeyData.Key || this.selectedKeyData.Key === this.hoveredKeyData.Key)
            return;
        this.hoveredKeyData.Key.Color = isColored ? 'blue' : 'black';
    }

    private MovedWhileSelectedKey(noteData: ChosenEntityData, positionY: number) {}
    private MovedWithoutSelectedKey(
        noteData: ChosenEntityData,
        positionX: number,
        positionY: number,
    ) {
        if (!noteData.Note) return;

        this.ColorHoveredKey(false);
        this.hoveredKeyData.SetNoteIndex(
            noteData.StaveIndex,
            noteData.BarIndex,
            noteData.NoteIndex,
        );
        this.hoveredKeyData.KeyIndex =
            this.hoveredKeyData.Note?.GetKeyIndexByPositionY(positionX, positionY) ?? -1;
        this.ColorHoveredKey(true);
    }

    protected RefreshIndicator(): void {
        EventNotifier.Notify('needsRender');
    }

    public OnCreation(): void {}
    public OnDestroy(): void {
        this.ClearColors();
    }

    public MovedAtNote(noteData: ChosenEntityData, positionY: number, positionX: number): void {
        if (this.selectedKeyData.Key) {
            this.MovedWhileSelectedKey(noteData, positionY);
        } else {
            this.MovedWithoutSelectedKey(noteData, positionX, positionY);
        }
    }

    private ClickedWhileSelectedKey(): void {
        this.ColorSelectedKey(false);
        this.selectedKeyData.SetNoteIndex(-1, -1, -1);
        this.ColorHoveredKey(true);
    }

    private ClickedWithoutSelectedKey(): void {
        this.selectedKeyData.SetNoteIndex(
            this.hoveredKeyData.StaveIndex,
            this.hoveredKeyData.BarIndex,
            this.hoveredKeyData.NoteIndex,
        );
        this.selectedKeyData.KeyIndex = this.hoveredKeyData.KeyIndex;

        this.ColorSelectedKey(true);
    }

    public OnMouseClick(): void {
        if (this.selectedKeyData.Key) {
            this.ClickedWhileSelectedKey();
        } else {
            this.ClickedWithoutSelectedKey();
        }
    }
}
