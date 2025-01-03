import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import { Formatter, Voice } from 'vexflow';

export class VoiceManager {
    // maps voices to bars where they start
    barsVoiceMap = new Map<RenderableBar, RenderableVoice[]>();

    public Draw(): void {
        console.log('Draw Voices');
    }

    public static GetVoiceMinimumWidth(voice: Voice) {
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
