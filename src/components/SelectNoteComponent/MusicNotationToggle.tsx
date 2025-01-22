import styles from './MusicNotationToggle.styles.module.css';
import { useState } from 'react';

export function MusicNotationToggle({
  displayedText,
  OnToggle,
  lineHeight,
}: MusicNotationToggleProps) {
  const [toggled, setToggled] = useState(false);

  return (
    <div
      className={`${styles.button} ${toggled ? styles.buttonToggled : ''}`}
      style={{ lineHeight: lineHeight }}
      onClick={() => {
        setToggled(!toggled);
        OnToggle(!toggled);
      }}>
      {displayedText}
    </div>
  );
}

export default MusicNotationToggle;
