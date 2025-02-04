type ButtonsGroupProps = {
    buttons: ButtonsGroupButtonType[];
    isLast: boolean;
};

type ButtonsGroupButtonType =
    | ({ type: 'button' } & ButtonType)
    | ({ type: 'multiselect' } & MultiSelectProps)
    | ({ type: 'tooltip' } & TooltipProps);
