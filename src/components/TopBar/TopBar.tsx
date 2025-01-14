import styles from './TopBar.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ButtonsGroup from './ButtonsGroup/ButtonsGroup';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import OpenCloseButton from './OpenCloseButton/OpenCloseButton';
import EventNotifier from '@services/eventNotifier/eventNotifier';

function TopBar({ buttonsGroups }: { buttonsGroups: Omit<ButtonsGroupProps, 'isLast'>[] }) {
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
