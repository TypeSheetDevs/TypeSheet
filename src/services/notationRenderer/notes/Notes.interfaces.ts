export interface KeyData {
    key: string;
    modifiers: string[];
}

export interface NoteData {
    duration: string;
    keys: KeyData[];
}

export interface VoiceData {
    numBeats: number;
    beatValue: number;
    notes: NoteData[];
}
