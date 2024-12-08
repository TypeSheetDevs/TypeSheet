import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { KeyData, NoteData, VoiceData } from '@services/notationRenderer/notes/Voices.interfaces';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';

class RenderableBar implements IRenderable {
    ratio: number;
    currentPosX = 0;
    currentPosY = 0;
    staveMinimumHeightDistance = ConfigService.getInstance().getValue('StaveMinimumHeightDistance');
    voices: RenderableVoice[] = [];

    constructor(ratio?: number) {
        this.ratio = ratio ?? 1;
        const voice1 = new VoiceData(4, 4, [
            new NoteData('q', [new KeyData('e/4')]),
            new NoteData('q', [new KeyData('e/4')]),
            new NoteData('q', [new KeyData('g/4')]),
            new NoteData('q', [new KeyData('c/5')]),
        ]);

        const voice2 = new VoiceData(4, 4, [new NoteData('w', [new KeyData('a/3')])]);

        this.addVoice(new RenderableVoice(voice1));
        this.addVoice(new RenderableVoice(voice2));
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        const bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX() + bar.getWidth();
        this.currentPosY = bar.getY() + bar.getHeight() + this.staveMinimumHeightDistance;
        this.voices.forEach(voice => voice.Draw(context, bar, length));
    }

    public addVoice(voice: RenderableVoice): void {
        if (!this.voices.find(v => v === voice)) {
            this.voices.push(voice);
        }
    }

    public removeVoice(index: number): void {
        if (index < 0 || index >= this.voices.length) {
            throw new Error('Index out of bounds.');
        }
        this.voices.splice(index, 1);
    }
}

export default RenderableBar;
