let instance;

class Music {
    bars: string[] = ['1', '2', '3'];
    redraw: (() => void) | null = null;

    constructor() {
        if (instance) {
            throw new Error('Notes instance already exists');
        }
        instance = this;
    }

    setRedrawFunction(f: () => void) {
        this.redraw = f;
    }

    clearRedrawFunction() {
        this.redraw = null;
    }

    Redraw() {
        if (this.redraw == null) {
            throw new Error('Cannot redraw: Redraw function is null');
        }

        this.redraw();
    }
}

const MusicSingleton = Object.freeze(new Music());

export default MusicSingleton;
