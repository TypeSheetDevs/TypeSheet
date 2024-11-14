import { NotationRenderer } from './NotationRenderer';
import RenderableStave from './RenderableStave';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { jest } from '@jest/globals';

jest.mock('@services/eventNotifier/eventNotifier', () => ({
    Notify: jest.fn(),
}));

// Mock RenderableStave
jest.mock('./RenderableStave', () => {
    return jest.fn().mockImplementation(numberOfBars => ({
        numberOfBars,
        currentPositionY: 100, // Mock property
    }));
});

describe('NotationRenderer', () => {
    let renderer: NotationRenderer;

    beforeEach(() => {
        renderer = new NotationRenderer();
        renderer.staves = []; // Clear staves before each test
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should add a new stave and notify about the change', () => {
        const numberOfBars = 4;

        // Call the AddNewStave method
        renderer.AddNewStave(numberOfBars);

        // Assert that a new RenderableStave was added
        expect(renderer.staves).toHaveLength(1);
        expect(RenderableStave).toHaveBeenCalledWith(numberOfBars);

        // Verify EventNotifier.Notify was called with correct arguments
        expect(EventNotifier.Notify).toHaveBeenCalledWith('numberOfStavesChanged', 1);
        expect(EventNotifier.Notify).toHaveBeenCalledWith('needsRender');
    });

    it('should add multiple staves when AddNewStave is called multiple times', () => {
        renderer.AddNewStave();
        renderer.AddNewStave();

        // Assert two staves were added
        expect(renderer.staves).toHaveLength(2);

        // Verify Notify is called with the updated staves count
        expect(EventNotifier.Notify).toHaveBeenCalledWith('numberOfStavesChanged', 2);
        expect(EventNotifier.Notify).toHaveBeenCalledWith('needsRender');
    });
});
