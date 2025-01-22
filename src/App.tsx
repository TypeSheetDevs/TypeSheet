import MainLayout from '@layouts/MainLayout/MainLayout';
import { useEffect } from 'react';
import { NotationRenderer } from '@services/notationRenderer/NotationRenderer';
import EventNotifier from '@services/eventNotifier/eventNotifier';

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
  useEffect(() => {
    const OnKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          NotationRenderer.getInstance().ChangeStateBackToIdle();
          break;
        case 'a':
          EventNotifier.Notify('startAddingNotes');
          break;
        case 'r':
          EventNotifier.Notify('startRemovingNotes');
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
