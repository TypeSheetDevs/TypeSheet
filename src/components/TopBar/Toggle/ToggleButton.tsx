import styles from './ToggleButton.styles.module.css';
import { useState } from 'react';

function ToggleButton({ iconPath1, iconPath2, onClick1, onClick2, toggleFunction }: ToggleProps) {
  const [iconPath, setIconPath] = useState(iconPath1);

  async function swapIcons() {
    const toggle = !toggleFunction || toggleFunction();
    if (!toggle) return;

    if (iconPath === iconPath1) {
      setIconPath(iconPath2);
      await onClick2();
    } else {
      setIconPath(iconPath1);
      await onClick1();
    }
  }

  return (
    <button
      className={styles.toggleButton}
      onClick={swapIcons}>
      <img
        draggable={false}
        src={iconPath}
        alt="toggle icon"
      />
    </button>
  );
}

export default ToggleButton;
