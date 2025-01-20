import { RenderContext, Stave } from 'vexflow';
import { IRenderable } from './IRenderable';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';
import { RenderableNote } from '@services/notationRenderer/notes/RenderableNote';
import { Key } from '@services/notationRenderer/notes/Key';
import { NoteDuration } from '@services/notationRenderer/notes/Notes.enums';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';
import { RenderableBarData } from '@services/notationRenderer/DataStructures/IRecoverable.types';
import { Notes } from '@services/HarmonicsService/Harmonics.types';
import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

class RenderableBar implements IRenderable, IRecoverable<RenderableBarData> {
    private StartingPitch = 46;
    private currentPosX = 0;
    private currentPosY = 0;
    private currentWidth = 0;
    private currentHeight = 0;
    private fillColor: string | undefined;

    ratio: number;
    voices: RenderableVoice[] = [];

    constructor(ratio?: number) {
        const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
        this.ratio = ratio ?? 1;
        const voice1 = new RenderableVoice(4, [
            new RenderableNote(NoteDuration.Quarter, [
                new Key(notes[Math.floor(Math.random() * notes.length)] + '/4'),
            ]),
            new RenderableNote(NoteDuration.Quarter, [
                new Key(notes[Math.floor(Math.random() * notes.length)] + '/4'),
            ]),
            new RenderableNote(NoteDuration.Quarter, [
                new Key(notes[Math.floor(Math.random() * notes.length)] + '/4'),
            ]),
            new RenderableNote(NoteDuration.Quarter, [
                new Key(notes[Math.floor(Math.random() * notes.length)] + '/4'),
            ]),
        ]);

        this.addVoice(voice1);
    }

    get NextPositionX(): number {
        return this.currentPosX + this.currentWidth;
    }

    get BarDuration(): number {
        const voiceDurations = this.voices.map(voice => {
            let totalDuration = 0;
            for (let i = 0; i < voice.NotesLength; i++) {
                const note = voice.GetNote(i);
                totalDuration += note.DurationValue;
            }
            return totalDuration;
        });

        return Math.max(...voiceDurations) * 1000;
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

    set FillColor(value: string) {
        this.fillColor = value;
    }

    ResetColor(): void {
        this.fillColor = undefined;
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

    getKeyByPositionY(positionY: number) {
        const stave = new Stave(this.currentPosX, this.currentPosY, positionY);
        const spacing = stave.getSpacingBetweenLines() / 2;
        const relativePosition = positionY - stave.getY();
        const positionInPitches = this.StartingPitch - Math.floor(relativePosition / spacing);

        const keyNumberValue = positionInPitches % Notes.length;
        const keyOctave = (positionInPitches - keyNumberValue) / Notes.length;

        return new Key(Notes[keyNumberValue] + '/' + keyOctave);
    }

    removeClickedNote(mousePosX: number): void {
        const idx = this.getClickedNote(0, mousePosX);
        this.voices[0].RemoveNote(idx);
    }

    Draw(context: RenderContext, positionY: number, positionX: number, length: number) {
        const bar = new Stave(positionX, positionY, length);
        if (this.fillColor) {
            bar.setStyle({ strokeStyle: this.fillColor });
        }
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

    ToData(): RenderableBarData {
        return { ratio: this.ratio, voicesData: this.voices.map(voice => voice.ToData()) };
    }

    static FromData(data: RenderableBarData): RenderableBar {
        const bar = new RenderableBar(data.ratio);
        bar.voices = (data.voicesData ?? [])
            .map(voiceData => RenderableVoice.FromData(voiceData))
            .filter(voice => voice);
        return bar;
    }
}

export default RenderableBar;
