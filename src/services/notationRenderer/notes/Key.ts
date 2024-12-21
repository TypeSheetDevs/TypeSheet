import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

export class Key {
    pitch: string;
    modifier: KeyModifier | null = null;
    private isKeyDirty: boolean = false;

    get IsKeyDirty() {
        return this.isKeyDirty;
    }

    constructor(pitch: string, modifier: KeyModifier | null = null) {
        this.pitch = pitch;
        this.modifier = modifier;
    }

    public SetModifier(modifier: KeyModifier) {
        if (this.modifier !== modifier) {
            this.isKeyDirty = true;
            this.modifier = modifier;
        }
    }

    public SetNotDirty() {
        this.isKeyDirty = false;
    }
}
