import * as Tone from 'tone';
import { Notation } from '@services/notationRenderer/Notation';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import RenderableStave from '@services/notationRenderer/RenderableStave';

export class AudioPlayer {
    private static _instance: AudioPlayer = null!;
    private notation: Notation = null!;
    private currentStave: RenderableStave | null = null;
    private currentBar: RenderableBar | null = null;
    private activeSynths: Tone.PolySynth[] = [];

    static getInstance() {
        if (!this._instance) {
            this._instance = new AudioPlayer();
            this._instance.notation = Notation.getInstance();
        }
        return this._instance;
    }

    async Play() {
        await Tone.start();

        // const staveIndex = this.GetStaveIndex();
        // if (staveIndex < 0) {
        //     return;
        // }
        //
        // const barIndex = this.GetBarIndex();
        // if (barIndex < 0) {
        //     return;
        // }
        //
        // if (this.barAudioData.length === 0) {
        //     this.InitBarAudioData();
        // }

        this.currentBar = new RenderableBar();

        this.PlayVoices();
    }

    Stop() {
        this.activeSynths.forEach(synth => synth.dispose());
        this.activeSynths = [];

        console.log('Playback stopped.');
    }

    private PlayVoices() {
        if (!this.currentBar) {
            console.warn('No current bar to play.');
            return;
        }

        this.currentBar.voices.forEach(async voice => {
            let startTime = Tone.now();
            for (let i = 0; i < voice.NotesLength; i++) {
                const note = voice.GetNote(i);
                this.activeSynths.push(await note.Play(startTime));
                startTime += note.DurationValue;
            }
        });
    }
}
