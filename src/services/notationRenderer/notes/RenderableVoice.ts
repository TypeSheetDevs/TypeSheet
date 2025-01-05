import { Beam, Formatter, RenderContext, Stave, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';
import { RenderableVoiceData } from '@services/notationRenderer/DataStructures/IRecoverable.types';

export class RenderableVoice
    implements IRenderable, IRecoverable<RenderableVoice, RenderableVoiceData>
{
    private cachedVoice: Voice | null = null;
    private isVoiceDirty: boolean = true;

    private readonly notes: RenderableNote[];
    private numBeats: number;
    private beatValue: number;

    constructor(beatValue: number, notes: RenderableNote[] = []) {
        this.beatValue = beatValue;
        this.notes = notes;
        this.numBeats = this.calculateNumBeats();
    }

    public toJSON() {
        const { cachedVoice, isVoiceDirty, ...rest } = this;
        return rest;
    }

    set BeatValue(beatValue: number) {
        this.beatValue = beatValue;
        this.isVoiceDirty = true;
    }

    SetNotesColor(color: string): void {
        this.notes.forEach(note => (note.Color = color));
        this.isVoiceDirty = true;
    }

    GetAsVexFlowVoice(): Voice {
        if (this.cachedVoice && !this.isVoiceDirty) {
            return this.cachedVoice;
        }

        const voice = new Voice({
            num_beats: this.numBeats,
            beat_value: this.beatValue,
        });

        voice.addTickables(this.notes.map(note => note.GetAsVexFlowNote()));

        this.cachedVoice = voice;
        this.isVoiceDirty = false;

        return voice;
    }

    Draw(context: RenderContext, bar: Stave, length: number): void {
        if (this.notes.length === 0) return;

        const voice = this.GetAsVexFlowVoice();
        new Formatter().joinVoices([voice]).format([voice], length - 20);
        const beams = Beam.applyAndGetBeams(voice);
        voice.draw(context, bar);
        beams.forEach(beam => beam.setContext(context).draw());

        const absoluteXs = voice.getTickables().map(t => t.getAbsoluteX());
        this.notes.forEach((note, index) => (note.AbsoluteX = absoluteXs[index]));
    }

    GetNoteIndexByPositionX(positionX: number): number {
        const positionsX = this.notes.map(n => n.AbsoluteX);
        console.log(positionX, positionsX);
        for (let i = 1; i < positionsX.length; i++) {
            const diff = positionsX[i] - positionsX[i - 1];
            if (positionX <= positionsX[i - 1] + diff / 2) return i - 1;
        }
        return positionsX.length - 1;
    }

    GetNote(index: number): RenderableNote {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }
        return this.notes[index];
    }

    AddNote(note: RenderableNote, index?: number): void {
        if (!note || note.KeysLength === 0) {
            throw new Error('Invalid note data provided.');
        }

        if (index !== undefined) {
            if (index < 0 || index > this.notes.length) {
                throw new Error('Index out of bounds.');
            }
            this.notes.splice(index, 0, note);
        } else {
            this.notes.push(note);
        }

        this.numBeats = this.calculateNumBeats();
        this.isVoiceDirty = true;
    }

    RemoveNote(index: number): void {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }
        this.notes.splice(index, 1);

        this.numBeats = this.calculateNumBeats();
        this.isVoiceDirty = true;
    }

    private calculateNumBeats(): number {
        return this.notes.reduce((totalBeats, note) => {
            const noteDurationValue = note.DurationValue;
            return totalBeats + noteDurationValue;
        }, 0);
    }

    FromData(data: RenderableVoiceData): RenderableVoice {
        console.log(data);
        return null!;
    }

    ToData(): RenderableVoiceData {
        return { beatValue: this.beatValue, notesData: this.notes.map(note => note.ToData()) };
    }
}
