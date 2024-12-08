import { NoteData } from '@services/notationRenderer/notes/NoteData';

export class VoiceData {
    numBeats: number;
    beatValue: number;
    notes: NoteData[];

    constructor(numBeats: number, beatValue: number, notes: NoteData[] = []) {
        this.numBeats = numBeats;
        this.beatValue = beatValue;
        this.notes = notes;
    }

    public AddNote(note: NoteData, index?: number): void {
        if (!note || !note.duration || !note.keys || note.keys.length === 0) {
            throw new Error('Invalid note data provided.');
        }

        if (index !== undefined) {
            if (index < 0 || index > this.notes.length) {
                throw new Error('Index out of bounds.');
            }
            this.notes.splice(index, 0, note);
        } else {
            this.notes.push(note);
        }
    }

    public RemoveNote(index: number): void {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }

        this.notes.splice(index, 1);
    }
}
