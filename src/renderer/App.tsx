import React, { useState, useEffect } from 'react';
import { SqlWorkspace } from './components/sql/SqlWorkspace';
import { LessonNavigation } from './components/lesson/LessonNavigation';
import { LessonViewer } from './components/lesson/LessonViewer';
import { QuizPanel } from './components/quiz/QuizPanel';
import { sqlLessons } from '../shared/curriculum/sql';
import type { Lesson, UserProgress, LessonProgress } from '../shared/types/curriculum';
import './styles/app.css';

type View = 'lesson' | 'practice';

export default function App() {
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [view, setView] = useState<View>('lesson');
    const [progress, setProgress] = useState<UserProgress>({
        currentLessonId: null,
        lessons: {},
        totalQuestionsCompleted: 0,
        totalHintsUsed: 0,
    });
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        loadProgress();
    }, []);

    async function loadProgress() {
        try {
            const p = await window.api.getProgress();
            setProgress(p);
            if (p.currentLessonId) {
                const lesson = sqlLessons.find(l => l.id === p.currentLessonId);
                if (lesson) setCurrentLesson(lesson);
            }
        } catch {
            // First run, no progress yet
        }
    }

    async function handleSelectLesson(lesson: Lesson) {
        setCurrentLesson(lesson);
        setView('lesson');
        const updated = { ...progress, currentLessonId: lesson.id };
        setProgress(updated);
        await window.api.saveProgress(updated);
    }

    async function handleQuestionComplete(questionId: string) {
        if (!currentLesson) return;
        const existing = progress.lessons[currentLesson.id];
        const lessonProgress = existing
            ? {
                ...existing,
                questionsCompleted: [...existing.questionsCompleted],
                hintsUsed: { ...existing.hintsUsed },
                attempts: { ...existing.attempts },
                needsVariation: [...existing.needsVariation],
            }
            : {
                lessonId: currentLesson.id,
                completed: false,
                questionsCompleted: [] as string[],
                hintsUsed: {} as Record<string, number>,
                attempts: {} as Record<string, number>,
                needsVariation: [] as string[],
            };

        if (!lessonProgress.questionsCompleted.includes(questionId)) {
            lessonProgress.questionsCompleted.push(questionId);
        }

        // Check if all questions are completed
        const allDone = currentLesson.questions.every(q =>
            lessonProgress.questionsCompleted.includes(q.id)
        );
        lessonProgress.completed = allDone;

        const updatedLessons = { ...progress.lessons, [currentLesson.id]: lessonProgress };
        const updated = {
            ...progress,
            lessons: updatedLessons,
            totalQuestionsCompleted: Object.values(updatedLessons).reduce(
                (sum, lp) => sum + (lp as LessonProgress).questionsCompleted.length, 0
            ),
        };
        setProgress(updated);
        await window.api.saveProgress(updated);
        await window.api.saveLessonProgress(currentLesson.id, lessonProgress);
    }

    async function handleHintUsed(questionId: string) {
        if (!currentLesson) return;
        const existing = progress.lessons[currentLesson.id];
        const lessonProgress = existing
            ? {
                ...existing,
                questionsCompleted: [...existing.questionsCompleted],
                hintsUsed: { ...existing.hintsUsed },
                attempts: { ...existing.attempts },
                needsVariation: [...existing.needsVariation],
            }
            : {
                lessonId: currentLesson.id,
                completed: false,
                questionsCompleted: [] as string[],
                hintsUsed: {} as Record<string, number>,
                attempts: {} as Record<string, number>,
                needsVariation: [] as string[],
            };

        lessonProgress.hintsUsed[questionId] = (lessonProgress.hintsUsed[questionId] || 0) + 1;
        const updated = {
            ...progress,
            lessons: { ...progress.lessons, [currentLesson.id]: lessonProgress },
            totalHintsUsed: progress.totalHintsUsed + 1,
        };
        setProgress(updated);
        await window.api.saveProgress(updated);
    }

    return (
        <div className="app">
            <div className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="app-sidebar-header">
                    <h1 className="app-logo">SQL<span>earn</span></h1>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>
                {!sidebarCollapsed && (
                    <LessonNavigation
                        lessons={sqlLessons}
                        currentLessonId={currentLesson?.id || null}
                        progress={progress}
                        onSelectLesson={handleSelectLesson}
                    />
                )}
            </div>
            <div className="app-main">
                {currentLesson ? (
                    <>
                        <div className="app-toolbar">
                            <div className="toolbar-lesson-info">
                                <span className="toolbar-lesson-number">Lesson {currentLesson.order}</span>
                                <span className="toolbar-lesson-title">{currentLesson.title}</span>
                            </div>
                            <div className="toolbar-tabs">
                                <button
                                    className={`toolbar-tab ${view === 'lesson' ? 'active' : ''}`}
                                    onClick={() => setView('lesson')}
                                >
                                    📖 Lesson
                                </button>
                                <button
                                    className={`toolbar-tab ${view === 'practice' ? 'active' : ''}`}
                                    onClick={() => setView('practice')}
                                >
                                    💻 Practice
                                </button>
                            </div>
                        </div>
                        <div className="app-content">
                            {view === 'lesson' ? (
                                <LessonViewer
                                    lesson={currentLesson}
                                    onStartPractice={() => setView('practice')}
                                />
                            ) : (
                                <div className="practice-layout">
                                    <div className="practice-ide">
                                        <SqlWorkspace />
                                    </div>
                                    <div className="practice-quiz">
                                        <QuizPanel
                                            lesson={currentLesson}
                                            lessonProgress={progress.lessons[currentLesson.id]}
                                            onQuestionComplete={handleQuestionComplete}
                                            onHintUsed={handleHintUsed}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="welcome-screen">
                        <h1>Welcome to SQL<span className="accent">earn</span></h1>
                        <p>Select a lesson from the sidebar to get started.</p>
                        <p className="welcome-subtitle">Learn SQL through interactive, hands-on exercises with real marketing data.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
