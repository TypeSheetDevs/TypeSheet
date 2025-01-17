import { Key } from '@services/notationRenderer/notes/Key';
import { Accidental, Articulation, Dot, StaveNote, Vex } from 'vexflow';
import {
    NoteDuration,
    NoteDurationValues,
    NoteModifier,
    ParseNoteDuration,
    ParseNoteModifier,
    Rests,
} from '@services/notationRenderer/notes/Notes.enums';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';
import { RenderableNoteData } from '@services/notationRenderer/DataStructures/IRecoverable.types';
import * as Tone from 'tone';
import { PolySynth } from 'tone';

const POSITION_ABOVE = Vex.Flow.Articulation.Position.ABOVE;
const POSITION_BELOW = Vex.Flow.Articulation.Position.BELOW;

export class RenderableNote implements IRecoverable<RenderableNoteData> {
    private cachedStaveNote: StaveNote | null = null;
    private isNoteDirty: boolean = true;

    private readonly keys: Key[];
    private readonly modifiers: NoteModifier[];
    private duration: NoteDuration;
    private dotted: boolean;
    private color?: string;
    private absoluteX: number = 0;

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

    set Duration(value: NoteDuration) {
        this.duration = value;
    }

    get AbsoluteX(): number {
        return this.absoluteX;
    }

    set AbsoluteX(value: number) {
        this.absoluteX = value;
    }

    set Color(value: string) {
        this.color = value;
        this.isNoteDirty = true;
    }

    get Dotted(): boolean {
        return this.dotted;
    }

    set Dotted(value: boolean) {
        this.dotted = value;
        this.isNoteDirty = true;
    }

    get DurationValue(): number {
        return NoteDurationValues[this.duration] * (this.dotted ? 1.5 : 1);
    }

    get DurationSymbol(): string {
        return this.duration + (this.dotted ? 'd' : '');
    }

    get KeysLength(): number {
        return this.keys.length;
    }

    get IsDirty(): boolean {
        return !this.cachedStaveNote || this.isNoteDirty || this.keys.some(k => k.IsKeyDirty);
    }

    GetKey(index: number): Key {
        if (index < 0 || index >= this.keys.length) {
            throw new Error('Index out of bounds.');
        }
        return this.keys[index];
    }

    AddKey(key: Key): void {
        if (!key || !key.Pitch) {
            throw new Error('Invalid key data provided.');
        }
        if (!this.keys.find(k => k.Pitch === key.Pitch)) {
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
        if (!this.IsDirty) {
            return this.cachedStaveNote!;
        }

        const staveNote = new StaveNote({
            keys: this.keys.map(key => key.Pitch),
            duration: this.DurationSymbol,
            stem_direction: this.GetStemDirection(),
        });

        if (this.color) {
            staveNote.setStyle({
                fillStyle: this.color,
                strokeStyle: this.color,
            });
        }

        this.keys.forEach((key, index) => {
            if (key.Modifier) {
                staveNote.addModifier(new Accidental(key.Modifier), index);
            }
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
        return this.keys.every(key => !this.IsHighPitch(key.Pitch)) ? 1 : -1;
    }

    GetModifierPosition(): number {
        return this.keys.some(key => this.IsHighPitch(key.Pitch)) ? POSITION_ABOVE : POSITION_BELOW;
    }

    private IsHighPitch(pitch: string): boolean {
        return parseInt(pitch[pitch.length - 1], 10) >= 5;
    }

    ToData(): RenderableNoteData {
        return {
            keysData: this.keys.map(k => k.ToData()),
            duration: this.duration,
            dotted: this.dotted,
            modifiers: this.modifiers.map(modifier => modifier.toString()),
            color: this.color,
        };
    }

    static FromData(data: RenderableNoteData): RenderableNote {
        const duration = ParseNoteDuration(data.duration);
        if (!duration) {
            throw new Error('Duration not set');
        }
        const keys = (data.keysData ?? []).map(key => Key.FromData(key)).filter(key => key);
        if (keys.length === 0) {
            throw new Error('Note has no keys.');
        }

        return new RenderableNote(
            duration,
            keys,
            (data.modifiers ?? [])
                .map(modifier => ParseNoteModifier(modifier))
                .filter(modifier => modifier) as NoteModifier[],
            data.dotted,
            data.color,
        );
    }

    Play(startTime: number): Tone.PolySynth {
        if (!this.keys.length) {
            console.warn('No keys to play.');
            return new PolySynth();
        }

        if (Rests.includes(this.duration)) {
            return new PolySynth();
        }

        const synth = new Tone.PolySynth().toDestination();

        const pitches = this.keys.map(key => key.TonePitch);

        synth.triggerAttackRelease(pitches, this.DurationValue, startTime);

        return synth;
    }
}
