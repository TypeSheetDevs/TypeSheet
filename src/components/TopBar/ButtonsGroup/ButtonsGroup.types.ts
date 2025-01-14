type ButtonsGroupProps = {
    buttons: ButtonsGroupButtonType[];
    isLast: boolean;
};

type ButtonsGroupButtonType = {
    type: 'button';
} & ButtonType;
