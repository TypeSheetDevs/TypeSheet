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

    get Duration(): string {
        return this.duration;
    }

    get Keys(): Key[] {
        return this.keys;
    }

    get Modifiers(): string[] {
        return this.modifiers;
    }

    get AbsoluteX(): number {
        return this.absoluteX;
    }

    get Color(): string | undefined {
        return this.color;
    }

    set AbsoluteX(value: number) {
        this.absoluteX = value;
    }

    set Color(value: string) {
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
