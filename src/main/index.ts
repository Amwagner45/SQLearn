import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase, executeQuery, getSchema, closeDatabase } from './database';
import { gradeQuery } from './grading/sql-grader';
import { initStore, getProgress, saveProgress, getLessonProgress, saveLessonProgress } from './store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        title: 'SQLearn',
        icon: path.join(__dirname, '../../resources/icon.png'),
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
};

function getResourcePath(filename: string): string {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'resources', filename);
    }
    return path.join(app.getAppPath(), 'resources', filename);
}

app.whenReady().then(async () => {
    const dbPath = getResourcePath('sqlearn.db');
    await initDatabase(dbPath);
    initStore();
    registerIpcHandlers();
    createWindow();
});

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        await closeDatabase();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', async () => {
    await closeDatabase();
});

function registerIpcHandlers() {
    ipcMain.handle('db:execute-query', async (_event, sql: string) => {
        return executeQuery(sql);
    });

    ipcMain.handle('db:get-schema', async () => {
        return getSchema();
    });

    ipcMain.handle('grading:check-query', async (_event, studentSql: string, expectedSql: string, config: any) => {
        return gradeQuery(studentSql, expectedSql, config);
    });

    ipcMain.handle('progress:get', async () => {
        return getProgress();
    });

    ipcMain.handle('progress:save', async (_event, progress: any) => {
        return saveProgress(progress);
    });

    ipcMain.handle('progress:get-lesson', async (_event, lessonId: string) => {
        return getLessonProgress(lessonId);
    });

    ipcMain.handle('progress:save-lesson', async (_event, lessonId: string, progress: any) => {
        return saveLessonProgress(lessonId, progress);
    });
}
