import './TopBar.styles.css';
import { topBarColor } from '../../data/config';
import ButtonsGroupProps from '@components/PropsInterfaces/ButtonsGroupProps';
import ButtonsGroup from '@components/ButtonsGroup/ButtonsGroup';

function TopBar() {
  let buttonsGroupProps: ButtonsGroupProps = {
    buttons: [
      {
        iconPath: '../../assets/icons/music_note.svg',
        onClick: () => {
          console.log('skibidi');
        },
      },
      {
        iconPath: '../../assets/icons/music_note.svg',
        onClick: () => {
          console.log('toilet');
        },
      },
    ],
  };

  return (
    <div
      className="top-bar"
      style={{ backgroundColor: topBarColor }}>
      <ButtonsGroup buttons={buttonsGroupProps.buttons} />
    </div>
  );
}

export default TopBar;
