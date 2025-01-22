import styles from './LabeledToggle.styles.module.css';

function LabeledToggle({ toggled, onToggle, unToggledText, toggledText }: LabeledToggleProps) {
  return (
    <label
      htmlFor={styles.filter}
      className={styles.switch}
      aria-label="Toggle Filter"
      style={{ alignSelf: 'center' }}>
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
