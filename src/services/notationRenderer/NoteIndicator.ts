import { Notation } from '@services/notationRenderer/Notation';
import { ChosenEntityData } from '@services/notationRenderer/ChosenEntityData';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';
import { Key } from '@services/notationRenderer/notes/Key';
import EventNotifier from '@services/eventNotifier/eventNotifier';

export class NoteIndicator {
    private readonly notation: Notation;
    private noteData: ChosenEntityData;
    private visible: boolean = false;
    private noteDuration: NoteDuration;
    private isDotted: boolean = false;

    constructor(notation: Notation) {
        this.notation = notation;
        this.noteData = new ChosenEntityData(this.notation);
        this.noteDuration = NoteDuration.Eighth;
    }

    private RefreshIndicator() {
        if (!this.visible) return;
        if (this.noteData.Note) {
            this.RemoveFromNotation();
        }

        this.AddToNotation();
    }

    private AddToNotation() {
        const voice = this.noteData.Voice;
        if (!voice) {
            return;
        }

        const newNote = new RenderableNote(
            this.noteDuration,
            [new Key('C/5')],
            [],
            this.isDotted,
            'blue',
        );

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

    set Visible(value: boolean) {
        if (this.visible === value) return;

        this.visible = value;
        if (this.visible) {
            this.AddToNotation();
        } else {
            this.RemoveFromNotation();
        }
    }

    set Dotted(value: boolean) {
        this.isDotted = value;
        this.RefreshIndicator();
        EventNotifier.Notify('needsRender');
    }

    set NoteDuration(duration: NoteDuration) {
        this.noteDuration = duration;
        this.RefreshIndicator();
    }

    SaveToNotation() {
        this.noteData.Voice?.SetNotesColor('black');
        this.AddToNotation();
    }

    AdjustPitch(positionY: number) {
        if (!this.visible || !this.noteData.Note || !this.noteData.Bar) return;

        this.noteData.Note.RemoveKey(0);
        this.noteData.Note.AddKey(this.noteData.Bar.getKeyByPositionY(positionY));
    }

    MoveIndicator(staveIndex: number, barIndex: number, noteIndex: number) {
        if (this.visible && this.noteData.Note) {
            this.RemoveFromNotation();
        }

        this.noteData.SetNoteIndex(staveIndex, barIndex, noteIndex);
        if (this.visible) {
            this.AddToNotation();
        }
    }
}
