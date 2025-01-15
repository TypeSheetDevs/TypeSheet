import styles from './NumericInput.styles.module.css';
import { useCallback } from 'react';

function NumericInput({ min, max, onChange, value }: NumericInputProps) {
  const onDecrement = useCallback(() => {
    if (value != min) onChange(value - 1);
  }, [onChange, min, value]);

  const onIncrement = useCallback(() => {
    if (value != max) onChange(value + 1);
  }, [onChange, max, value]);

  return (
    <div className={styles.numberControl}>
      <div
        className={styles.numberLeft}
        onClick={onDecrement}></div>
      <input
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number.parseInt(e.target.value))}
        type="number"
        name="number"
        className={styles.numberQuantity}
      />
      <div
        className={styles.numberRight}
        onClick={onIncrement}></div>
    </div>
  );
}

export default NumericInput;
