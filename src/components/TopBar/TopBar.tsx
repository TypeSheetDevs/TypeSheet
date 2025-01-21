import styles from './TopBar.styles.module.css';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ButtonsGroup from './ButtonsGroup/ButtonsGroup';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';
import { ReactNode } from 'react';

function TopBar({
  buttonsGroups,
  endButton,
}: {
  buttonsGroups: Omit<ButtonsGroupProps, 'isLast'>[];
  endButton: ReactNode;
}) {
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
      {endButton}
    </div>
  );
}

export default TopBar;
