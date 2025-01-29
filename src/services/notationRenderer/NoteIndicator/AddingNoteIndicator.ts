import { NoteIndicator } from '@services/notationRenderer/NoteIndicator/NoteIndicator';
import { Notation } from '@services/notationRenderer/Notation';
import { ChosenEntityData } from '@services/notationRenderer/ChosenEntityData';
import { Key } from '@services/notationRenderer/notes/Key';
import { toRest } from '@services/notationRenderer/notes/Notes.enums';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { ParseKeyModifier } from '@services/notationRenderer/notes/Key.enums';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

export class AddingNoteIndicator extends NoteIndicator {
    private noteData: ChosenEntityData;
    private visible: boolean = false;
    private key: Key;

    constructor(notation: Notation) {
        super(notation);
        this.noteData = new ChosenEntityData(this.notation);
        this.key = new Key('C/5');
        this.noteData.SetNoteIndex(0, 0, 0);
        EventNotifier.AddListener('midiPlayed', this.HandlePlayedMidi.bind(this));
    }

    private HandlePlayedMidi(keys: string[]) {
        if (!this.noteData.Voice) return;

        this.noteData.Voice.AddNote(
            new RenderableNote(
                this.noteDuration,
                keys.map(k => {
                    return new Key(k, ParseKeyModifier(k[1]));
                }),
            ),
            this.noteData.NoteIndex++,
        );
        this.RefreshIndicator();
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

        const newNote = new RenderableNote(
            duration,
            [this.key],
            [],
            this.isDotted,
            ConfigService.getInstance().getValue(SavedParameterName.HoveredNoteColor),
        );
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
        EventNotifier.RemoveListener('midiPlayed', this.HandlePlayedMidi.bind(this));
    }

    override OnMouseClick() {
        this.SaveToNotation();
    }

    override MovedAtNote(noteData: ChosenEntityData, positionY: number) {
        if (noteData.NoteIndex != -1) {
            this.Move(noteData.StaveIndex, noteData.BarIndex, noteData.NoteIndex);
        }

        if (noteData.Voice?.NotesLength === 0) {
            this.Move(noteData.StaveIndex, noteData.BarIndex, 0);
        }

        this.AdjustPitch(positionY);
    }
}
