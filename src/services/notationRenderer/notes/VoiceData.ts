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
}
