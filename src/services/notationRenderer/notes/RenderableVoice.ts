import { Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { NoteData, VoiceData } from '@services/notationRenderer/notes/Voices.interfaces';

export class RenderableVoice implements IRenderable {
    voiceData: VoiceData;

    constructor(voiceData: VoiceData) {
        this.voiceData = voiceData;
    }

    GetAsVexFlowVoice(): Voice {
        if (!this.voiceData) {
            throw new Error('No voice data provided.');
        }

        const voice = new Voice({
            num_beats: this.voiceData.numBeats,
            beat_value: this.voiceData.beatValue,
        });

        const notes = this.voiceData.notes.map(noteData => {
            return new StaveNote({
                keys: noteData.keys.map(keyData => keyData.key),
                duration: noteData.duration,
            });
        });

        voice.addTickables(notes);
        return voice;
    }

    // used for drawing one specific voice, shorter version of one above
    Draw(context: RenderContext, bar: Stave, length: number) {
        const voice = [this.GetAsVexFlowVoice()];
        new Formatter().joinVoices(voice).format(voice, length - 20);
        voice.forEach((voice: Voice) => voice.draw(context, bar));
    }

    public AddNote(note: NoteData, index?: number): void {
        if (!note || !note.duration || !note.keys || note.keys.length === 0) {
            throw new Error('Invalid note data provided.');
        }

        if (index !== undefined) {
            if (index < 0 || index > this.voiceData.notes.length) {
                throw new Error('Index out of bounds.');
            }
            this.voiceData.notes.splice(index, 0, note);
        } else {
            this.voiceData.notes.push(note);
        }
    }

    public RemoveNote(index: number): void {
        if (index < 0 || index >= this.voiceData.notes.length) {
            throw new Error('Index out of bounds.');
        }

        this.voiceData.notes.splice(index, 1);
    }
}
