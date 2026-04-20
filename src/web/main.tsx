import React from 'react';
import { createRoot } from 'react-dom/client';
import { initDatabase, executeQuery, getSchema } from './database';
import { getProgress, saveProgress, getLessonProgress, saveLessonProgress } from './store';
import { gradeQuery } from './grader';
import App from '../renderer/App';
import '../renderer/styles/global.css';

async function boot() {
    const splash = document.getElementById('splash');
    try {
        await initDatabase();

        // Wire the same window.api interface the renderer expects
        (window as any).api = {
            executeQuery,
            getSchema,
            gradeQuery,
            getProgress: async () => getProgress(),
            saveProgress: async (p: any) => saveProgress(p),
            getLessonProgress: async (id: string) => getLessonProgress(id),
            saveLessonProgress: async (id: string, p: any) => saveLessonProgress(id, p),
        };

        if (splash) splash.style.display = 'none';

        const root = createRoot(document.getElementById('root')!);
        root.render(<App />);
    } catch (err: any) {
        console.error('Failed to initialise SQLearn:', err);
        if (splash) {
            splash.textContent = `Failed to load: ${err?.message || err}`;
        }
    }
}

boot();
