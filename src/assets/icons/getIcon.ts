export default function getButtonIcon(path: string) {
    return new URL(`./${path}`, import.meta.url).href;
}
