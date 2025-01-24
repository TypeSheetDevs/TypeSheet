import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';
import MusicNotationToggable from '@components/SelectNoteComponent/MusicNotationToggable';
import { useState } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

export default function SelectAccidentalComponent() {
  const [toggledIndex, setToggledIndex] = useState(-1);

  const toggles = [
    {
      enumValue: KeyModifier.Natural,
      text: '\uE261',
    },
    {
      enumValue: KeyModifier.Flat,
      text: '\uE260',
    },
    {
      enumValue: KeyModifier.DoubleFlat,
      text: '\uE264',
    },
    {
      enumValue: KeyModifier.Sharp,
      text: '\uE262',
    },
    {
      enumValue: KeyModifier.DoubleSharp,
      text: '\uE263',
    },
  ];

  return (
    <>
      {toggles.map((value, idx) => (
        <MusicNotationToggable
          key={idx}
          displayedText={value.text}
          toggled={idx === toggledIndex}
          onClick={() => {
            if (toggledIndex === idx) {
              setToggledIndex(-1);
              NotationRenderer.getInstance().AddingNoteIndicator.Accidental = undefined;
            } else {
              setToggledIndex(idx);
              NotationRenderer.getInstance().AddingNoteIndicator.Accidental = value.enumValue;
            }
          }}
        />
      ))}
    </>
  );
}
