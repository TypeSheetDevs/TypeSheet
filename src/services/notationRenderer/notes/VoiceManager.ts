import { VoiceData } from '@services/notationRenderer/notes/Notes.interfaces';
import { StaveNote, Voice } from 'vexflow';
import RenderableBar from '@services/notationRenderer/RenderableBar';

export class VoiceManager {
    private static _instance: VoiceManager = null!;
    private voices: Map<RenderableBar, VoiceData[]> = new Map();

    static getInstance() {
        return VoiceManager._instance || new VoiceManager();
    }

    constructor() {
        if (VoiceManager._instance === null) {
            VoiceManager._instance = this;
            return this;
        } else return VoiceManager._instance;
    }

    public addVoice(bar: RenderableBar, voice: VoiceData): void {
        const existingVoices = this.voices.get(bar);

        if (existingVoices) {
            existingVoices.push(voice);
        } else {
            this.voices.set(bar, [voice]);
        }
    }

    public removeVoice(bar: RenderableBar, index: number): void {
        const voices = this.voices.get(bar);

        if (!voices) {
            throw new Error('RenderableBar not found in voices map.');
        }

        if (index < 0 || index >= voices.length) {
            throw new Error('Index out of bounds.');
        }

        voices.splice(index, 1);

        if (voices.length === 0) {
            this.voices.delete(bar);
        }
    }

    getAsVexFlowVoices(bar: RenderableBar): Voice[] {
        const voiceDataArray = this.voices.get(bar);

        if (!voiceDataArray) {
            throw new Error('No voices found for the given RenderableBar.');
        }

        return voiceDataArray.map(voiceData => {
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
}
