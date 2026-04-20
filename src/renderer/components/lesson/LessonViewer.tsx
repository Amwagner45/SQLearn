import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Lesson } from '../../../shared/types/curriculum';
import './lesson.css';

interface LessonViewerProps {
    lesson: Lesson;
    onStartPractice: () => void;
}

export function LessonViewer({ lesson, onStartPractice }: LessonViewerProps) {
    return (
        <div className="lesson-viewer">
            <div className="lesson-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const inline = !match;
                            if (inline) {
                                return <code className={className} {...props}>{children}</code>;
                            }
                            return (
                                <SyntaxHighlighter
                                    style={oneDark as any}
                                    language={match[1]}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        },
                    }}
                >
                    {lesson.content}
                </ReactMarkdown>
                <div className="lesson-footer">
                    <button className="start-practice-btn" onClick={onStartPractice}>
                        Start Practice →
                    </button>
                </div>
            </div>
        </div>
    );
}
