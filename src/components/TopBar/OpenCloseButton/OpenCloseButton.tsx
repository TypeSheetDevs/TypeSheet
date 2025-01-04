import styles from './OpenCloseButton.styles.module.css';
import React from 'react';

function OpenCloseButton(props: {
  onToggle: () => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <>
      <input
        type="checkbox"
        id={styles.checkbox}
        onChange={props.onToggle}
      />
      <label
        htmlFor={styles.checkbox}
        className={`${styles.toggle} ${props.className}`}
        style={props.style}>
        <div
          className={styles.bar}
          id={styles.bar1}></div>
        <div
          className={styles.bar}
          id={styles.bar2}></div>
        <div
          className={styles.bar}
          id={styles.bar3}></div>
      </label>
    </>
  );
}

export default OpenCloseButton;
