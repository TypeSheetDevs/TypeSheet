import * as Tone from 'tone';
import { Notation } from '@services/notationRenderer/Notation';
import RenderableBar from '@services/notationRenderer/RenderableBar';
import RenderableStave from '@services/notationRenderer/RenderableStave';
import { delay } from '@utils/delay';
import { RenderableVoice } from '@services/notationRenderer/notes/RenderableVoice';

interface PlaybackPosition {
    stave: RenderableStave;
    bar: RenderableBar;
}

export class AudioPlayer {
    private static _instance: AudioPlayer | null = null;
    private notation: Notation = null!;
    private position: PlaybackPosition | null = null;
    private activeSynths: Set<Tone.PolySynth> = new Set();
    private playbackState = {
        isPlaying: false,
        isStopped: false,
    };

    public static getInstance(): AudioPlayer {
        if (!this._instance) {
            this._instance = new AudioPlayer();
            this._instance.notation = Notation.getInstance();
        }
        return this._instance;
    }

    public async Play(): Promise<void> {
        await Tone.start();

        if (!this.position) {
            this.InitPosition();
        }

        await this.playVoices();
    }

    public Stop(): void {
        this.ResetSynths();
        this.playbackState.isStopped = true;
        console.log('Playback stopped.');
    }

    public Reset(): void {
        this.ResetSynths();
        this.InitPosition();
        this.playbackState.isStopped = true;
        console.log('Playback reset.');
    }

    // Private Playback Methods
    private async playVoices(): Promise<void> {
        if (!this.position?.bar || this.playbackState.isPlaying) {
            console.warn('Invalid playback state or already playing.');
            return;
        }

        this.playbackState.isPlaying = true;

        while (this.playbackState.isPlaying) {
            await this.PlayCurrentBar();

            if (this.playbackState.isStopped) {
                this.HandlePlaybackStop();
                break;
            }

            if (this.MoveToNextBar()) {
                break;
            }
        }
    }

    private async PlayCurrentBar(): Promise<void> {
        const startTime = Tone.now();
        this.position?.bar.voices.forEach(voice => {
            this.PlayVoice(voice, startTime);
        });
        await delay(this.position?.bar.BarDuration ?? 0);
    }

    private PlayVoice(voice: RenderableVoice, startTime: number): void {
        let currentTime = startTime;
        for (let i = 0; i < voice.NotesLength; i++) {
            const note = voice.GetNote(i);
            const synth = note.Play(currentTime);
            this.activeSynths.add(synth);
            currentTime += note.DurationValue;
        }
    }

    // Position Management
    private InitPosition(): void {
        const firstStave = this.GetStaveAt(0);
        if (firstStave) {
            this.position = {
                stave: firstStave,
                bar: this.GetBarAt(firstStave, 0) ?? null!,
            };
        }
    }

    private MoveToNextBar(): boolean {
        if (!this.position) return true;

        if (this.IsLastPosition) {
            this.InitPosition();
            return true;
        }

        if (this.IsLastBarInStave) {
            this.MoveToNextStave();
            return false;
        }

        this.MoveToNextBarInStave();
        return false;
    }

    // private MoveToPreviousBar(): boolean {
    //     if (!this.position) return true;
    //
    //     if (this.IsFirstPosition) {
    //         this.MoveToLastPosition();
    //         return true;
    //     }
    //
    //     if (this.IsFirstBarInStave) {
    //         this.MoveToPreviousStave();
    //         return false;
    //     }
    //
    //     this.MoveToPreviousBarInStave();
    //     return false;
    // }

    // Position Helpers
    private get IsLastPosition(): boolean {
        return this.IsLastBarInStave && this.IsLastStaveInNotation;
    }

    private get IsFirstPosition(): boolean {
        return this.IsFirstBarInStave && this.IsFirstStaveInNotation;
    }

    private get IsLastBarInStave(): boolean {
        if (!this.position) return true;
        const bars = this.position.stave.bars;
        return bars.indexOf(this.position.bar) === bars.length - 1;
    }

    private get IsFirstBarInStave(): boolean {
        if (!this.position) return true;
        return this.position.stave.bars.indexOf(this.position.bar) === 0;
    }

    private get IsLastStaveInNotation(): boolean {
        if (!this.position) return true;
        const staves = this.notation.getStaves();
        return staves.indexOf(this.position.stave) === staves.length - 1;
    }

    private get IsFirstStaveInNotation(): boolean {
        if (!this.position) return true;
        const staves = this.notation.getStaves();
        return staves.indexOf(this.position.stave) === 0;
    }

    // Navigation Methods
    private MoveToNextStave(): void {
        if (!this.position) return;
        const nextStaveIndex = this.notation.getStaves().indexOf(this.position.stave) + 1;
        const nextStave = this.GetStaveAt(nextStaveIndex);
        if (nextStave) {
            this.position = {
                stave: nextStave,
                bar: this.GetBarAt(nextStave, 0) ?? null!,
            };
        }
    }

    private MoveToNextBarInStave(): void {
        if (!this.position) return;
        const currentBarIndex = this.position.stave.bars.indexOf(this.position.bar);
        const nextBar = this.GetBarAt(this.position.stave, currentBarIndex + 1);
        if (nextBar) {
            this.position.bar = nextBar;
        }
    }

    private MoveToPreviousStave(): void {
        if (!this.position) return;
        const prevStaveIndex = this.notation.getStaves().indexOf(this.position.stave) - 1;
        const prevStave = this.GetStaveAt(prevStaveIndex);
        if (prevStave) {
            this.position = {
                stave: prevStave,
                bar: this.GetBarAt(prevStave, prevStave.bars.length - 1) ?? null!,
            };
        }
    }

    private MoveToPreviousBarInStave(): void {
        if (!this.position) return;
        const currentBarIndex = this.position.stave.bars.indexOf(this.position.bar);
        const prevBar = this.GetBarAt(this.position.stave, currentBarIndex - 1);
        if (prevBar) {
            this.position.bar = prevBar;
        }
    }

    private MoveToLastPosition(): void {
        const staves = this.notation.getStaves();
        const lastStave = staves[staves.length - 1];
        if (lastStave) {
            this.position = {
                stave: lastStave,
                bar: this.GetBarAt(lastStave, lastStave.bars.length - 1) ?? null!,
            };
        }
    }

    // Utility Methods
    private GetStaveAt(index: number): RenderableStave | null {
        const staves = this.notation.getStaves();
        return index >= 0 && index < staves.length ? staves[index] : null;
    }

    private GetBarAt(stave: RenderableStave, index: number): RenderableBar | null {
        return index >= 0 && index < stave.bars.length ? stave.bars[index] : null;
    }

    private ResetSynths(): void {
        this.playbackState.isPlaying = false;
        this.activeSynths.forEach(synth => synth.dispose());
        this.activeSynths.clear();
    }

    private HandlePlaybackStop(): void {
        this.playbackState.isStopped = false;
    }
}
