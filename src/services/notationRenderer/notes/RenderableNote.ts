import { Key } from '@services/notationRenderer/notes/Key';

export class RenderableNote {
    duration: string;
    keys: Key[];
    modifiers: string[];
    absoluteX: number = 0;
    color?: string;

    constructor(duration: string, keys: Key[] = [], modifiers: string[] = [], color?: string) {
        this.duration = duration;
        this.keys = keys;
        this.modifiers = modifiers;
        this.color = color;
    }

    public getAbsoluteX(): number {
        return this.absoluteX;
    }

    public setAbsoluteX(value: number): void {
        this.absoluteX = value;
    }

    public setColor(value: string): void {
        this.color = value;
    }

    public AddKey(key: Key): void {
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
