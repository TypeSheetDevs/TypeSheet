import * as Tone from 'tone';
import { Notation } from '@services/notationRenderer/Notation';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';
import RenderableStave from '@services/notationRenderer/RenderableStave';
import { Synth } from 'tone';

type BarAudioData = {
    voice: RenderableVoice;
    noteIndex: number;
    timeStarted?: number;
    timeLeft: number;
    synth: Synth;
};

export class AudioPlayer {
    private notation: Notation = Notation.getInstance();
    private static _instance: AudioPlayer = null!;
    private currentStave: RenderableStave | null = null;
    private currentBar: RenderableBar | null = null;
    private barAudioData: BarAudioData[] = [];

    private static getInstance() {
        if (!this._instance) {
            this._instance = new AudioPlayer();
        }
        return this._instance;
    }

    async Play() {
        await Tone.start();

        const staveIndex = this.GetStaveIndex();
        if (staveIndex < 0) {
            return;
        }

        const barIndex = this.GetBarIndex();
        if (barIndex < 0) {
            return;
        }

        if (this.barAudioData.length === 0) {
            this.InitBarAudioData();
        }

        console.log('Playback started.');
    }

    GetStaveIndex(): number {
        const staves = this.notation.getStaves();

        if (staves.length === 0) {
            console.warn('No staves to play.');
            return -1;
        }

        let staveIndex = 0;
        if (this.currentStave) {
            staveIndex = staves.indexOf(this.currentStave);
            if (staveIndex < 0) {
                console.warn('Previous stave not found. Starting from beginning.');
                staveIndex = 0;
            }
        }
        this.currentStave = staves[staveIndex];
        return staveIndex;
    }

    GetBarIndex(): number {
        if (!this.currentStave) {
            console.warn('No stave selected.');
            return -1;
        }

        const bars = this.currentStave.bars;

        if (bars.length === 0) {
            console.warn('No bars to play.');
            return -1;
        }

        let barIndex = 0;
        if (this.currentBar) {
            barIndex = bars.indexOf(this.currentBar);
            if (barIndex < 0) {
                console.warn('Previous bar not found. Starting from beginning.');
                barIndex = 0;
            }
        }
        this.currentBar = bars[barIndex];
        return barIndex;
    }

    InitBarAudioData() {
        for (const voice of this.currentBar!.voices) {
            this.barAudioData.push({
                voice: voice,
                noteIndex: 0,
                timeLeft: 0,
                synth: new Tone.Synth().toDestination(),
            });
        }
    }

    InitNextNote(dataIndex: number): boolean {
        const data = this.barAudioData[dataIndex];
        const voice = data.voice;
        const noteIndex = data.noteIndex;
        if (noteIndex === voice.NotesLength - 1) {
            return false;
        }
        data.noteIndex++;
        data.synth = new Tone.Synth();
        return true;
    }

    Stop() {
        Tone.getTransport().stop();
        console.log('Playback stopped.');
    }

    Pause() {
        Tone.getTransport().pause();
        console.log('Playback paused.');
    }
}
