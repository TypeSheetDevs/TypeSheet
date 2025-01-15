import * as Tone from 'tone';
import { Notation } from '@services/notationRenderer/Notation';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import RenderableStave from '@services/notationRenderer/RenderableStave';
import { delay } from '@utils/delay';

export class AudioPlayer {
    private static _instance: AudioPlayer = null!;
    private notation: Notation = null!;
    private currentStave: RenderableStave | null = null;
    private currentBar: RenderableBar | null = null;
    private activeSynths: Tone.PolySynth[] = [];
    private isPlaying: boolean = true;

    static getInstance() {
        if (!this._instance) {
            this._instance = new AudioPlayer();
            this._instance.notation = Notation.getInstance();
        }
        return this._instance;
    }

    async Play() {
        await Tone.start();

        if (!this.currentStave) this.SetStaveToIndex(0);
        if (!this.currentBar) this.SetBarToIndex(0);

        await this.PlayVoices();
    }

    private async PlayVoices() {
        if (!this.currentBar) {
            console.warn('No current bar to play.');
            return;
        }
        this.isPlaying = true;

        while (this.isPlaying) {
            this.currentBar.voices.forEach(voice => {
                let startTime = Tone.now();
                for (let i = 0; i < voice.NotesLength; i++) {
                    const note = voice.GetNote(i);
                    this.activeSynths.push(note.Play(startTime));
                    startTime += note.DurationValue;
                }
            });
            await delay(this.currentBar.BarDuration);
            if (this.IsLastBarInStave && this.IsLastStaveInNotation) {
                this.isPlaying = false;
                continue;
            }
            if (this.IsLastBarInStave) {
                this.SetStaveToIndex(this.notation.getStaves().indexOf(this.currentStave!) + 1);
                this.SetBarToIndex(0);
                continue;
            }
            this.SetBarToIndex(this.currentStave!.bars.indexOf(this.currentBar) + 1);
        }
    }

    Stop() {
        this.isPlaying = false;
        this.activeSynths.forEach(synth => synth.dispose());
        this.activeSynths = [];

        console.log('Playback stopped.');
    }

    private SetStaveToIndex(index: number) {
        const staves = this.notation.getStaves();
        if (staves.length === 0) {
            this.currentStave = null;
            return;
        }
        if (index < 0 || index > staves.length - 1) {
            index = 0;
        }
        this.currentStave = staves[index];
    }

    private SetBarToIndex(index: number) {
        const bars = this.currentStave?.bars;
        if (!bars || bars.length === 0) {
            this.currentBar = null;
            return;
        }
        if (index < 0 || index > bars.length - 1) {
            index = 0;
        }
        this.currentBar = bars[index];
    }

    private get IsLastBarInStave() {
        const bars = this.currentStave?.bars;
        if (!bars || bars.length === 0) {
            return true;
        }
        return bars.indexOf(this.currentBar!) === bars.length - 1;
    }

    private get IsLastStaveInNotation() {
        const staves = this.notation.getStaves();
        return staves.indexOf(this.currentStave!) === staves.length - 1;
    }
}
