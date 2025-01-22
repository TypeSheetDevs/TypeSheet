import { KeyModifier, ParseKeyModifier } from '@services/notationRenderer/notes/Key.enums';
import { IRecoverable } from '@services/notationRenderer/DataStructures/IRecoverable';
import { KeyData } from '@services/notationRenderer/DataStructures/IRecoverable.types';

export class Key implements IRecoverable<KeyData> {
    private pitch: string;
    private modifier?: KeyModifier;
    private isKeyDirty: boolean = false;

    constructor(pitch: string, modifier?: KeyModifier) {
        this.pitch = pitch;
        this.modifier = modifier;
    }

    get Pitch(): string {
        return this.pitch;
    }

    set Pitch(value: string) {
        this.pitch = value;
        this.isKeyDirty = true;
    }

    set Modifier(modifier: KeyModifier | undefined) {
        if (this.modifier !== modifier) {
            this.isKeyDirty = true;
            this.modifier = modifier;
        }
    }

    get Modifier(): KeyModifier | undefined {
        return this.modifier;
    }

    get IsKeyDirty() {
        return this.isKeyDirty;
    }

    get TonePitch() {
        const [pitch, octave] = this.pitch.split('/');
        return `${pitch}${this.modifier ?? ''}${octave}`;
    }

    SetNotDirty() {
        this.isKeyDirty = false;
    }

    ToData(): KeyData {
        return { pitch: this.pitch, modifier: this.modifier };
    }

    static FromData(data: KeyData): Key {
        return new Key(data.pitch, ParseKeyModifier(data.modifier));
    }
}
