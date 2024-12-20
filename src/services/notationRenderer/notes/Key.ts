import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

export class Key {
    pitch: string;
    modifiers: KeyModifier[];

    constructor(pitch: string, modifiers: KeyModifier[] = []) {
        this.pitch = pitch;
        this.modifiers = modifiers;
        this.modifiers.push(KeyModifier.DoubleFlat);
    }

    public addModifier(modifier: KeyModifier) {
        if (!this.modifiers.includes(modifier)) {
            this.modifiers.push(modifier);
        }
    }
}
