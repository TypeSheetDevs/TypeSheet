export class KeyData {
    pitch: string;
    modifiers: string[];

    constructor(pitch: string, modifiers: string[] = []) {
        this.pitch = pitch;
        this.modifiers = modifiers;
    }
}
