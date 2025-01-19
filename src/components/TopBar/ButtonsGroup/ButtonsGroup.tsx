import Button from '@components/TopBar/Button/Button';
import styles from './ButtonsGroup.styles.module.css';
import MultiSelect from '@components/TopBar/MultiSelect/MultiSelect';
import Tooltip from '@components/TopBar/Tooltip/Tooltip';

function getButtonFromType(button: ButtonsGroupButtonType, index: number) {
  switch (button.type) {
    case 'button':
      return (
        <Button
          key={index}
          iconPath={button.iconPath}
          onClick={button.onClick}
        />
      );
    case 'multiselect':
      return (
        <MultiSelect
          key={index}
          iconPath={button.iconPath}
          groups={button.groups}
        />
      );
    case 'tooltip':
      return (
        <Tooltip
          key={index}
          iconPath={button.iconPath}
          content={button.content}
        />
      );
  }
}

function ButtonsGroup({ buttons, isLast }: ButtonsGroupProps) {
  return (
    <>
      <div className={styles.buttonsGroup}>
        {buttons.map((button, index) => getButtonFromType(button, index))}
      </div>
      {isLast && <div className={styles.separator} />}
    </>
  );
}

export default ButtonsGroup;
