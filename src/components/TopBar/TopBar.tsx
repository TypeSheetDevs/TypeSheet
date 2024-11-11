import './TopBar.styles.css';
import { useState, DragEvent } from 'react';
import { topBarColor } from '../../data/config';
import ButtonsGroupProps from '@components/PropsInterfaces/ButtonsGroupProps';
import ButtonsGroup from '@components/ButtonsGroup/ButtonsGroup';

function TopBar() {
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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>, _: number) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
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
            draggable
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
