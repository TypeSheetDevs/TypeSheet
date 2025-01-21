import SelectNoteComponent from '@components/SelectNoteComponent/SelectNoteComponent';
import styles from './NoteModsTopBar.styles.module.css';
import MusicNotationToggle from '@components/SelectNoteComponent/MusicNotationToggle';

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
        OnToggle={() => {}}
        displayedText={'\uE1D5\uE1E7'}
      />
      <MusicNotationToggle
        OnToggle={() => {}}
        displayedText={'\uE4E5'}
      />
      <Separator />
      <MusicNotationToggle
        OnToggle={() => {}}
        displayedText={'\uE260'}
      />
      <MusicNotationToggle
        OnToggle={() => {}}
        displayedText={'\uE261'}
      />
      <MusicNotationToggle
        OnToggle={() => {}}
        displayedText={'\uE262'}
      />
      <MusicNotationToggle
        OnToggle={() => {}}
        displayedText={'\uE263'}
      />
      <MusicNotationToggle
        OnToggle={() => {}}
        displayedText={'\uE264'}
      />
      <Separator />
    </div>
  );
}
