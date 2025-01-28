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
import { Notation } from '@services/notationRenderer/Notation';
import { AccidentalData } from '@services/notationRenderer/notes/Notes.types';
import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

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

    IsInRect(positionX: number) {
        const width = this.cachedStaveNote?.getWidth();
        const startX = this.cachedStaveNote?.getAbsoluteX();

        if (!width || !startX) return false;

        return startX <= positionX && startX + width >= positionX;
    }

    set Duration(value: NoteDuration) {
        this.duration = value;
    }

    get Duration(): NoteDuration {
        return this.duration;
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

    GetKeyIndexByPositionY(positionX: number, positionY: number): number {
        const note = this.cachedStaveNote;
        if (!note) return -1;

        const stemPosition = note.getStemX();
        const left = stemPosition > positionX;

        const keysPositions = note.noteHeads.map((noteHead, idx) => {
            const boundingBox = noteHead.getBoundingBox();
            return {
                idx: idx,
                left: boundingBox.x < stemPosition,
                yMin: boundingBox.y,
                yMax: boundingBox.y + boundingBox.h,
            };
        });

        const closestYPredicate = (
            a: { yMin: number; yMax: number },
            b: { yMin: number; yMax: number },
        ) => {
            const distanceA = Math.min(Math.abs(positionY - a.yMin), Math.abs(positionY - a.yMax));
            const distanceB = Math.min(Math.abs(positionY - b.yMin), Math.abs(positionY - b.yMax));
            return distanceA - distanceB;
        };

        const closestLeft = keysPositions
            .filter(position => position.left)
            .sort(closestYPredicate)[0];
        const closestRight = keysPositions
            .filter(position => !position.left)
            .sort(closestYPredicate)[0];

        if (left) {
            return closestLeft ? closestLeft.idx : closestRight ? closestRight.idx : -1;
        }

        return closestRight ? closestRight.idx : closestLeft ? closestLeft.idx : -1;
    }

    GetKey(index: number): Key {
        if (index < 0 || index >= this.keys.length) {
            throw new Error('Index out of bounds.');
        }
        return this.keys[index];
    }

    AddKey(key: Key): boolean {
        if (!key || !key.Pitch) {
            throw new Error('Invalid key data provided.');
        }
        if (this.keys.findIndex(k => k.Pitch.toLowerCase() === key.Pitch.toLowerCase()) === -1) {
            this.keys.push(key);
            this.isNoteDirty = true;
            return true;
        }
        return false;
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

        const isRest = Rests.includes(this.duration);

        const staveNote = new StaveNote({
            keys: isRest ? ['R/5'] : this.keys.map(key => key.Pitch),
            duration: this.DurationSymbol,
            stem_direction: this.GetStemDirection(),
        });

        if (this.color) {
            staveNote.setStyle({
                fillStyle: this.color,
                strokeStyle: this.color,
            });
        }

        this.keys.forEach((key, idx) => {
            if (!key.Color) return;
            staveNote.noteHeads[idx].setStyle({
                fillStyle: key.Color,
                strokeStyle: key.Color,
            });
        });

        if (!isRest) {
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
        }

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

    GetAccidentals(): { pitch: string; accidental: KeyModifier }[] {
        const data: { pitch: string; accidental: KeyModifier }[] = [];
        if (!Rests.includes(this.Duration)) {
            for (const key of this.keys) {
                if (key.Modifier) {
                    data.push({ pitch: key.Pitch, accidental: key.Modifier });
                }
            }
        }

        return data;
    }

    GetAllAccidentalsData(): AccidentalData[] {
        return Notation.getInstance().GetNoteAssociatedBar(this)?.GetAccidentalsData() ?? [];
    }

    AdjustPitch(keyIndex: number, toPitch: string): boolean {
        if (
            this.keys.find(key => key.Pitch.toLowerCase() === toPitch.toLowerCase()) ||
            keyIndex >= this.keys.length ||
            keyIndex < 0
        ) {
            return false;
        }
        this.keys[keyIndex].Pitch = toPitch;
        return true;
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

    Play(startTime: number, index: number): Tone.PolySynth {
        if (!this.keys.length) {
            console.warn('No keys to play.');
            return new PolySynth();
        }

        if (Rests.includes(this.duration)) {
            return new PolySynth();
        }

        const synth = new Tone.PolySynth().toDestination();
        const accidentals = this.GetAllAccidentalsData();
        const pitches = this.keys.map(key =>
            this.GetPitchWithAccidentals(key.Pitch, index, accidentals),
        );

        synth.triggerAttackRelease(pitches, this.DurationValue, startTime);

        return synth;
    }

    GetPitchWithAccidentals(
        keyPitch: string,
        index: number,
        accidentals: AccidentalData[],
    ): string {
        const [pitch, octave] = keyPitch.toUpperCase().split('/');
        let appliedAcc: AccidentalData | null = null;
        for (const acc of accidentals) {
            if (acc.startIndex > index) break;
            if (acc.allOctaves && acc.pitch === pitch) {
                appliedAcc = acc;
            } else if (acc.pitch === keyPitch) {
                appliedAcc = acc;
            }
        }

        const stringAccidental: string =
            appliedAcc && appliedAcc.accidental !== KeyModifier.Natural
                ? appliedAcc.accidental
                : '';

        return `${pitch}${stringAccidental}${octave}`;
    }
}
