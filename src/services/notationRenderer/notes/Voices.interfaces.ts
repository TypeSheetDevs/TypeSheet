// used more like irl note, but wanted to be consistent with VexFlow
export interface KeyData {
    key: string;
    modifiers: string[];
}

// used more like irl chord, but wanted to be consistent with VexFlow
export interface NoteData {
    duration: string;
    keys: KeyData[];
    modifiers: string[];
}

export interface VoiceData {
    numBeats: number;
    beatValue: number;
    notes: NoteData[];
}
