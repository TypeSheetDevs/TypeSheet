import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import { Key } from '@services/notationRenderer/notes/Key';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

class RenderableBar implements IRenderable {
    private currentPosX = 0;
    private currentPosY = 0;
    private currentWidth = 0;
    private currentHeight = 0;

    ratio: number;
    voices: RenderableVoice[] = [];

    constructor(ratio?: number) {
        this.ratio = ratio ?? 1;
        const voice1 = new RenderableVoice(4, [
            new RenderableNote(NoteDuration.Quarter, [new Key('e/4')]),
            new RenderableNote(NoteDuration.Quarter, [new Key('g/4')]),
            new RenderableNote(NoteDuration.Eighth, [new Key('c/5')], [], true),
            new RenderableNote(NoteDuration.Sixteenth, [new Key('a/4')]),
        ]);
        const voice2 = new RenderableVoice(4, [
            new RenderableNote(NoteDuration.Whole, [new Key('a/3')]),
        ]);

        this.addVoice(voice1);
        this.addVoice(voice2);
    }

    get NextPositionX(): number {
        return this.currentPosX + this.currentWidth;
    }

    get NextPositionY(): number {
        return (
            this.currentPosY +
            this.currentHeight +
            ConfigService.getInstance().getValue(SavedParameterName.StaveMinimumHeightDistance)
        );
    }

    get Rect(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.currentPosX,
            y: this.currentPosY,
            width: this.currentWidth,
            height: this.currentHeight,
        };
    }

    isClicked(mousePosX: number, mousePosY: number): boolean {
        return (
            mousePosX >= this.currentPosX &&
            mousePosX <= this.currentPosX + this.currentWidth &&
            mousePosY >= this.currentPosY &&
            mousePosY <= this.currentPosY + this.currentHeight
        );
    }

    getClickedNote(voiceIndex: number, mousePosX: number): number {
        if (voiceIndex < 0 || voiceIndex >= this.voices.length) {
            return -1;
        }

        return this.voices[voiceIndex].GetNoteIndexByPositionX(mousePosX);
    }

    removeClickedNote(mousePosX: number): void {
        const idx = this.getClickedNote(0, mousePosX);
        this.voices[0].RemoveNote(idx);
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        const bar = new Stave(positionX, positionY, length);
        bar.setContext(context).draw();
        this.currentPosX = bar.getX();
        this.currentPosY = bar.getY();
        this.currentWidth = bar.getWidth();
        this.currentHeight = bar.getBottomY() - bar.getY();

        this.voices.forEach(voice => voice.Draw(context, bar, this.currentWidth));
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
