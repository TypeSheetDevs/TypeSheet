import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';

export class TooltipNoteIndicator extends NoteIndicator {
    private currentlyHighlightedNoteData: ChosenEntityData;
    private tooltipPosition: { x: number; y: number } = { x: -1, y: -1 };

    private ColorCurrentlyHighlightedNote(isColored: boolean) {
        if (!this.currentlyHighlightedNoteData.Note) return;
        this.currentlyHighlightedNoteData.Note.Color = isColored ? 'blue' : 'black';
    }

    private CalculateTooltipPosition(): void {
        const staveIndex = this.currentlyHighlightedNoteData.StaveIndex;
        const barIndex = this.currentlyHighlightedNoteData.BarIndex;
        const voiceIndex = this.currentlyHighlightedNoteData.VoiceIndex;
        const noteIndex = this.currentlyHighlightedNoteData.NoteIndex;

        if (noteIndex === -1) {
            this.tooltipPosition = { x: -1, y: -1 };
            return;
        }

        const note = this.notation
            .getStaves()
            [staveIndex].bars[barIndex].voices[voiceIndex].GetNote(noteIndex);

        console.log(note.BoundingBox);
        this.tooltipPosition = { x: -1, y: -1 };
    }

    constructor(notation: Notation) {
        super(notation);
        this.currentlyHighlightedNoteData = new ChosenEntityData(this.notation);
    }

    protected override RefreshIndicator(): void {}
    public override OnCreation(): void {}
    public override OnDestroy(): void {}

    public override MovedAtNote(noteData: ChosenEntityData, _positionY: number): void {
        if (noteData.NoteIndex === -1) {
            this.ColorCurrentlyHighlightedNote(false);
            return;
        }
        this.currentlyHighlightedNoteData.SetNoteIndex(
            noteData.StaveIndex,
            noteData.BarIndex,
            noteData.NoteIndex,
            noteData.VoiceIndex,
        );
        this.ColorCurrentlyHighlightedNote(true);
        this.CalculateTooltipPosition();
    }

    public override OnMouseClick(): void {}
}
