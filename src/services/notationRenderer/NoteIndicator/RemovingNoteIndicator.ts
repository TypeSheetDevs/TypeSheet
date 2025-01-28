import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class RemovingNoteIndicator extends NoteIndicator {
    private currentlyHighlightedKeyData: ChosenEntityData;

    private ColorCurrentlyHighlightedNote(isColored: boolean) {
        if (!this.currentlyHighlightedKeyData.Key) return;
        this.currentlyHighlightedKeyData.Key.Color = isColored ? 'blue' : 'black';
    }

    constructor(notation: Notation) {
        super(notation);
        this.currentlyHighlightedKeyData = new ChosenEntityData(this.notation);
    }

    protected override RefreshIndicator(): void {
        EventNotifier.Notify('needsRender');
    }
    public override OnCreation(): void {}
    public override OnDestroy(): void {}

    public override MovedAtNote(
        noteData: ChosenEntityData,
        positionY: number,
        positionX: number,
    ): void {
        if (noteData.NoteIndex === -1) {
            return;
        }
        this.ColorCurrentlyHighlightedNote(false);
        this.currentlyHighlightedKeyData.SetNoteIndex(
            noteData.StaveIndex,
            noteData.BarIndex,
            noteData.NoteIndex,
        );
        this.currentlyHighlightedKeyData.KeyIndex =
            this.currentlyHighlightedKeyData.Note?.GetKeyIndexByPositionY(positionX, positionY) ??
            -1;
        this.ColorCurrentlyHighlightedNote(true);
    }

    public override OnMouseClick(): void {
        try {
            this.currentlyHighlightedKeyData.Note?.RemoveKey(
                this.currentlyHighlightedKeyData.KeyIndex,
            );
            if (this.currentlyHighlightedKeyData.Note?.KeysLength === 0) {
                this.currentlyHighlightedKeyData.Voice?.RemoveNote(
                    this.currentlyHighlightedKeyData.NoteIndex,
                );
            }
            this.currentlyHighlightedKeyData.KeyIndex = -1;
        } catch (error) {
            console.warn(error);
        }
    }
}
