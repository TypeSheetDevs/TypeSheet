import '@assets/fonts.css';
import '@assets/main.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ConfigService } from '@services/ConfigService/ConfigService';
import { MidiService } from '@services/MidiService/MidiService';

await ConfigService.getInstance().loadConfig();
await MidiService.getInstance().Connect();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
