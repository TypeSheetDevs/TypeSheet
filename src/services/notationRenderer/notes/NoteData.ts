import { KeyData } from '@services/notationRenderer/notes/KeyData';

export class NoteData {
    duration: string;
    keys: KeyData[];
    modifiers: string[];

    constructor(duration: string, keys: KeyData[] = [], modifiers: string[] = []) {
        this.duration = duration;
        this.keys = keys;
        this.modifiers = modifiers;
    }
}
