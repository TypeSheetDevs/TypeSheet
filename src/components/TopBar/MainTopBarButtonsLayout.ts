import getButtonIcon from '@assets/icons/getIcon';

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
                                onClick: () => console.log('clicked a'),
                                text: 'a',
                            },
                        ],
                    },
                    {
                        options: [
                            {
                                onClick: () => console.log('clicked b'),
                                text: 'b',
                            },
                        ],
                    },
                ],
            },
            {
                type: 'button',
                iconPath: getButtonIcon('minus.svg'),
                onClick: () => {},
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
