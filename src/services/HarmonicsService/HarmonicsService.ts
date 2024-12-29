import { chord } from 'music21j';
import { ChordType, ChordTypeMusic21 } from '@services/HarmonicsService/Harmonics.enum';

export class HarmonicsService {
    public static IdentifyChord(keys: string[]) {
        const c = new chord.Chord();
        c.add(keys);
        c.removeDuplicatePitches();
        console.log(c.commonName);
        console.log(this.MapChordCommonName(c.commonName));
    }

    private static MapChordCommonName(chordName: string): ChordType {
        const entry = Object.entries(ChordTypeMusic21).find(([_, value]) => value === chordName);

        return entry ? (entry[0] as ChordType) : ChordType.Other;
    }
}
