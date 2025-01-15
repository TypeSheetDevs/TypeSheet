import getButtonIcon from '@assets/icons/getIcon';
import EventNotifier from '@services/eventNotifier/eventNotifier';

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
