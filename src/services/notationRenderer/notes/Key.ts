import { KeyModifier, ParseKeyModifier } from '@services/notationRenderer/notes/Key.enums';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';
import { KeyData } from '@services/notationRenderer/DataStructures/IRecoverable.types';

export class Key implements IRecoverable<Key, KeyData> {
    private pitch: string;
    private modifier?: KeyModifier;
    private isKeyDirty: boolean = false;

    constructor(pitch: string, modifier?: KeyModifier) {
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

    FromData(data: KeyData): Key {
        console.log(data);
        return null!;
    }

    ToData(): KeyData {
        return { pitch: this.pitch, modifier: this.modifier };
    }

    static FromData(data: KeyData): Key {
        return new Key(data.pitch, ParseKeyModifier(data.modifier));
    }
}
