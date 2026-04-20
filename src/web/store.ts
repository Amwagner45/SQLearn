import type { UserProgress, LessonProgress } from '../shared/types/curriculum';

const STORAGE_KEY = 'sqlearn-progress';

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

function loadProgress(): UserProgress {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // corrupted data, reset
    }
    return { ...defaultProgress };
}

function save(progress: UserProgress): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getProgress(): UserProgress {
    return loadProgress();
}

export function saveProgress(progress: UserProgress): void {
    save(progress);
}

export function getLessonProgress(lessonId: string): LessonProgress {
    const progress = loadProgress();
    return progress.lessons[lessonId] || { ...defaultLessonProgress, lessonId };
}

export function saveLessonProgress(lessonId: string, lessonProgress: LessonProgress): void {
    const progress = loadProgress();
    progress.lessons[lessonId] = lessonProgress;
    save(progress);
}
