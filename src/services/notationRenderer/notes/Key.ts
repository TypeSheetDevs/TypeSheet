import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

export class Key {
    pitch: string;
    // it may be just a variable instead of array, but not sure yet
    modifiers: KeyModifier[];
    private isKeyDirty: boolean = false;

    get IsKeyDirty() {
        return this.isKeyDirty;
    }

    constructor(pitch: string, modifiers: KeyModifier[] = []) {
        this.pitch = pitch;
        this.modifiers = modifiers;
    }

    public AddModifier(modifier: KeyModifier) {
        if (!this.modifiers.includes(modifier)) {
            this.isKeyDirty = true;
            this.modifiers.push(modifier);
        }
    }

    public SetNotDirty() {
        this.isKeyDirty = true;
    }
}
