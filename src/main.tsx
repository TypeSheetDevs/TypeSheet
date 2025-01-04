import '@assets/fonts.css';
import '@assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ConfigService } from '@services/ConfigService/ConfigService';
import { FileService } from '@services/FileService/FileService';

await ConfigService.getInstance().loadConfig();
console.log(
  await FileService.getInstance().ReadFile(await FileService.getInstance().OpenFileDialog()),
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
