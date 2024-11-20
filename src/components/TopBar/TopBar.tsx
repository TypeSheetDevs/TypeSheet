import styles from './TopBar.styles.module.css';
import { useState, DragEvent } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { ConfigKey } from '@services/ConfigService/ConfigKey';
import ButtonsGroup from '@components/ButtonsGroup/ButtonsGroup';

function TopBar() {
  const [buttonsGroupArray, setButtonsGroupArray] = useState<ButtonsGroupType[]>([
    {
      buttons: [
        {
          iconPath: '../../assets/icons/music_note.svg',
          onClick: () => {
            console.log('logo');
          },
        },
      ],
    },
    {
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
    },
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const topBarColorConfig = ConfigService.getInstance().getValue(ConfigKey.TopBarColor);
  const topBarColor =
    topBarColorConfig && ConfigService.isValidHexColor(topBarColorConfig)
      ? topBarColorConfig
      : '#0E0B52';

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
      const updatedButtonsGroupArray = [...buttonsGroupArray];
      const [draggedItem] = updatedButtonsGroupArray.splice(draggedIndex, 1);
      updatedButtonsGroupArray.splice(index, 0, draggedItem);
      setButtonsGroupArray(updatedButtonsGroupArray);
    }
    setDraggedIndex(null);
  };

  return (
    <div
      className={styles.topBar}
      style={{ backgroundColor: topBarColor }}
      data-testid="top-bar">
      {buttonsGroupArray.map((buttonsGroup, index) => (
        <>
          <div
            className={styles.draggableComponent}
            key={index}
            draggable={index !== 0}
            onDragStart={() => handleDragStart(index)}
            onDragOver={event => handleDragOver(event, index)}
            onDrop={event => handleDrop(event, index)}>
            <ButtonsGroup buttons={buttonsGroup.buttons} />
          </div>
          {index < buttonsGroupArray.length - 1 && <div className={styles.separator} />}
        </>
      ))}
    </div>
  );
}

export default TopBar;
