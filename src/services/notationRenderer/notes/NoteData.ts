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

    public AddKey(key: KeyData): void {
        if (!key || !key.pitch) {
            throw new Error('Invalid key data provided.');
        }
        if (!this.keys.find(k => k.pitch === key.pitch)) {
            this.keys.push(key);
        }
    }

    public RemoveKey(index: number): void {
        if (index < 0 || index >= this.keys.length) {
            throw new Error('Index out of bounds.');
        }
        this.keys.splice(index, 1);
    }
}
