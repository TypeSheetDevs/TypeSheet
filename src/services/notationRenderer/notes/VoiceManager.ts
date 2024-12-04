import { VoiceData } from '@services/notationRenderer/notes/Notes.interfaces';
import { StaveNote, Voice } from 'vexflow';

export class VoiceManager {
    private voices: VoiceData[] = [];

    public addVoice(voice: VoiceData): void {
        this.voices.push(voice);
    }

    public removeVoice(index: number): void {
        this.voices.splice(index, 1);
    }

    get Voices(): VoiceData[] {
        return this.voices;
    }

    getAsVexFlowVoice(index: number): Voice {
        const voiceData = this.voices[index];
        const voice = new Voice({ num_beats: voiceData.numBeats, beat_value: voiceData.beatValue });
        const notes = voiceData.notes.map(noteData => {
            return new StaveNote({
                keys: noteData.keys.map(keyData => keyData.key),
                duration: noteData.duration,
            });
        });

        voice.addTickables(notes);
        return voice;
    }
}
