import Button from '@components/TopBar/Button/Button';
import styles from './ButtonsGroup.styles.module.css';

function ButtonsGroup({ buttons, isLast }: ButtonsGroupProps) {
  return (
    <>
      <div className={styles.buttonsGroup}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            iconPath={button.iconPath}
            onClick={button.onClick}></Button>
        ))}
      </div>
      {isLast && <div className={styles.separator} />}
    </>
  );
}

export default ButtonsGroup;
