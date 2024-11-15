import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getGlobalPath: (filePath: string) => Promise<string>;
            readFile: (filePath: string) => Promise<string>;
            saveFile: (
                filePath: string,
                content: string,
            ) => Promise<{ success: boolean; error?: string }>;
        };
    }
}
