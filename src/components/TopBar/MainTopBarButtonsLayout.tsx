import getButtonIcon from '@assets/icons/getIcon';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { AudioPlayer } from '@services/AudioPlayer/AudioPlayer';
import { Notation } from '@services/notationRenderer/Notation';
import MidiSelector from '@components/MidiSelector/MidiSelector';
import InfoEditor from '@components/InfoEditor/InfoEditor';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';
import SignatureSelector from '@components/SignatureSelector/SignatureSelector';

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
        usedPadding: '4px',
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
            options: [
              {
                text: 'Add new notes',
                onClick: NotationRenderer.getInstance().ChangeStateAction(
                  NotationRendererState.AddingNote,
                ),
              },
              {
                text: 'Add notes to chords',
                onClick: NotationRenderer.getInstance().ChangeStateAction(
                  NotationRendererState.AddingToChord,
                ),
              },
            ],
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
            options: [
              {
                text: 'Remove notes',
                onClick: NotationRenderer.getInstance().ChangeStateAction(
                  NotationRendererState.RemovingNote,
                ),
              },
            ],
          },
        ],
      },
      {
        type: 'multiselect',
        iconPath: getButtonIcon('edit_pen.svg'),
        groups: [
          {
            options: [
              {
                text: 'Modify Chord',
                onClick: NotationRenderer.getInstance().ChangeStateAction(
                  NotationRendererState.ModifyingNote,
                ),
              },
              {
                text: 'Move Note',
                onClick: NotationRenderer.getInstance().ChangeStateAction(
                  NotationRendererState.MoveNote,
                ),
              },
            ],
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
        usedPadding: '4px',
      },
    ],
  },
  {
    buttons: [
      {
        type: 'tooltip',
        iconPath: getButtonIcon('signature.svg'),
        content: <SignatureSelector />,
        usedPadding: '0',
      },
    ],
  },
  {
    buttons: [
      {
        type: 'button',
        iconPath: getButtonIcon('sharp.svg'),
        onClick: NotationRenderer.getInstance().ChangeStateAction(
          NotationRendererState.AnalyzeChords,
        ),
      },
    ],
  },
];
