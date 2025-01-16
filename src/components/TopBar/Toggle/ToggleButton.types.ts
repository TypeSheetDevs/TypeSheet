type ToggleProps = {
    iconPath1: string;
    iconPath2: string;
    onClick1: (() => void) | (() => Promise<void>);
    onClick2: (() => void) | (() => Promise<void>);
    toggleFunction: () => boolean;
};
