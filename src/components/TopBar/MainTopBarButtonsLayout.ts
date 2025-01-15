import getButtonIcon from '@assets/icons/getIcon';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { AudioPlayer } from '@services/AudioPlayer/AudioPlayer';

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
                    AudioPlayer.getInstance().MoveToNextBar();
                },
            },
            {
                type: 'button',
                iconPath: getButtonIcon('play.svg'),
                onClick: async () => {
                    await AudioPlayer.getInstance().Play();
                },
            },
            {
                type: 'button',
                iconPath: getButtonIcon('stop.svg'),
                onClick: () => {
                    AudioPlayer.getInstance().Stop();
                },
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
