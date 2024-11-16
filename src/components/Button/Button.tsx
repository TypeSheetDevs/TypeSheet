import styles from './Button.styles.module.css';

function Button({ iconPath, onClick }: ButtonType) {
  return (
    <button
      className={styles.button}
      onClick={onClick}>
      <img src={iconPath} />
    </button>
  );
}

export default Button;
