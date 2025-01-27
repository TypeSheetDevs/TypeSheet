import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class RemovingNoteIndicator extends NoteIndicator {
    private currentlyHighlightedNoteData: ChosenEntityData;

    private ColorCurrentlyHighlightedNote(isColored: boolean) {
        if (!this.currentlyHighlightedNoteData.Note) return;
        this.currentlyHighlightedNoteData.Note.Color = isColored ? 'blue' : 'black';
    }

    constructor(notation: Notation) {
        super(notation);
        this.currentlyHighlightedNoteData = new ChosenEntityData(this.notation);
    }

    protected override RefreshIndicator(): void {
        EventNotifier.Notify('needsRender');
    }
    public override OnCreation(): void {}
    public override OnDestroy(): void {}

    public override MovedAtNote(noteData: ChosenEntityData, _positionY: number): void {
        if (noteData.NoteIndex === -1) {
            return;
        }
        this.ColorCurrentlyHighlightedNote(false);
        this.currentlyHighlightedNoteData.SetNoteIndex(
            noteData.StaveIndex,
            noteData.BarIndex,
            noteData.NoteIndex,
        );
        this.ColorCurrentlyHighlightedNote(true);
    }

    public override OnMouseClick(): void {
        try {
            this.currentlyHighlightedNoteData.Voice?.RemoveNote(
                this.currentlyHighlightedNoteData.NoteIndex,
            );
            this.currentlyHighlightedNoteData.NoteIndex = -1;
        } catch (error) {
            console.warn(error);
        }
    }
}
