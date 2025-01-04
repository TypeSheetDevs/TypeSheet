import RenderableStave from '@services/notationRenderer/RenderableStave';

export type NotationData = {
    title: string;
    author: string;
    staves: RenderableStave[];
};
