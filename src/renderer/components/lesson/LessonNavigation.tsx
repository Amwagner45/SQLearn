import React from 'react';
import type { Lesson, UserProgress } from '../../../shared/types/curriculum';
import './lesson.css';

interface LessonNavigationProps {
    lessons: Lesson[];
    currentLessonId: string | null;
    progress: UserProgress;
    onSelectLesson: (lesson: Lesson) => void;
}

export function LessonNavigation({ lessons, currentLessonId, progress, onSelectLesson }: LessonNavigationProps) {
    const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

    return (
        <div className="lesson-navigation">
            <div className="lesson-nav-header">
                <span className="nav-section-label">SQL Lessons</span>
                <span className="nav-progress-count">
                    {Object.values(progress.lessons).filter(lp => lp.completed).length}/{lessons.length}
                </span>
            </div>
            <div className="lesson-list">
                {sortedLessons.map(lesson => {
                    const lp = progress.lessons[lesson.id];
                    const isCompleted = lp?.completed || false;
                    const isCurrent = lesson.id === currentLessonId;
                    const questionsCompleted = lp?.questionsCompleted?.length || 0;
                    const totalQuestions = lesson.questions.length;

                    return (
                        <button
                            key={lesson.id}
                            className={`lesson-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                            onClick={() => onSelectLesson(lesson)}
                        >
                            <span className="lesson-status">
                                {isCompleted ? '✅' : isCurrent ? '📝' : '○'}
                            </span>
                            <div className="lesson-item-info">
                                <span className="lesson-item-title">{lesson.order}. {lesson.title}</span>
                                {totalQuestions > 0 && (
                                    <span className="lesson-item-progress">
                                        {questionsCompleted}/{totalQuestions} questions
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
