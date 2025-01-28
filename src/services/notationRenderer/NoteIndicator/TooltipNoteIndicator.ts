import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class TooltipNoteIndicator extends NoteIndicator {
    private currentlyHighlightedNoteData: ChosenEntityData;
    private tooltipPosition: { x: number; y: number } = { x: -1, y: -1 };

    constructor(notation: Notation) {
        super(notation);
        this.currentlyHighlightedNoteData = new ChosenEntityData(this.notation);
    }

    private ColorCurrentlyHighlightedNote(isColored: boolean): void {
        const note = this.currentlyHighlightedNoteData.Note;
        if (note) {
            note.Color = isColored ? 'blue' : 'black';
        }
    }

    private RecalculateTooltipPosition(): void {
        const note = this.currentlyHighlightedNoteData.Note;
        if (note) {
            const box = note.BoundingBox;
            this.tooltipPosition = { x: box.x - box.w / 2, y: box.y + box.h };
            console.log(note.GetChordInfo(this.currentlyHighlightedNoteData.NoteIndex));
            this.NotifyComponent(true);
        } else {
            this.tooltipPosition = { x: -1, y: -1 };
            this.NotifyComponent(false);
        }
    }

    private NotifyComponent(visible: boolean): void {
        EventNotifier.Notify('toggleHarmonicsTooltip', {
            x: this.tooltipPosition.x,
            y: this.tooltipPosition.y,
            visible,
        });
    }

    private isSameNoteData(noteData: ChosenEntityData): boolean {
        return (
            noteData.StaveIndex === this.currentlyHighlightedNoteData.StaveIndex &&
            noteData.BarIndex === this.currentlyHighlightedNoteData.BarIndex &&
            noteData.VoiceIndex === this.currentlyHighlightedNoteData.VoiceIndex &&
            noteData.NoteIndex === this.currentlyHighlightedNoteData.NoteIndex
        );
    }

    private HandleNoteDeselection(): void {
        if (this.currentlyHighlightedNoteData.NoteIndex !== -1) {
            this.ColorCurrentlyHighlightedNote(false);
            this.currentlyHighlightedNoteData = new ChosenEntityData(this.notation);
            EventNotifier.Notify('toggleHarmonicsTooltip', { x: -1, y: -1, visible: false });
        }
    }

    public override MovedAtNote(noteData: ChosenEntityData, _positionY: number): void {
        if (noteData.NoteIndex === -1) {
            this.HandleNoteDeselection();
            return;
        }
        if (this.isSameNoteData(noteData)) return;

        this.currentlyHighlightedNoteData.SetNoteIndex(
            noteData.StaveIndex,
            noteData.BarIndex,
            noteData.NoteIndex,
            noteData.VoiceIndex,
        );

        this.ColorCurrentlyHighlightedNote(true);
        this.RecalculateTooltipPosition();
    }

    public override RefreshIndicator(): void {}
    public override OnCreation(): void {}
    public override OnDestroy(): void {}
    public override OnMouseClick(): void {}
}
