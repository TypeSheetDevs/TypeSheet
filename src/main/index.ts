import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron';
import path, { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import * as fs from 'fs';

function createWindow(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minHeight: 500,
        minWidth: 600,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });

    mainWindow.setMenu(null);

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        if (is.dev) {
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron');

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    // IPC test
    ipcMain.on('ping', () => console.log('pong'));

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}

// IPC handler for getting global filePath
ipcMain.handle('get-global-path', async (_, { filePath }: { filePath: string }) => {
    try {
        const relativePath = path.resolve(__dirname, '../../', filePath);
        return { success: true, path: relativePath };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
});

// IPC handler for reading a file
ipcMain.handle('read-file', async (_, { filePath }: { filePath: string }) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return { success: true, content };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
});

// IPC handler for saving a file
ipcMain.handle(
    'save-file',
    async (_, { filePath, content }: { filePath: string; content: string }) => {
        try {
            const dir = path.dirname(filePath);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(filePath, content, 'utf8');
            return { success: true };
        } catch (error) {
            return { success: false, error: getErrorMessage(error) };
        }
    },
);

// IPC handler for opening a file dialog
ipcMain.handle('read-file-dialog', async () => {
    try {
        const result = await dialog.showOpenDialog({
            title: 'Select a File',
            buttonLabel: 'Open',
            properties: ['openFile'], // Allow only single file selection
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
        });

        if (result.canceled) {
            return { success: false, error: 'File selection was canceled' };
        }

        return { success: true, filePath: result.filePaths[0] };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
});

ipcMain.handle('save-file-dialog', async () => {
    try {
        const result = await dialog.showSaveDialog({
            title: 'Save File',
            buttonLabel: 'Save',
            filters: [{ name: 'JSON File', extensions: ['json'] }],
        });

        if (result.canceled) {
            return { success: false, error: 'Save operation was canceled' };
        }

        return { success: true, filePath: result.filePath };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
});
