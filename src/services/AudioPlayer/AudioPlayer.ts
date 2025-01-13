import * as Tone from 'tone';
import { Notation } from '@services/notationRenderer/Notation';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';
import { Synth } from 'tone';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import RenderableStave from '@services/notationRenderer/RenderableStave';
import { AudioScheduler } from '@services/AudioPlayer/AudioScheduler';

type BarAudioData = {
    voice: RenderableVoice;
    noteIndex: number;
    timeStarted?: number;
    timeLeft: number;
    synth: Synth;
};

export class AudioPlayer {
    private static _instance: AudioPlayer = null!;
    private scheduler: AudioScheduler = new AudioScheduler();
    private notation: Notation = null!;
    private currentStave: RenderableStave | null = null;
    private currentBar: RenderableBar | null = null;
    private barAudioData: BarAudioData[] = [];

    static getInstance() {
        if (!this._instance) {
            this._instance = new AudioPlayer();
            this._instance.notation = Notation.getInstance();
        }
        return this._instance;
    }

    async Resume() {
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

        this.PlayNotes();
    }

    PlayNotes() {
        if (this.barAudioData.length === 0) {
            return;
        }
        for (let i = 0; i < this.barAudioData.length; i++) {
            this.PlayNote(i);
        }
    }

    PlayNote(dataIndex: number) {
        const data = this.barAudioData[dataIndex];
        const duration = data.timeLeft;
        data.synth = new Synth();
        const now = Tone.now();
        data.timeStarted = now;

        this.scheduler.AddEvent(() => {
            if (this.InitNextNote(dataIndex)) this.PlayNote(dataIndex);
        }, duration);

        data.synth.triggerAttackRelease('C4', duration, now);
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

    GetNextBar() {
        this.barAudioData = [];
        let barIndex = this.GetBarIndex();
        if (barIndex < 0) {
            return;
        }
        if (barIndex === this.currentStave!.bars.length - 1) {
            let staveIndex = this.GetStaveIndex();
            if (staveIndex < 0) {
                return;
            }
            staveIndex++;
            this.currentStave = this.notation.getStaves()[staveIndex] ?? null;
            this.currentBar = this.currentStave.bars[0] ?? null;
            return;
        }
        barIndex++;
        this.currentBar = this.currentStave!.bars[barIndex];
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
            this.barAudioData.splice(dataIndex, 1);
            return false;
        }

        data.noteIndex++;
        data.timeLeft = 500;
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
