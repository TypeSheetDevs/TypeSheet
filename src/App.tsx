import MainLayout from '@layouts/MainLayout/MainLayout';
import { useEffect } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import EventNotifier from '@services/eventNotifier/eventNotifier';
import { NotationRendererState } from '@services/notationRenderer/NotationRendererState';

function ChangeRendererState(state: NotationRendererState) {
  NotationRenderer.getInstance().ChangeStateAction(state)();
}

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
  useEffect(() => {
    const OnKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          ChangeRendererState(NotationRendererState.Idle);
          break;
        case 'a':
          ChangeRendererState(NotationRendererState.AddingNote);
          break;
        case 'r':
          ChangeRendererState(NotationRendererState.RemovingNote);
          break;
        case 'm':
          ChangeRendererState(NotationRendererState.ModifyingNote);
          break;
        case 'h':
          ChangeRendererState(NotationRendererState.AnalyzeChords);
          break;
        case 'v':
          ChangeRendererState(NotationRendererState.MoveNote);
          break;
        case 'c':
          ChangeRendererState(NotationRendererState.AddingToChord);
          break;
        case 'b':
          EventNotifier.Notify('addNewBar', { newStave: false });
          break;
        case 'n':
          EventNotifier.Notify('addNewBar', { newStave: true });
          break;
        case 'Delete':
        case 'Backspace':
          EventNotifier.Notify('removeBar');
          break;
      }
    };

    document.addEventListener('keydown', OnKeyDown);
    return () => document.removeEventListener('keydown', OnKeyDown);
  }, []);

  return <MainLayout></MainLayout>;
}

export default App;
