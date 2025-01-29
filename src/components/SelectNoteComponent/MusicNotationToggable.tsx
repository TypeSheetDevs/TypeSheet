import styles from '@components/SelectNoteComponent/MusicNotationToggle.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { CSSProperties } from 'react';

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
      style={
        {
          lineHeight: lineHeight,
          color: ConfigService.getInstance().getValue(SavedParameterName.TopBarTextColor),
          '--hover-color': ConfigService.getInstance().getValue(
            SavedParameterName.TopBarHighlightColor,
          ),
        } as CSSProperties
      }
      onClick={onClick}>
      {displayedText}
    </div>
  );
}
