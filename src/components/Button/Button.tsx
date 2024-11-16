import styles from './Button.styles.module.css';
import ButtonType from './Button.types';

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
