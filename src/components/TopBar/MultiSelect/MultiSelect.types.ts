type MultiSelectProps = {
    iconPath: string;
    groups: MultiSelectGroup[];
};

type MultiSelectGroup = {
    options: MultiSelectOption[];
};

type MultiSelectOption = {
    onClick: () => void;
    text: string;
};
