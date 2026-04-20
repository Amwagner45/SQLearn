import React, { useState, useRef } from 'react';
import type { Lesson, LessonProgress, QuizQuestion, GradingResult } from '../../../shared/types/curriculum';
import './quiz.css';

interface QuizPanelProps {
    lesson: Lesson;
    lessonProgress?: LessonProgress;
    onQuestionComplete: (questionId: string) => void;
    onHintUsed: (questionId: string) => void;
}

export function QuizPanel({ lesson, lessonProgress, onQuestionComplete, onHintUsed }: QuizPanelProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userSql, setUserSql] = useState('');
    const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
    const [hintsRevealed, setHintsRevealed] = useState(0);
    const [answerRevealed, setAnswerRevealed] = useState(false);
    const [isGrading, setIsGrading] = useState(false);
    const [needsVariation, setNeedsVariation] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const questions = lesson.questions;
    if (questions.length === 0) {
        return (
            <div className="quiz-panel">
                <div className="quiz-empty">No practice questions for this lesson yet.</div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCompleted = lessonProgress?.questionsCompleted?.includes(currentQuestion.id) || false;

    async function handleSubmit() {
        if (!userSql.trim() || isGrading) return;
        setIsGrading(true);
        try {
            const result = await window.api.gradeQuery(
                userSql.trim(),
                currentQuestion.expectedQuery,
                currentQuestion.grading
            );
            setGradingResult(result);
            if (result.correct) {
                if (needsVariation) {
                    setNeedsVariation(false);
                }
                onQuestionComplete(currentQuestion.id);
            }
        } catch (err: any) {
            setGradingResult({
                correct: false,
                feedback: `Error: ${err.message || String(err)}`,
                expectedRowCount: 0,
                actualRowCount: 0,
                expectedColumnCount: 0,
                actualColumnCount: 0,
            });
        } finally {
            setIsGrading(false);
        }
    }

    function handleHint() {
        if (hintsRevealed < currentQuestion.hints.length) {
            setHintsRevealed(hintsRevealed + 1);
            onHintUsed(currentQuestion.id);
        }
    }

    function handleRevealAnswer() {
        setAnswerRevealed(true);
        setNeedsVariation(true);
    }

    function handleNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            resetState();
        }
    }

    function handlePrevQuestion() {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            resetState();
        }
    }

    function resetState() {
        setUserSql('');
        setGradingResult(null);
        setHintsRevealed(0);
        setAnswerRevealed(false);
        setNeedsVariation(false);
    }

    return (
        <div className="quiz-panel">
            <div className="quiz-header">
                <span className="quiz-title">Practice Questions</span>
                <span className="quiz-progress">{currentQuestionIndex + 1} / {questions.length}</span>
            </div>

            <div className="quiz-question">
                <div className="question-prompt">
                    {isCompleted && <span className="question-done-badge">✅ Completed</span>}
                    <p>{currentQuestion.prompt}</p>
                </div>

                {/* Hints */}
                {hintsRevealed > 0 && (
                    <div className="hints-container">
                        {currentQuestion.hints.slice(0, hintsRevealed).map((hint, i) => (
                            <div key={i} className="hint">
                                <span className="hint-label">Hint {i + 1}:</span> {hint}
                            </div>
                        ))}
                    </div>
                )}

                {/* Answer revealed */}
                {answerRevealed && (
                    <div className="answer-revealed">
                        <span className="answer-label">Expected Query:</span>
                        <pre className="answer-sql">{currentQuestion.expectedQuery}</pre>
                        {needsVariation && (
                            <p className="variation-notice">
                                ⚠️ Since the answer was revealed, you must still write and submit a correct query to complete this question.
                            </p>
                        )}
                    </div>
                )}

                {/* SQL Input */}
                <div className="quiz-input">
                    <textarea
                        ref={textareaRef}
                        className="quiz-textarea"
                        placeholder="Write your SQL query here..."
                        value={userSql}
                        onChange={e => setUserSql(e.target.value)}
                        onKeyDown={e => {
                            if (e.ctrlKey && e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        rows={5}
                    />
                </div>

                {/* Actions */}
                <div className="quiz-actions">
                    <button
                        className="quiz-submit-btn"
                        onClick={handleSubmit}
                        disabled={!userSql.trim() || isGrading}
                    >
                        {isGrading ? '⏳ Checking...' : '✓ Submit'}
                    </button>
                    <div className="quiz-secondary-actions">
                        {hintsRevealed < currentQuestion.hints.length && !answerRevealed && (
                            <button className="quiz-hint-btn" onClick={handleHint}>
                                💡 Hint ({hintsRevealed}/{currentQuestion.hints.length})
                            </button>
                        )}
                        {hintsRevealed >= currentQuestion.hints.length && !answerRevealed && (
                            <button className="quiz-reveal-btn" onClick={handleRevealAnswer}>
                                👁 Show Answer
                            </button>
                        )}
                    </div>
                </div>

                {/* Grading result */}
                {gradingResult && (
                    <div className={`grading-result ${gradingResult.correct ? 'correct' : 'incorrect'}`}>
                        <span className="grading-icon">{gradingResult.correct ? '🎉' : '❌'}</span>
                        <div className="grading-details">
                            <p className="grading-feedback">{gradingResult.feedback}</p>
                            {!gradingResult.correct && gradingResult.expectedRowCount > 0 && (
                                <p className="grading-meta">
                                    Expected: {gradingResult.expectedRowCount} rows × {gradingResult.expectedColumnCount} cols |
                                    Got: {gradingResult.actualRowCount} rows × {gradingResult.actualColumnCount} cols
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="quiz-nav">
                <button
                    className="quiz-nav-btn"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    ← Previous
                </button>
                <button
                    className="quiz-nav-btn"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex >= questions.length - 1}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
