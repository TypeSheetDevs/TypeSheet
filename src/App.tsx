import MainLayout from '@layouts/MainLayout/MainLayout';

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping');
  return <MainLayout></MainLayout>;
}

export default App;
