import { Key } from '@services/notationRenderer/notes/Key';
import { Accidental, StaveNote } from 'vexflow';
import { NoteDuration, NoteDurationValues } from '@services/notationRenderer/notes/Notes.enums';

export class RenderableNote {
    private duration: NoteDuration;
    private keys: Key[];
    private modifiers: string[];
    private absoluteX: number = 0;
    private color?: string;
    private cachedStaveNote: StaveNote | null = null;
    private isNoteDirty: boolean = true;

    constructor(
        duration: NoteDuration,
        keys: Key[] = [],
        modifiers: string[] = [],
        color?: string,
    ) {
        this.duration = duration;
        this.keys = keys;
        this.modifiers = modifiers;
        this.color = color;
    }

    get DurationValue(): number {
        return NoteDurationValues[this.duration];
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
        this.isNoteDirty = true;
    }

    AddKey(key: Key): void {
        if (!key || !key.pitch) {
            throw new Error('Invalid key data provided.');
        }
        if (!this.keys.find(k => k.pitch === key.pitch)) {
            this.keys.push(key);
            this.isNoteDirty = true;
        }
    }

    RemoveKey(index: number): void {
        if (index < 0 || index >= this.keys.length) {
            throw new Error('Index out of bounds.');
        }
        this.keys.splice(index, 1);
        this.isNoteDirty = true;
    }

    GetAsVexFlowNote(): StaveNote {
        if (this.cachedStaveNote && !this.isNoteDirty) {
            return this.cachedStaveNote;
        }

        const staveNote = new StaveNote({
            keys: this.keys.map(key => key.pitch),
            duration: this.duration,
        });

        if (this.color) {
            staveNote.setStyle({
                fillStyle: this.color,
                strokeStyle: this.color,
            });
        }

        this.keys.forEach((key, index) => {
            key.modifiers.forEach(modifier => {
                staveNote.addModifier(new Accidental(modifier as string), index);
            });
        });

        this.cachedStaveNote = staveNote;
        this.isNoteDirty = false;

        return staveNote;
    }
}
