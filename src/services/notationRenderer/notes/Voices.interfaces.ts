export class KeyData {
    key: string;
    modifiers: string[];

    constructor(key: string, modifiers: string[] = []) {
        this.key = key;
        this.modifiers = modifiers;
    }
}

export class NoteData {
    duration: string;
    keys: KeyData[];
    modifiers: string[];

    constructor(duration: string, keys: KeyData[] = [], modifiers: string[] = []) {
        this.duration = duration;
        this.keys = keys;
        this.modifiers = modifiers;
    }

    addKey(key: KeyData): void {
        this.keys.push(key);
    }

    addModifier(modifier: string): void {
        this.modifiers.push(modifier);
    }
}

export class VoiceData {
    numBeats: number;
    beatValue: number;
    notes: NoteData[];

    constructor(numBeats: number, beatValue: number, notes: NoteData[] = []) {
        this.numBeats = numBeats;
        this.beatValue = beatValue;
        this.notes = notes;
    }

    addNote(note: NoteData): void {
        this.notes.push(note);
    }
}
