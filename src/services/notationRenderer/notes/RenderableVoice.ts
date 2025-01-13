import { Beam, Formatter, Note, RenderContext, Stave, StaveTie, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';

export class RenderableVoice implements IRenderable {
    private cachedVoice: Voice | null = null;
    private isVoiceDirty: boolean = true;
    private cachedNotes: Note[] = [];

    private readonly notes: RenderableNote[];
    private readonly ties: [number, number][] = [];
    private numBeats: number;
    private beatValue: number;

    constructor(beatValue: number, notes: RenderableNote[] = []) {
        this.beatValue = beatValue;
        this.notes = notes;
        this.numBeats = this.CalculateNumBeats();
    }

    set BeatValue(beatValue: number) {
        this.beatValue = beatValue;
        this.isVoiceDirty = true;
    }

    SetNotesColor(color: string): void {
        this.notes.forEach(note => (note.Color = color));
        this.isVoiceDirty = true;
    }

    get NotesLength(): number {
        return this.notes.length;
    }

    GetAsVexFlowVoice(): Voice {
        if (this.cachedVoice && !this.isVoiceDirty) {
            return this.cachedVoice;
        }

        const voice = new Voice({
            num_beats: this.numBeats,
            beat_value: this.beatValue,
        });

        this.cachedNotes = this.notes.map(note => note.GetAsVexFlowNote());

        voice.addTickables(this.cachedNotes);

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

        this.ties.forEach(tie => {
            const staveTie = new StaveTie({
                first_note: this.cachedNotes[tie[0]],
                last_note: this.cachedNotes[tie[1]],
                first_indices: [0],
                last_indices: [0],
            });
            staveTie.setContext(context).draw();
        });

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

        this.numBeats = this.CalculateNumBeats();
        this.isVoiceDirty = true;
    }

    RemoveNote(index: number): void {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }
        this.notes.splice(index, 1);

        this.numBeats = this.CalculateNumBeats();
        this.isVoiceDirty = true;
    }

    AddTie(startNoteIndex: number, endNoteIndex: number): void {
        if (
            startNoteIndex < 0 ||
            startNoteIndex >= this.notes.length ||
            endNoteIndex < 0 ||
            endNoteIndex >= this.notes.length
        ) {
            throw new Error('Index out of bounds for tie.');
        }

        this.ties.push([startNoteIndex, endNoteIndex]);
    }

    RemoveTie(startNoteIndex: number, endNoteIndex: number): void {
        if (
            startNoteIndex < 0 ||
            startNoteIndex >= this.notes.length ||
            endNoteIndex < 0 ||
            endNoteIndex >= this.notes.length
        ) {
            throw new Error('Index out of bounds for tie.');
        }

        for (let i = 0; i < this.ties.length; i++) {
            if (this.ties[i][0] === startNoteIndex && this.ties[i][1] === endNoteIndex) {
                this.ties.splice(i, 1);
                break;
            }
        }
    }

    private CalculateNumBeats(): number {
        return this.notes.reduce((totalBeats, note) => {
            const noteDurationValue = note.DurationValue;
            return totalBeats + noteDurationValue;
        }, 0);
    }
}
