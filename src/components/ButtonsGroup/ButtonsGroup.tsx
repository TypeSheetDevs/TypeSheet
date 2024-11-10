import Button from '@components/Button/Button';
import ButtonsGroupProps from '@components/PropsInterfaces/ButtonsGroupProps';

function ButtonsGroup({ buttons }: ButtonsGroupProps) {
  return (
    <div>
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
