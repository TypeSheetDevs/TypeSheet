import { Key } from '@services/notationRenderer/notes/Key';
import { Accidental, Articulation, Dot, StaveNote, Vex } from 'vexflow';
import {
    NoteDuration,
    NoteDurationValues,
    NoteModifier,
} from '@services/notationRenderer/notes/Notes.enums';

const POSITION_ABOVE = Vex.Flow.Articulation.Position.ABOVE;
const POSITION_BELOW = Vex.Flow.Articulation.Position.BELOW;

export class RenderableNote {
    private duration: NoteDuration;
    private keys: Key[];
    private modifiers: NoteModifier[];
    private dotted: boolean;

    private absoluteX: number = 0;
    private color?: string;

    private cachedStaveNote: StaveNote | null = null;
    private isNoteDirty: boolean = true;

    constructor(
        duration: NoteDuration,
        keys: Key[] = [],
        modifiers: NoteModifier[] = [],
        dotted: boolean = false,
        color?: string,
    ) {
        this.duration = duration;
        this.keys = keys;
        this.modifiers = modifiers;
        this.dotted = dotted;
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

    GetKey(index: number): Key {
        if (index < 0 || index >= this.keys.length) {
            throw new Error('Index out of bounds.');
        }
        return this.keys[index];
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
        if (this.cachedStaveNote && !this.isNoteDirty && this.keys.every(k => !k.IsKeyDirty)) {
            return this.cachedStaveNote;
        }

        const staveNote = new StaveNote({
            keys: this.keys.map(key => key.pitch),
            duration: this.duration,
            stem_direction: this.GetStemDirection(),
        });

        if (this.color) {
            staveNote.setStyle({
                fillStyle: this.color,
                strokeStyle: this.color,
            });
        }

        this.keys.forEach((key, index) => {
            key.modifiers.forEach(modifier => {
                staveNote.addModifier(new Accidental(modifier), index);
            });
            key.SetNotDirty();
        });

        this.modifiers.forEach(modifier => {
            staveNote.addModifier(
                new Articulation(modifier).setPosition(this.GetModifierPosition()),
            );
        });

        if (this.dotted) {
            Dot.buildAndAttach([staveNote], { all: true });
        }

        this.cachedStaveNote = staveNote;
        this.isNoteDirty = false;

        return staveNote;
    }

    private GetStemDirection(): number {
        return this.keys.every(key => !this.IsHighPitch(key.pitch)) ? 1 : -1;
    }

    private GetModifierPosition(): number {
        return this.keys.some(key => this.IsHighPitch(key.pitch)) ? POSITION_ABOVE : POSITION_BELOW;
    }

    private IsHighPitch(pitch: string): boolean {
        return parseInt(pitch[pitch.length - 1], 10) >= 5;
    }
}
