import { KeyModifier } from '@services/notationRenderer/notes/Key.enums';
import MusicNotationToggable from '@components/SelectNoteComponent/MusicNotationToggable';
import { useState } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';

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
              NotationRenderer.getInstance().ActualNoteIndicator.Accidental = undefined;
            } else {
              setToggledIndex(idx);
              NotationRenderer.getInstance().ActualNoteIndicator.Accidental = value.enumValue;
            }
          }}
        />
      ))}
    </>
  );
}
