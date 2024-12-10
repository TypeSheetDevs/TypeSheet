import { Key } from '@services/notationRenderer/notes/Key';

export class RenderableNote {
    private duration: string;
    private keys: Key[];
    private modifiers: string[];
    private absoluteX: number = 0;
    private color?: string;

    constructor(duration: string, keys: Key[] = [], modifiers: string[] = [], color?: string) {
        this.duration = duration;
        this.keys = keys;
        this.modifiers = modifiers;
        this.color = color;
    }

    getDuration(): string {
        return this.duration;
    }

    getKeys(): Key[] {
        return this.keys;
    }

    getModifiers(): string[] {
        return this.modifiers;
    }

    getAbsoluteX(): number {
        return this.absoluteX;
    }

    getColor(): string | undefined {
        return this.color;
    }

    setAbsoluteX(value: number): void {
        this.absoluteX = value;
    }

    setColor(value: string): void {
        this.color = value;
    }

    AddKey(key: Key): void {
        if (!key || !key.pitch) {
            throw new Error('Invalid key data provided.');
        }
        if (!this.keys.find(k => k.pitch === key.pitch)) {
            this.keys.push(key);
        }
    }

    RemoveKey(index: number): void {
        if (index < 0 || index >= this.keys.length) {
            throw new Error('Index out of bounds.');
        }
        this.keys.splice(index, 1);
    }
}
