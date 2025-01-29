import styles from '@components/SelectNoteComponent/SelectNoteComponent.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

export default function SelectableNoteBox(props: {
  noteValue: string;
  selected: boolean;
  setSelected: () => void;
}) {
  return (
    <div
      className={`${styles.note} ${props.selected ? styles.noteSelected : ''}`}
      style={{
        outlineColor: ConfigService.getInstance().getValue(
          props.selected
            ? SavedParameterName.SelectedNoteColor
            : SavedParameterName.HoveredNoteColor,
        ),
      }}
      onClick={() => {
        props.setSelected();
      }}>
      {props.noteValue}
    </div>
  );
}
