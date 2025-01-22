import styles from '@components/SelectNoteComponent/MusicNotationToggle.styles.module.css';

export type MusicNotationToggableProps = {
  displayedText: string;
  toggled: boolean;
  onClick: () => void;
  lineHeight?: number;
};

export default function MusicNotationToggable({
  toggled,
  onClick,
  displayedText,
  lineHeight,
}: MusicNotationToggableProps) {
  return (
    <div
      className={`${styles.button} ${toggled ? styles.buttonToggled : ''}`}
      style={{ lineHeight: lineHeight }}
      onClick={onClick}>
      {displayedText}
    </div>
  );
}
