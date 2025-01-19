import { Notation } from '@services/notationRenderer/Notation';

export class ChosenEntityData {
    private _notation: Notation;
    private staveIndex: number;
    private barIndex: number;
    private voiceIndex: number;
    private noteIndex: number;

    public constructor(notation: Notation) {
        this._notation = notation;
        this.staveIndex = -1;
        this.barIndex = -1;
        this.voiceIndex = 0;
        this.noteIndex = -1;
    }

    public set StaveIndex(index: number) {
        this.staveIndex = index;
        this.barIndex = -1;
        this.noteIndex = -1;
    }
    public get StaveIndex() {
        return this.staveIndex;
    }
    public get Stave() {
        const staves = this._notation.getStaves();
        if (this.staveIndex < 0 || this.staveIndex >= staves.length) {
            return null;
        }

        return staves[this.staveIndex];
    }

    public SetBarIndex(staveIndex: number, barIndex: number) {
        this.staveIndex = staveIndex;
        this.barIndex = barIndex;
    }
    public set BarIndex(index: number) {
        this.barIndex = index;
        this.noteIndex = -1;
    }
    public get BarIndex() {
        return this.barIndex;
    }
    public get Bar() {
        const stave = this.Stave;
        if (!stave || this.barIndex < 0 || this.barIndex >= stave.bars.length) {
            return null;
        }

        return stave.bars[this.barIndex];
    }

    public set VoiceIndex(index: number) {
        this.voiceIndex = index;
        this.noteIndex = -1;
    }
    public get VoiceIndex() {
        return this.voiceIndex;
    }
    public get Voice() {
        const bar = this.Bar;
        if (!bar || this.voiceIndex < 0 || this.voiceIndex >= bar.voices.length) {
            return null;
        }

        return bar.voices[this.voiceIndex];
    }

    public SetNoteIndex(
        staveIndex: number,
        barIndex: number,
        noteIndex: number,
        voiceIndex?: number,
    ) {
        this.staveIndex = staveIndex;
        this.barIndex = barIndex;
        this.voiceIndex = voiceIndex ?? this.voiceIndex;
        this.noteIndex = noteIndex;
    }
    public set NoteIndex(index: number) {
        this.noteIndex = index;
    }
    public get NoteIndex() {
        return this.noteIndex;
    }
    public get Note() {
        const voice = this.Voice;
        if (!voice || this.noteIndex < 0 || this.noteIndex >= voice.NotesLength) {
            return null;
        }

        return voice.GetNote(this.noteIndex);
    }
}
