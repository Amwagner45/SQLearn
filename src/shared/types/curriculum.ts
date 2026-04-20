export interface GradingConfig {
    checkColumnOrder: boolean;
    checkColumnNames: boolean;
    checkRowOrder: boolean;
    floatPrecision: number;
}

export interface GradingResult {
    correct: boolean;
    feedback: string;
    expectedRowCount: number;
    actualRowCount: number;
    expectedColumnCount: number;
    actualColumnCount: number;
    diff?: RowDiff[];
}

export interface RowDiff {
    rowIndex: number;
    expected: any[];
    actual: any[];
}

export interface QuizQuestion {
    id: string;
    prompt: string;
    hints: string[];
    expectedQuery: string;
    grading: GradingConfig;
}

export interface LessonQuiz {
    questions: QuizQuestion[];
    variations: QuizQuestion[];
}

export interface Lesson {
    id: string;
    title: string;
    module: 'sql' | 'excel';
    order: number;
    prerequisites: string[];
    content: string;
    questions: QuizQuestion[];
}

export interface LessonProgress {
    lessonId: string;
    completed: boolean;
    questionsCompleted: string[];
    hintsUsed: Record<string, number>;
    attempts: Record<string, number>;
    needsVariation: string[];
}

export interface UserProgress {
    currentLessonId: string | null;
    lessons: Record<string, LessonProgress>;
    totalQuestionsCompleted: number;
    totalHintsUsed: number;
}
