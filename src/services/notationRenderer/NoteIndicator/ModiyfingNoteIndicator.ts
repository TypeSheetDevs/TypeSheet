import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { ChosenEntityData } from '../ChosenEntityData';
import { Notation } from '@services/notationRenderer/Notation';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { IsRest, RestToNote, toRest } from '@services/notationRenderer/notes/Notes.enums';
import { Key } from '@services/notationRenderer/notes/Key';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import { ParseKeyModifier } from '@services/notationRenderer/notes/Key.enums';

export class ModiyfingNoteIndicator extends NoteIndicator {
    private hoveredNoteData: ChosenEntityData;
    private selectedNoteData: ChosenEntityData;

    constructor(notation: Notation) {
        super(notation);
        this.hoveredNoteData = new ChosenEntityData(this.notation);
        this.selectedNoteData = new ChosenEntityData(this.notation);
        EventNotifier.AddListener('midiPlayed', this.HandlePlayedMidi.bind(this));
    }

    private HandlePlayedMidi(keys: string[]) {
        if (!this.selectedNoteData.Note) {
            return;
        }

        this.selectedNoteData.Voice!.RemoveNote(this.selectedNoteData.NoteIndex);
        this.selectedNoteData.Voice!.AddNote(
            new RenderableNote(
                this.noteDuration,
                keys.map(k => {
                    return new Key(k, ParseKeyModifier(k[1]));
                }),
                [],
                this.isDotted,
            ),
            this.selectedNoteData.NoteIndex++,
        );
        this.RefreshIndicator();
    }

    private ClearColors() {
        if (this.selectedNoteData.Note) {
            this.selectedNoteData.Note.Color = 'black';
        }
        if (this.hoveredNoteData.Note) {
            this.hoveredNoteData.Note.Color = 'black';
        }
    }

    private ColorSelectedNote(isColored: boolean) {
        if (!this.selectedNoteData.Note) return;
        if (this.hoveredNoteData.Note === this.selectedNoteData.Note) {
            this.selectedNoteData.Note.Color = isColored ? 'red' : 'blue';
        } else {
            this.selectedNoteData.Note.Color = isColored ? 'red' : 'black';
        }
    }

    private ColorHoveredNote(isColored: boolean) {
        if (!this.hoveredNoteData.Note || this.selectedNoteData.Note === this.hoveredNoteData.Note)
            return;
        this.hoveredNoteData.Note.Color = isColored ? 'blue' : 'black';
    }

    private OnSelectingNote() {
        this.selectedNoteData.SetNoteIndex(
            this.hoveredNoteData.StaveIndex,
            this.hoveredNoteData.BarIndex,
            this.hoveredNoteData.NoteIndex,
        );

        this.ColorSelectedNote(true);
        if (!this.selectedNoteData.Note) throw new Error('Invalid note selected');

        this.noteDuration = this.selectedNoteData.Note.Duration;
        this.accidental = this.selectedNoteData.Note.GetKey(0).Modifier;
        this.isDotted = this.selectedNoteData.Note.Dotted;
        this.isRest = IsRest(this.selectedNoteData.Note.DurationSymbol);

        EventNotifier.Notify('modifyingNoteSelectionChanged', {
            isRest: this.isRest,
            duration: RestToNote(this.noteDuration),
            accidental: this.accidental,
            isDotted: this.isDotted,
        });
    }

    protected RefreshIndicator(): void {
        if (!this.selectedNoteData.Note) {
            EventNotifier.Notify('needsRender');
            return;
        }

        let duration = this.noteDuration;
        if (this.isRest) {
            duration = toRest(this.noteDuration);
        }

        this.selectedNoteData.Note.Dotted = this.isDotted;
        this.selectedNoteData.Note.Duration = duration;
        if (!this.isRest) this.selectedNoteData.Note.GetKey(0).Modifier = this.accidental;

        EventNotifier.Notify('needsRender');
    }

    public OnCreation(): void {}
    public OnDestroy(): void {
        this.ClearColors();
    }

    public MovedAtNote(noteData: ChosenEntityData, _positionY: number): void {
        if (noteData.NoteIndex !== -1) {
            this.ColorHoveredNote(false);
            this.hoveredNoteData.SetNoteIndex(
                noteData.StaveIndex,
                noteData.BarIndex,
                noteData.NoteIndex,
            );
            this.ColorHoveredNote(true);
        }
    }

    public OnMouseClick(): void {
        if (this.selectedNoteData.Note) {
            this.ColorSelectedNote(false);
            this.selectedNoteData.SetNoteIndex(-1, -1, -1);
        } else {
            this.OnSelectingNote();
        }
    }
}
