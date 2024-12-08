import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { VoiceData } from '@services/notationRenderer/notes/Voices.interfaces';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';

class RenderableBar implements IRenderable {
    ratio: number;
    currentPosX = 0;
    currentPosY = 0;
    staveMinimumHeightDistance = ConfigService.getInstance().getValue('StaveMinimumHeightDistance');
    voiceDatas: VoiceData[] = [];

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
        this.addVoice(voice1);
        this.addVoice(voice2);
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        const bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX() + bar.getWidth();
        this.currentPosY = bar.getY() + bar.getHeight() + this.staveMinimumHeightDistance;
        RenderableVoice.DrawVoices(this.voiceDatas, context, bar, length);
    }

    public addVoice(voice: VoiceData): void {
        if (!this.voiceDatas.find(voiceData => voiceData === voice)) {
            this.voiceDatas.push(voice);
        }
    }

    public removeVoice(index: number): void {
        if (index < 0 || index >= this.voiceDatas.length) {
            throw new Error('Index out of bounds.');
        }
        this.voiceDatas.splice(index, 1);
    }
}

export default RenderableBar;
