import { Formatter, RenderContext, Stave, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';

export class RenderableVoice implements IRenderable {
    private numBeats: number;
    private beatValue: number;
    private notes: RenderableNote[];
    private cachedVoice: Voice | null = null;
    private isVoiceDirty: boolean = true;

    constructor(beatValue: number, notes: RenderableNote[] = []) {
        this.beatValue = beatValue;
        this.notes = notes;
        this.numBeats = this.calculateNumBeats();
    }

    private calculateNumBeats(): number {
        return this.notes.reduce((totalBeats, note) => {
            const noteDurationValue = this.getDurationValue(note.Duration);
            return totalBeats + noteDurationValue;
        }, 0);
    }

    private getDurationValue(duration: string): number {
        const durationMap: { [key: string]: number } = {
            w: 4,
            h: 2,
            q: 1,
            '8': 0.5,
            '16': 0.25,
        };
        return durationMap[duration] || 0;
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
        voice.draw(context, bar);

        // Assign absoluteXs to RenderableNotes
        const absoluteXs = voice.getTickables().map(t => t.getAbsoluteX());
        this.notes.forEach((note, index) => (note.AbsoluteX = absoluteXs[index]));
    }

    AddNote(note: RenderableNote, index?: number): void {
        if (!note || !note.Duration || !note.Keys?.length) {
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

    SetNotesColor(color: string): void {
        this.notes.forEach(note => (note.Color = color));
        this.isVoiceDirty = true;
    }
}
