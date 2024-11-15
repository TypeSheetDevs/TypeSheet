import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
// import path from 'path';

// Custom APIs for renderer
const api = {
    readFile: (filePath: string): Promise<string> => {
        return ipcRenderer.invoke('read-file', { filePath });
    },
    saveFile: (
        filePath: string,
        content: string,
    ): Promise<{ success: boolean; error?: string }> => {
        return ipcRenderer.invoke('save-file', { filePath, content });
    },
    getTopLevelPath(): Promise<string> {
        return ipcRenderer.invoke('top-level-path');
    },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
