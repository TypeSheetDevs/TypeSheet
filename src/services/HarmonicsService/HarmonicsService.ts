import { chord } from 'music21j';
import { ChordType, ChordTypeMusic21 } from '@services/HarmonicsService/Harmonics.enum';
import { ChordInfo } from '@services/HarmonicsService/Harmonics.types';

export class HarmonicsService {
    public static GetChordInfo(keys: string[]): ChordInfo {
        const c = new chord.Chord(keys);

        const rootInfo = c.root().stringInfo();
        const [rootPitch, octaveStr] = rootInfo.match(/^([A-G#b]+)(\d+)$/)!.slice(1);
        const octave = parseInt(octaveStr, 10);

        const chordType = this.MapChordCommonName(c.commonName);

        return {
            rootPitch,
            octave,
            chordType,
            canBeTonic: c.canBeTonic(),
        };
    }

    private static MapChordCommonName(chordName: string): ChordType {
        const entry = Object.entries(ChordTypeMusic21).find(([_, value]) => value === chordName);

        return entry ? (entry[0] as ChordType) : ChordType.Other;
    }
}
