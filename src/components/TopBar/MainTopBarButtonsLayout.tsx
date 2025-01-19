import getButtonIcon from '@assets/icons/getIcon';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { AudioPlayer } from '@services/AudioPlayer/AudioPlayer';
import { Notation } from '@services/notationRenderer/Notation';
import MidiSelector from '@components/MidiSelector/MidiSelector';
import InfoEditor from '@components/InfoEditor/InfoEditor';

export const MainTopBarButtonsLayout: Omit<ButtonsGroupProps, 'isLast'>[] = [
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
        iconPath: getButtonIcon('chevron_left.svg'),
        onClick: () => {
          AudioPlayer.getInstance().MoveToPreviousBar();
        },
      },
      {
        type: 'button',
        iconPath: getButtonIcon('play.svg'),
        onClick: async () => AudioPlayer.getInstance().Play(),
      },
      {
        type: 'button',
        iconPath: getButtonIcon('pause.svg'),
        onClick: async () => AudioPlayer.getInstance().Pause(),
      },
      {
        type: 'button',
        iconPath: getButtonIcon('chevron_right.svg'),
        onClick: () => {
          AudioPlayer.getInstance().MoveToNextBar();
        },
      },
    ],
  },
  {
    buttons: [
      {
        type: 'tooltip',
        iconPath: getButtonIcon('edit_pen.svg'),
        content: <InfoEditor />,
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
                text: 'Add bar',
                onClick: EventNotifier.NotifyAction('addNewBar', {
                  newStave: false,
                }),
              },
              {
                text: 'Add bar in next line',
                onClick: EventNotifier.NotifyAction('addNewBar', {
                  newStave: true,
                }),
              },
            ],
          },
          {
            options: [],
          },
        ],
      },
      {
        type: 'multiselect',
        iconPath: getButtonIcon('minus.svg'),
        groups: [
          {
            options: [
              {
                text: 'Remove bar',
                onClick: EventNotifier.NotifyAction('removeBar'),
              },
              {
                text: 'Remove stave',
                onClick: EventNotifier.NotifyAction('removeStave'),
              },
            ],
          },
          {
            options: [],
          },
        ],
      },
    ],
  },
  {
    buttons: [
      {
        type: 'button',
        iconPath: getButtonIcon('save.svg'),
        onClick: async () => await Notation.getInstance().SaveToJson(),
      },
      {
        type: 'button',
        iconPath: getButtonIcon('load.svg'),
        onClick: async () => await Notation.getInstance().ReadFromJson(),
      },
    ],
  },
  {
    buttons: [
      {
        type: 'tooltip',
        iconPath: getButtonIcon('piano.svg'),
        content: <MidiSelector />,
      },
    ],
  },
];
