import './TopBar.styles.css';
import { topBarColor } from '../../data/config';
import ButtonsGroupProps from '@components/PropsInterfaces/ButtonsGroupProps';
import ButtonsGroup from '@components/ButtonsGroup/ButtonsGroup';

function TopBar() {
  // hardcoded for now, but will be read from config later on
  let logoButtonGroup: ButtonsGroupProps = {
    buttons: [
      {
        iconPath: '../../assets/icons/music_note.svg',
        onClick: () => {
          console.log('logo');
        },
      },
    ],
  };

  let playButtonsGroup: ButtonsGroupProps = {
    buttons: [
      {
        iconPath: '../../assets/icons/skip_previous.svg',
        onClick: () => {
          console.log('skip previous');
        },
      },
      {
        iconPath: '../../assets/icons/play_arrow.svg',
        onClick: () => {
          console.log('play');
        },
      },
      {
        iconPath: '../../assets/icons/skip_next.svg',
        onClick: () => {
          console.log('skip next');
        },
      },
    ],
  };

  let buttonsGroupArray: ButtonsGroupProps[] = [logoButtonGroup, playButtonsGroup];

  return (
    <div
      className="top-bar"
      style={{ backgroundColor: topBarColor }}>
      {buttonsGroupArray.map((buttonsGroup, index) => (
        <>
          <ButtonsGroup
            key={index}
            buttons={buttonsGroup.buttons}
          />
          {index < buttonsGroupArray.length - 1 && <div className="separator" />}
        </>
      ))}
    </div>
  );
}

export default TopBar;
