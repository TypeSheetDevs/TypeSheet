import EventNotifier from '@services/eventNotifier/eventNotifier';

export class Signature {
    private datas: SignatureData[] = [];

    constructor() {
        this.datas.push({ startIndex: 0, key: KeySignature['C'] });
    }

    AddNewData(data: SignatureData) {
        const existingIndex = this.datas.findIndex(i => i.startIndex === data.startIndex);
        if (existingIndex >= 0) {
            this.datas.splice(existingIndex, 1);
        }
        this.datas.push(data);
        this.datas.sort((a, b) => a.startIndex - b.startIndex);

        for (let i = 0; i < this.datas.length - 1; i++) {
            if (this.datas[i].key === this.datas[i + 1].key) {
                const mergedData = {
                    ...this.datas[i],
                };
                this.datas.splice(i, 2, mergedData);
                --i;
            }
        }
        EventNotifier.Notify('needsRender');
    }

    GetUsedData(staveIndex: number): SignatureData {
        const filtered = this.datas.filter(data => data.startIndex <= staveIndex);
        return filtered[filtered.length - 1];
    }
}
