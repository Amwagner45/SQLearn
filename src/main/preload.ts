import { contextBridge, ipcRenderer } from 'electron';

const api = {
    executeQuery: (sql: string): Promise<any> =>
        ipcRenderer.invoke('db:execute-query', sql),
    getSchema: (): Promise<any> =>
        ipcRenderer.invoke('db:get-schema'),
    gradeQuery: (studentSql: string, expectedSql: string, config: any): Promise<any> =>
        ipcRenderer.invoke('grading:check-query', studentSql, expectedSql, config),
    getProgress: (): Promise<any> =>
        ipcRenderer.invoke('progress:get'),
    saveProgress: (progress: any): Promise<void> =>
        ipcRenderer.invoke('progress:save', progress),
    getLessonProgress: (lessonId: string): Promise<any> =>
        ipcRenderer.invoke('progress:get-lesson', lessonId),
    saveLessonProgress: (lessonId: string, progress: any): Promise<void> =>
        ipcRenderer.invoke('progress:save-lesson', lessonId, progress),
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronAPI = typeof api;
