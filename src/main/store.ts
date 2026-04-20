import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import type { UserProgress, LessonProgress } from '../shared/types/curriculum';

let storePath: string | null = null;
let data: { progress: UserProgress } | null = null;

const defaultProgress: UserProgress = {
    currentLessonId: null,
    lessons: {},
    totalQuestionsCompleted: 0,
    totalHintsUsed: 0,
};

const defaultLessonProgress: LessonProgress = {
    lessonId: '',
    completed: false,
    questionsCompleted: [],
    hintsUsed: {},
    attempts: {},
    needsVariation: [],
};

function loadData(): { progress: UserProgress } {
    if (!storePath) throw new Error('Store not initialized');
    try {
        const raw = fs.readFileSync(storePath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { progress: { ...defaultProgress } };
    }
}

function saveData(): void {
    if (!storePath || !data) return;
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function initStore(): void {
    storePath = path.join(app.getPath('userData'), 'sqlearn-progress.json');
    data = loadData();
}

export function getProgress(): UserProgress {
    if (!data) throw new Error('Store not initialized');
    return data.progress;
}

export function saveProgress(progress: UserProgress): void {
    if (!data) throw new Error('Store not initialized');
    data.progress = progress;
    saveData();
}

export function getLessonProgress(lessonId: string): LessonProgress {
    if (!data) throw new Error('Store not initialized');
    return data.progress.lessons[lessonId] || { ...defaultLessonProgress, lessonId };
}

export function saveLessonProgress(lessonId: string, lessonProgress: LessonProgress): void {
    if (!data) throw new Error('Store not initialized');
    data.progress.lessons[lessonId] = lessonProgress;
    saveData();
}
