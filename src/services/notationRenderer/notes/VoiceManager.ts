import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import { Formatter, Voice } from 'vexflow';

export class VoiceManager {
    private static _instance: VoiceManager = null!;
    // maps voices to bars where they start
    barsVoiceMap = new Map<RenderableBar, RenderableVoice[]>();

    constructor() {
        if (VoiceManager._instance === null) {
            VoiceManager._instance = this;
            return this;
        } else return VoiceManager._instance;
    }

    static getInstance() {
        return new VoiceManager();
    }

    public Draw(): void {
        console.log('Draw Voices');
    }

    public GetVoiceMinimumWidth(voice: Voice) {
        return new Formatter().format([voice]).getMinTotalWidth();
    }

    public AddVoiceToBar(bar: RenderableBar, voice: RenderableVoice): void {
        if (this.barsVoiceMap.has(bar)) {
            this.barsVoiceMap.get(bar)!.push(voice);
        }

        this.barsVoiceMap.set(bar, [voice]);
    }

    public RemoveVoiceFromBar(bar: RenderableBar, voice: RenderableVoice): void {
        if (!this.barsVoiceMap.has(bar)) return;

        const voices = this.barsVoiceMap.get(bar)!;
        const voiceIndex = voices.indexOf(voice);

        if (voiceIndex === -1) {
            throw new Error('The specified voice is not associated with this bar.');
        }

        voices.splice(voiceIndex, 1);

        if (voices.length === 0) {
            this.barsVoiceMap.delete(bar);
        }
    }
}
