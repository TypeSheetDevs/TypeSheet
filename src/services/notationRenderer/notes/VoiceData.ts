import { NoteData } from '@services/notationRenderer/notes/NoteData';

export interface VoiceData {
    numBeats: number;
    beatValue: number;
    notes: NoteData[];
}
