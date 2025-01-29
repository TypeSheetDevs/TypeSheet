import styles from './MusicNotationToggle.styles.module.css';
import { CSSProperties, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

export function MusicNotationToggle({
  displayedText,
  OnToggle,
  lineHeight,
}: MusicNotationToggleProps) {
  const [toggled, setToggled] = useState(false);

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
      onClick={() => {
        setToggled(!toggled);
        OnToggle(!toggled);
      }}>
      {displayedText}
    </div>
  );
}

export default MusicNotationToggle;
