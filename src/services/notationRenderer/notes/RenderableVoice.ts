import { Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';

export class RenderableVoice implements IRenderable {
    numBeats: number;
    beatValue: number;
    notes: RenderableNote[];
    positionsX: number[] = [];

    constructor(numBeats: number, beatValue: number, notes: RenderableNote[] = []) {
        this.numBeats = numBeats;
        this.beatValue = beatValue;
        this.notes = notes;
    }

    GetAsVexFlowVoice(): Voice {
        if (!this.numBeats || !this.beatValue) {
            throw new Error('No voice data provided.');
        }

        const voice = new Voice({
            num_beats: this.numBeats,
            beat_value: this.beatValue,
        });

        const staveNotes = this.notes.map(noteData => {
            return new StaveNote({
                keys: noteData.keys.map(keyData => keyData.pitch),
                duration: noteData.duration,
            });
        });

        voice.addTickables(staveNotes);
        return voice;
    }

    GetNoteIndexByPosition(positionX: number): number {
        console.log(positionX, this.positionsX);
        for (let i = 1; i < this.positionsX.length; i++) {
            const diff = this.positionsX[i] - this.positionsX[i - 1];
            if (positionX <= this.positionsX[i - 1] + diff / 2) return i - 1;
        }
        return this.positionsX.length - 1;
    }

    Draw(context: RenderContext, bar: Stave, length: number) {
        const voice = [this.GetAsVexFlowVoice()];
        new Formatter().joinVoices(voice).format(voice, length - 20);
        voice.forEach((voice: Voice) => voice.draw(context, bar));
        this.positionsX = voice[0].getTickables().map(t => t.getAbsoluteX());
    }

    AddNote(note: RenderableNote, index?: number): void {
        if (!note || !note.duration || !note.keys || note.keys.length === 0) {
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
    }

    RemoveNote(index: number): void {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }

        this.notes.splice(index, 1);
        this.numBeats--;
    }
}
