import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';

export class Key {
    private pitch: string;
    private modifier: KeyModifier | null = null;
    private isKeyDirty: boolean = false;

    constructor(pitch: string, modifier: KeyModifier | null = null) {
        this.pitch = pitch;
        this.modifier = modifier;
    }

    public toJSON() {
        const { isKeyDirty, ...rest } = this;
        return rest;
    }

    get Pitch(): string {
        return this.pitch;
    }

    set Pitch(value: string) {
        this.pitch = value;
        this.isKeyDirty = true;
    }

    get Modifier(): KeyModifier | null {
        return this.modifier;
    }

    set Modifier(modifier: KeyModifier) {
        if (this.modifier !== modifier) {
            this.isKeyDirty = true;
            this.modifier = modifier;
        }
    }

    get IsKeyDirty() {
        return this.isKeyDirty;
    }

    SetNotDirty() {
        this.isKeyDirty = false;
    }
}
