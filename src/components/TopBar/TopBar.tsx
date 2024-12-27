import styles from './TopBar.styles.module.css';
import { DragEvent, useState } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import ButtonsGroup from '@components/ButtonsGroup/ButtonsGroup';
import getButtonIcon from '@assets/icons/getIcon';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { SavedParameterName } from '@services/ConfigService/ConfigService.types';

function TopBar() {
  const [buttonsGroups, setButtonsGroups] = useState<ButtonsGroupType[]>([
    {
      buttons: [
        {
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
          iconPath: getButtonIcon('skip_previous.svg'),
          onClick: () => {
            console.log('skip previous');
          },
        },
        {
          iconPath: getButtonIcon('play_arrow.svg'),
          onClick: () => {
            console.log('play');
          },
        },
        {
          iconPath: getButtonIcon('skip_next.svg'),
          onClick: () => {
            console.log('skip next');
          },
        },
      ],
    },
    {
      // test buttonGroup
      buttons: [
        {
          iconPath: getButtonIcon('skip_previous.svg'),
          onClick: () => {},
        },
      ],
    },
    {
      buttons: [
        {
          iconPath: getButtonIcon('settings.svg'),
          onClick: () => EventNotifier.Notify('toggleConfigManager'),
        },
      ],
    },
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const topBarColor = ConfigService.getInstance().getValue(SavedParameterName.TopBarColor);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (index !== 0) {
      event.preventDefault();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index && index !== 0) {
      const updatedButtonsGroupArray = [...buttonsGroups];
      const [draggedItem] = updatedButtonsGroupArray.splice(draggedIndex, 1);
      updatedButtonsGroupArray.splice(index, 0, draggedItem);
      setButtonsGroups(updatedButtonsGroupArray);
    }
    setDraggedIndex(null);
  };

  return (
    <div
      className={styles.topBar}
      style={{ backgroundColor: topBarColor }}
      data-testid="top-bar">
      {buttonsGroups.map((buttonsGroup, index) => (
        <div
          key={index}
          className={styles.groupContainer}>
          <div
            className={styles.draggableComponent}
            data-testid={`draggable-component-${index}`}
            draggable={index !== 0}
            onDragStart={() => handleDragStart(index)}
            onDragOver={event => handleDragOver(event, index)}
            onDrop={event => handleDrop(event, index)}>
            <ButtonsGroup buttons={buttonsGroup.buttons} />
          </div>
          {index < buttonsGroups.length - 1 && <div className={styles.separator} />}
        </div>
      ))}
    </div>
  );
}

export default TopBar;
