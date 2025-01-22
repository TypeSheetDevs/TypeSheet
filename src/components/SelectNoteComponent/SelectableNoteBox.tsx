import styles from '@components/SelectNoteComponent/SelectNoteComponent.styles.module.css';

export default function SelectableNoteBox(props: {
  noteValue: string;
  selected: boolean;
  setSelected: () => void;
}) {
  return (
    <div
      className={`${styles.note} ${props.selected ? styles.noteSelected : ''}`}
      onClick={() => {
        props.setSelected();
      }}>
      {props.noteValue}
    </div>
  );
}
