import { Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { NoteData } from '@services/notationRenderer/notes/NoteData';
import { VoiceData } from '@services/notationRenderer/notes/VoiceData';

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
                keys: noteData.keys.map(keyData => keyData.pitch),
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
        this.voiceData.AddNote(note, index);
    }

    public RemoveNote(index: number): void {
        this.voiceData.RemoveNote(index);
    }
}
