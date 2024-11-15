import './TopBar.styles.css';
import { useState, useEffect, DragEvent } from 'react';
import { ConfigService } from '@services/ConfigService/ConfigService';
import { ConfigKeys } from '@services/ConfigService/ConfigKeys';
import ButtonsGroupProps from '@components/PropsInterfaces/ButtonsGroupProps';
import ButtonsGroup from '@components/ButtonsGroup/ButtonsGroup';

function TopBar() {
  const [topBarColor, setTopBarColor] = useState<string>('#0E0B52');

  const [buttonsGroupArray, setButtonsGroupArray] = useState<ButtonsGroupProps[]>([
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

  useEffect(() => {
    const loadConfig = async () => {
      const configService = await ConfigService.getInstance();
      const color = configService.getConfigValue(ConfigKeys.topBarColor);
      console.log(color);
      if (color) {
        setTopBarColor(color);
      }
    };

    loadConfig().catch(console.error);
  }, []);

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
      className="top-bar"
      style={{ backgroundColor: topBarColor }}>
      {buttonsGroupArray.map((buttonsGroup, index) => (
        <>
          <div
            className="draggable-component"
            key={index}
            draggable={index !== 0}
            onDragStart={() => handleDragStart(index)}
            onDragOver={event => handleDragOver(event, index)}
            onDrop={event => handleDrop(event, index)}>
            <ButtonsGroup buttons={buttonsGroup.buttons} />
          </div>
          {index < buttonsGroupArray.length - 1 && <div className="separator" />}
        </>
      ))}
    </div>
  );
}

export default TopBar;
