import { Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';
import { IRenderable } from '@services/notationRenderer/IRenderable';
import { VoiceData } from '@services/notationRenderer/notes/Voices.interfaces';

export class RenderableVoice implements IRenderable {
    voiceData: VoiceData;

    constructor(voiceData: VoiceData) {
        this.voiceData = voiceData;
    }

    static GetAsVexFlowVoices(voiceDatas: VoiceData[]): Voice[] {
        if (!voiceDatas) {
            throw new Error('No voices found for the given RenderableBar.');
        }

        return voiceDatas.map(voiceData => {
            const voice = new Voice({
                num_beats: voiceData.numBeats,
                beat_value: voiceData.beatValue,
            });

            const notes = voiceData.notes.map(noteData => {
                return new StaveNote({
                    keys: noteData.keys.map(keyData => keyData.key),
                    duration: noteData.duration,
                });
            });

            voice.addTickables(notes);
            return voice;
        });
    }

    // used for drawing one specific voice, shorter version of one above
    Draw(context: RenderContext, bar: Stave, length: number) {
        const voice = RenderableVoice.GetAsVexFlowVoices([this.voiceData]);
        new Formatter().joinVoices(voice).format(voice, length - 20);
        voice.forEach((voice: Voice) => voice.draw(context, bar));
    }
}
