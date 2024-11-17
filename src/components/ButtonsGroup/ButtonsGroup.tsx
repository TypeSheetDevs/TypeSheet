import Button from '@components/Button/Button';
import styles from './ButtonsGroup.styles.module.css';

function ButtonsGroup({ buttons }: ButtonsGroupType) {
  return (
    <div className={styles.buttonsGroup}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          iconPath={button.iconPath}
          onClick={button.onClick}></Button>
      ))}
    </div>
  );
}

export default ButtonsGroup;
