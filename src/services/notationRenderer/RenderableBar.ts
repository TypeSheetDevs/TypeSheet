import { Formatter, RenderContext, Stave, Voice } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { VoiceManager } from '@services/notationRenderer/notes/VoiceManager';
import { VoiceData } from '@services/notationRenderer/notes/Notes.interfaces';

class RenderableBar implements IRenderable {
    ratio: number;
    currentPosX = 0;
    currentPosY = 0;
    staveMinimumHeightDistance = ConfigService.getInstance().getValue('StaveMinimumHeightDistance');
    voiceManager: VoiceManager = VoiceManager.getInstance();

    constructor(ratio?: number) {
        this.ratio = ratio ?? 1;
        const voice1: VoiceData = {
            numBeats: 4,
            beatValue: 4,
            notes: [
                {
                    duration: 'q',
                    keys: [{ key: 'e/4', modifiers: [] }],
                    modifiers: [],
                },
                {
                    duration: 'q',
                    keys: [{ key: 'e/4', modifiers: [] }],
                    modifiers: [],
                },
                {
                    duration: 'q',
                    keys: [{ key: 'g/4', modifiers: [] }],
                    modifiers: [],
                },
                {
                    duration: 'q',
                    keys: [{ key: 'c/5', modifiers: [] }],
                    modifiers: [],
                },
            ],
        };
        const voice2: VoiceData = {
            numBeats: 4,
            beatValue: 4,
            notes: [
                {
                    duration: 'w',
                    keys: [{ key: 'a/3', modifiers: [] }],
                    modifiers: [],
                },
            ],
        };

        this.voiceManager.addVoice(this, voice1);
        this.voiceManager.addVoice(this, voice2);
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        const bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX() + bar.getWidth();
        this.currentPosY = bar.getY() + bar.getHeight() + this.staveMinimumHeightDistance;
        const voices = this.voiceManager.getAsVexFlowVoices(this);
        new Formatter().joinVoices(voices).format(voices, length);
        voices.forEach((voice: Voice) => voice.draw(context, bar));
    }
}

export default RenderableBar;
