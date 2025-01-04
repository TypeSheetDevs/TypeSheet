import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
    interface Window {
        electron: ElectronAPI;
        api: {
            getGlobalPath: (
                filePath: string,
            ) => Promise<{ success: boolean; path?: string; error?: string }>;
            readFile: (
                filePath: string,
            ) => Promise<{ success: boolean; content?: string; error?: string }>;
            saveFile: (
                filePath: string,
                content: string,
            ) => Promise<{ success: boolean; error?: string }>;
            readFileDialog: () => Promise<{
                success: boolean;
                filePath?: string;
                error?: string;
            }>;
            saveFileDialog: () => Promise<{
                success: boolean;
                filePath?: string;
                error?: string;
            }>;
        };
    }
}
