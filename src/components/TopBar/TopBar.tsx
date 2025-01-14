import styles from './TopBar.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ButtonsGroup from './ButtonsGroup/ButtonsGroup';
import getButtonIcon from '@assets/icons/getIcon';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import OpenCloseButton from './OpenCloseButton/OpenCloseButton';
import EventNotifier from '@services/eventNotifier/eventNotifier';

function TopBar() {
  const buttonsGroups: Omit<ButtonsGroupProps, 'isLast'>[] = [
    {
      buttons: [
        {
          type: 'button',
          iconPath: getButtonIcon('music_note.svg'),
          onClick: () => {
            console.log('logo');
          },
        },
      ],
    },
    {
      buttons: [
        {
          type: 'button',
          iconPath: getButtonIcon('skip_previous.svg'),
          onClick: () => {
            console.log('skip previous');
          },
        },
        {
          type: 'button',
          iconPath: getButtonIcon('play_arrow.svg'),
          onClick: () => {
            console.log('play');
          },
        },
        {
          type: 'button',
          iconPath: getButtonIcon('skip_next.svg'),
          onClick: () => {
            console.log('skip next');
          },
        },
      ],
    },
    {
      buttons: [
        {
          type: 'multiselect',
          iconPath: getButtonIcon('plus.svg'),
          groups: [
            {
              options: [
                {
                  onClick: () => console.log('clicked a'),
                  text: 'a',
                },
              ],
            },
            {
              options: [
                {
                  onClick: () => console.log('clicked b'),
                  text: 'b',
                },
              ],
            },
          ],
        },
        {
          type: 'button',
          iconPath: getButtonIcon('minus.svg'),
          onClick: () => {},
        },
      ],
    },
    {
      buttons: [
        {
          type: 'button',
          iconPath: getButtonIcon('save.svg'),
          onClick: () => {},
        },
        {
          type: 'button',
          iconPath: getButtonIcon('load.svg'),
          onClick: () => {},
        },
      ],
    },
  ];
  const topBarColor = ConfigService.getInstance().getValue(SavedParameterName.TopBarColor);

  return (
    <div
      className={styles.topBar}
      style={{ backgroundColor: topBarColor }}
      data-testid="top-bar">
      {buttonsGroups.map((buttonsGroup, buttonsGroupIndex) => (
        <ButtonsGroup
          key={buttonsGroupIndex}
          buttons={buttonsGroup.buttons}
          isLast={buttonsGroupIndex < buttonsGroups.length - 1}
        />
      ))}
      <OpenCloseButton
        style={{ marginLeft: 'auto', order: 100 }}
        onToggle={() => EventNotifier.Notify('toggleConfigManager')}
      />
    </div>
  );
}

export default TopBar;
