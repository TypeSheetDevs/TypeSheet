import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { Notation } from '@services/notationRenderer/Notation';
import { ChosenEntityData } from '@services/notationRenderer/ChosenEntityData';
import { Key } from '@services/notationRenderer/notes/Key';
import { toRest } from '@services/notationRenderer/notes/Notes.enums';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class AddingNoteIndicator extends NoteIndicator {
    private noteData: ChosenEntityData;
    private visible: boolean = false;
    private key: Key;

    constructor(notation: Notation) {
        super(notation);
        this.noteData = new ChosenEntityData(this.notation);
        this.key = new Key('C/5');
        this.noteData.SetNoteIndex(0, 0, 0);
    }

    protected override RefreshIndicator() {
        if (!this.visible) return;
        if (this.noteData.Note) {
            this.RemoveFromNotation();
        }

        this.AddToNotation();
        EventNotifier.Notify('needsRender');
    }

    private AddToNotation() {
        const voice = this.noteData.Voice;
        if (!voice) {
            return;
        }

        let duration = this.noteDuration;
        if (this.isRest) {
            duration = toRest(this.noteDuration);
        }

        const newNote = new RenderableNote(duration, [this.key], [], this.isDotted, 'blue');
        if (!this.isRest) this.key.Modifier = this.accidental;

        if (this.noteData.NoteIndex >= voice.NotesLength) {
            voice.AddNote(newNote);
        } else {
            voice.AddNote(newNote, this.noteData.NoteIndex);
        }
    }

    private RemoveFromNotation() {
        const voice = this.noteData.Voice;
        if (!voice || !this.noteData.Note) {
            return;
        }

        voice.RemoveNote(this.noteData.NoteIndex);
    }

    private SaveToNotation() {
        this.noteData.Voice?.SetNotesColor('black');
        this.AddToNotation();
    }

    private AdjustPitch(positionY: number) {
        if (!this.visible || !this.noteData.Note || !this.noteData.Bar) return;

        this.key = this.noteData.Bar.getKeyByPositionY(positionY);
        if (!this.isRest) this.key.Modifier = this.accidental;
        this.noteData.Note.RemoveKey(0);
        this.noteData.Note.AddKey(this.key);
    }

    private Move(staveIndex: number, barIndex: number, noteIndex: number) {
        if (this.visible && this.noteData.Note) {
            this.RemoveFromNotation();
        }

        this.noteData.SetNoteIndex(staveIndex, barIndex, noteIndex);
        if (this.visible) {
            this.AddToNotation();
        }
    }

    private set Visible(value: boolean) {
        if (this.visible === value) return;
        this.visible = value;
        if (this.visible) {
            this.AddToNotation();
        } else {
            this.RemoveFromNotation();
        }
    }

    override OnCreation(): void {
        this.Visible = true;
    }
    override OnDestroy(): void {
        this.Visible = false;
    }

    override OnMouseClick() {
        this.SaveToNotation();
    }

    override MovedAtNote(noteData: ChosenEntityData, positionY: number) {
        if (noteData.NoteIndex != -1) {
            this.Move(noteData.StaveIndex, noteData.BarIndex, noteData.NoteIndex);
        }

        if (this.noteData.Voice?.NotesLength === 0) {
            this.Move(this.noteData.StaveIndex, this.noteData.BarIndex, 0);
        } else if (!this.noteData.Voice || !this.noteData.Bar || !this.noteData.Stave) {
            this.Move(0, 0, 0);
        }

        this.AdjustPitch(positionY);
    }
}
