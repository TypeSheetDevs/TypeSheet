import { Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';

export class RenderableVoice implements IRenderable {
    numBeats: number;
    beatValue: number;
    notes: RenderableNote[];

    constructor(beatValue: number, notes: RenderableNote[] = []) {
        this.beatValue = beatValue;
        this.notes = notes;
        this.numBeats = this.calculateNumBeats();
    }

    GetAsVexFlowVoice(): Voice {
        const voice = new Voice({
            num_beats: this.numBeats,
            beat_value: this.beatValue,
        });

        voice.addTickables(
            this.notes.map(noteData => {
                const staveNote = new StaveNote({
                    keys: noteData.keys.map(keyData => keyData.pitch),
                    duration: noteData.duration,
                });

                if (noteData.color) {
                    staveNote.setStyle({ fillStyle: noteData.color, strokeStyle: noteData.color });
                }

                return staveNote;
            }),
        );
        return voice;
    }

    Draw(context: RenderContext, bar: Stave, length: number) {
        if (this.notes.length === 0) return;
        const voice = [this.GetAsVexFlowVoice()];
        new Formatter().joinVoices(voice).format(voice, length - 20);
        voice.forEach((voice: Voice) => voice.draw(context, bar));

        // assign absoluteXs to RenderableNotes
        const absoluteXs = voice[0].getTickables().map(t => t.getAbsoluteX());
        this.notes.forEach((note, index) => note.setAbsoluteX(absoluteXs[index]));
    }

    GetNoteIndexByPositionX(positionX: number): number {
        const positionsX = this.notes.map(n => n.getAbsoluteX());
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

        this.numBeats = this.calculateNumBeats();
    }

    RemoveNote(index: number): void {
        if (index < 0 || index >= this.notes.length) {
            throw new Error('Index out of bounds.');
        }
        this.notes.splice(index, 1);

        this.numBeats = this.calculateNumBeats();
    }

    SetNotesColor(color: string): void {
        this.notes.forEach(note => note.setColor(color));
    }

    private calculateNumBeats(): number {
        return this.notes.reduce((totalBeats, note) => {
            const noteDurationValue = this.getDurationValue(note.duration);
            return totalBeats + noteDurationValue;
        }, 0);
    }

    private getDurationValue(duration: string): number {
        const durationMap: { [key: string]: number } = {
            w: 4, // Whole note
            h: 2, // Half note
            q: 1, // Quarter note
            '8': 0.5, // Eighth note
            '16': 0.25, // Sixteenth note
        };
        return durationMap[duration] || 0; // Default to 0 if duration is invalid
    }
}
