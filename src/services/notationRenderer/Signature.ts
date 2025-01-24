import EventNotifier from '@services/eventNotifier/eventNotifier';

export enum KeySignature {
    C = 'C',
    G = 'G',
    D = 'D',
    A = 'A',
    E = 'E',
    B = 'B',
    'F#' = 'F#',
    'C#' = 'C#',
    F = 'F',
    'Bb' = 'Bb',
    'Eb' = 'Eb',
    'Ab' = 'Ab',
    'Db' = 'Db',
    'Gb' = 'Gb',
    'Cb' = 'Cb',
}

export type SignatureData = {
    startingIndex: number;
    key: KeySignature;
};

export class Signature {
    private datas: SignatureData[] = [];

    constructor() {
        this.datas.push({ startingIndex: 0, key: KeySignature['C'] });
    }

    AddNewData(data: SignatureData) {
        const existingIndex = this.datas.findIndex(i => i.startingIndex === data.startingIndex);
        if (existingIndex >= 0) {
            this.datas.splice(existingIndex, 1);
        }
        this.datas.push(data);
        this.datas.sort((a, b) => a.startingIndex - b.startingIndex);

        for (let i = 0; i < this.datas.length - 1; i++) {
            if (this.datas[i].key === this.datas[i + 1].key) {
                const mergedData = {
                    ...this.datas[i],
                };
                this.datas.splice(i, 2, mergedData);
                --i;
            }
        }
        console.log(this.datas);
        EventNotifier.Notify('needsRender');
    }

    GetUsedData(staveIndex: number): SignatureData {
        const filtered = this.datas.filter(data => data.startingIndex <= staveIndex);
        return filtered[filtered.length - 1];
    }
}
