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
        this.datas.push({ startingIndex: 0, key: KeySignature['C#'] });
    }

    AddNewData(data: SignatureData) {
        if (this.datas.some(existingData => existingData.startingIndex === data.startingIndex)) {
            this.datas.push(data);
            this.datas.sort((a, b) => a.startingIndex - b.startingIndex);
        }
    }

    RemoveDataByIndex(startingIndex: number) {
        this.datas = this.datas.filter(data => data.startingIndex !== startingIndex);
    }

    GetUsedData(staveIndex: number): SignatureData {
        const filtered = this.datas.filter(data => data.startingIndex <= staveIndex);
        console.log(filtered);
        return filtered[filtered.length - 1];
    }
}
