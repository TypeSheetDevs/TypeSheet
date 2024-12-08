export class KeyData {
    key: string;
    modifiers: string[];

    constructor(key: string, modifiers: string[] = []) {
        this.key = key;
        this.modifiers = modifiers;
    }
}
