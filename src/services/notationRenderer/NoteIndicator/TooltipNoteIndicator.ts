import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { ChordTypeLength } from '@services/HarmonicsService/Harmonics.chords.enums';

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

    private RecalculateTooltipPosition(height: number): void {
        const note = this.currentlyHighlightedNoteData.Note;
        if (note) {
            const box = note.BoundingBox;
            const chordInfo = note.GetChordInfo(this.currentlyHighlightedNoteData.NoteIndex);
            const text = `Root pitch: ${chordInfo.rootPitch}\nChord type: ${chordInfo.chordType}`;
            this.tooltipPosition = { x: box.x, y: box.y };
            const chordTypeWidth = 60;
            this.CalculateTooltipPosition(
                ChordTypeLength[chordInfo.chordType] + chordTypeWidth,
                box.y,
                box.h,
                height,
            );
            this.NotifyComponent(text);
        } else {
            this.tooltipPosition = { x: -1, y: -1 };
            this.NotifyComponent('');
        }
    }

    private CalculateTooltipPosition(
        textWidth: number,
        noteY: number,
        noteHeight: number,
        height: number,
    ) {
        const data = this.currentlyHighlightedNoteData;
        const note = data.Note;
        const box = note!.BoundingBox;

        // calculate X
        let tooltipNewPositionX = 0;
        if (data.BarIndex === 0 && data.NoteIndex === 0) {
            tooltipNewPositionX = box.x;
        } else if (
            data.BarIndex === data.Stave!.bars.length - 1 &&
            data.NoteIndex === data.Voice!.NotesLength - 1
        ) {
            tooltipNewPositionX = box.x - textWidth - 10;
        } else {
            tooltipNewPositionX = box.x - textWidth / 2;
        }
        this.tooltipPosition.x = tooltipNewPositionX;

        // calculate Y
        let tooltipNewPositionY = 0;
        if (noteY + noteHeight + 50 > height) {
            tooltipNewPositionY = noteY - 40;
        } else {
            tooltipNewPositionY = noteY + noteHeight + 5;
        }
        this.tooltipPosition.y = tooltipNewPositionY;
    }

    private NotifyComponent(text: string): void {
        EventNotifier.Notify('toggleHarmonicsTooltip', {
            x: this.tooltipPosition.x,
            y: this.tooltipPosition.y,
            text: text,
        });
    }

    private IsSameNoteData(noteData: ChosenEntityData): boolean {
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
            EventNotifier.Notify('toggleHarmonicsTooltip', { x: -1, y: -1, text: '' });
        }
    }

    public override MovedAtNote(
        noteData: ChosenEntityData,
        _positionY: number,
        height: number,
    ): void {
        if (noteData.NoteIndex === -1) {
            this.HandleNoteDeselection();
            return;
        }
        if (this.IsSameNoteData(noteData)) return;

        this.currentlyHighlightedNoteData.SetNoteIndex(
            noteData.StaveIndex,
            noteData.BarIndex,
            noteData.NoteIndex,
            noteData.VoiceIndex,
        );

        this.ColorCurrentlyHighlightedNote(true);
        this.RecalculateTooltipPosition(height);
    }

    public override RefreshIndicator(): void {}
    public override OnCreation(): void {}
    public override OnDestroy(): void {}
    public override OnMouseClick(): void {}
}
