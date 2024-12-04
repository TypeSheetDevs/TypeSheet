import { VoiceData } from '@services/notationRenderer/notes/VoiceData';

export class VoiceManager {
    private voices: VoiceData[] = [];

    public addVoice(voice: VoiceData): void {
        this.voices.push(voice);
    }

    public removeVoice(index: number): void {
        this.voices.splice(index, 1);
    }

    public getVoices(): VoiceData[] {
        return this.voices;
    }
}
