import { Stave } from 'vexflow';

class Music {
    static _instance: Music = null!;
    static getInstance() {
        return Music._instance || new Music();
    }

    bars: Stave[] = [];
    redraw: (() => void) | null = null;

    constructor() {
        this.bars = [new Stave(0, 0, 0)];

        if (Music._instance === null) {
            Music._instance = this;
            return this;
        } else return Music._instance;
    }

    SetRedrawFunction(f: () => void) {
        this.redraw = f;
    }

    ClearRedrawFunction() {
        this.redraw = null;
    }

    Redraw() {
        if (this.redraw == null) {
            throw new Error('Cannot redraw: Redraw function is null');
        }

        this.redraw();
    }

    AddBar() {
        this.bars.push(new Stave(0, 0, 0));
        this.Redraw();
    }
}

export default Music;
