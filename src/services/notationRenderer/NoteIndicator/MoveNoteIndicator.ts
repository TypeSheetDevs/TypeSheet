import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

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
        this.selectedKeyData.Key.Color = isColored
            ? ConfigService.getInstance().getValue(SavedParameterName.SelectedNoteColor)
            : 'black';
    }

    private ColorHoveredKey(isColored: boolean) {
        if (!this.hoveredKeyData.Key || this.selectedKeyData.Key === this.hoveredKeyData.Key)
            return;
        this.hoveredKeyData.Key.Color = isColored
            ? ConfigService.getInstance().getValue(SavedParameterName.HoveredNoteColor)
            : 'black';
    }

    private MovedWhileSelectedKey(noteData: ChosenEntityData, positionY: number) {
        if (!this.selectedKeyData.Key) return;
        this.selectedKeyData.Note?.AdjustPitch(
            this.selectedKeyData.KeyIndex,
            this.selectedKeyData.Bar!.getKeyByPositionY(positionY).Pitch,
        );
        if (!noteData.Note) return;
        const added = noteData.Note!.AddKey(this.selectedKeyData.Key);

        if (added) {
            this.selectedKeyData.Note?.RemoveKey(this.selectedKeyData.KeyIndex);
            if (
                this.selectedKeyData.Note?.KeysLength === 0 &&
                !this.selectedKeyData.IsNoteEqual(noteData)
            ) {
                this.selectedKeyData.Voice?.RemoveNote(this.selectedKeyData.NoteIndex);
                if (
                    this.selectedKeyData.StaveIndex === noteData.StaveIndex &&
                    this.selectedKeyData.BarIndex === noteData.BarIndex &&
                    this.selectedKeyData.NoteIndex < noteData.NoteIndex
                ) {
                    this.selectedKeyData.NoteIndex = noteData.NoteIndex - 1;
                    this.selectedKeyData.KeyIndex = this.selectedKeyData.Note!.KeysLength - 1;
                    return;
                }
            }

            this.selectedKeyData.SetNoteIndex(
                noteData.StaveIndex,
                noteData.BarIndex,
                noteData.NoteIndex,
            );
            this.selectedKeyData.KeyIndex = this.selectedKeyData.Note!.KeysLength - 1;
        }
    }

    private MovedWithoutSelectedKey(
        noteData: ChosenEntityData,
        positionX: number,
        positionY: number,
    ) {
        this.ColorHoveredKey(false);
        if (noteData.Note) {
            this.hoveredKeyData.SetNoteIndex(
                noteData.StaveIndex,
                noteData.BarIndex,
                noteData.NoteIndex,
            );
        }
        this.hoveredKeyData.KeyIndex =
            this.hoveredKeyData.Note?.GetKeyIndexByPositionY(positionX, positionY) ?? -1;
        this.ColorHoveredKey(true);
    }

    protected RefreshIndicator(): void {
        if (this.selectedKeyData.Key) this.selectedKeyData.Key.Modifier = this.accidental;
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

    private RemoveSelection(): void {
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
            this.RemoveSelection();
        } else {
            this.ClickedWithoutSelectedKey();
        }
    }
}
