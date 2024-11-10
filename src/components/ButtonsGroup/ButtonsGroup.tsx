import Button from '@components/Button/Button';
import ButtonsGroupProps from '@components/PropsInterfaces/ButtonsGroupProps';
import './ButtonsGroup.styles.css';

function ButtonsGroup({ buttons }: ButtonsGroupProps) {
  return (
    <div className="buttons-group">
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
