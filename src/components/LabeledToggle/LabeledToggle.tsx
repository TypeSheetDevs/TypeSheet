import styles from './LabeledToggle.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { CSSProperties } from 'react';

function LabeledToggle({ toggled, onToggle, unToggledText, toggledText }: LabeledToggleProps) {
  return (
    <label
      htmlFor={styles.filter}
      className={styles.switch}
      aria-label="Toggle Filter"
      style={
        {
          alignSelf: 'center',
          '--switch-bg-clr': ConfigService.getInstance().getValue(SavedParameterName.TopBarColor),
          '--slider-bg-clr': ConfigService.getInstance().getValue(
            SavedParameterName.ToggleBubbleColor,
          ),
          '--slider-bg-clr-on': ConfigService.getInstance().getValue(
            SavedParameterName.ToggleBubbleColor,
          ),
          '--slider-txt-clr': ConfigService.getInstance().getValue(
            SavedParameterName.TopBarTextColor,
          ),
        } as CSSProperties
      }>
      <input
        type="checkbox"
        id={styles.filter}
        onChange={onToggle}
        checked={toggled}
      />
      <span>{unToggledText}</span>
      <span>{toggledText}</span>
      <div></div>
    </label>
  );
}

export default LabeledToggle;
