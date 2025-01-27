import SelectNoteComponent from '@components/SelectNoteComponent/SelectNoteComponent';
import styles from './NoteModsTopBar.styles.module.css';
import MusicNotationToggle from '@components/SelectNoteComponent/MusicNotationToggle';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import SelectAccidentalComponent from '@components/SelectAccidentalComponent/SelectAccidentalComponent';

function Separator() {
  return <div className={styles.separator}></div>;
}

export default function NoteModsTopBar() {
  return (
    <div className={styles.additionalBar}>
      <SelectNoteComponent />
      <Separator />
      <MusicNotationToggle
        lineHeight={'25px'}
        OnToggle={v => {
          NotationRenderer.getInstance().ActualNoteIndicator.Dotted = v;
        }}
        displayedText={'\uE1D5\uE1E7'}
      />
      <MusicNotationToggle
        OnToggle={v => {
          NotationRenderer.getInstance().ActualNoteIndicator.IsRest = v;
        }}
        displayedText={'\uE4E5'}
      />
      <Separator />
      <SelectAccidentalComponent />
      <Separator />
    </div>
  );
}
