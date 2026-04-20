import React from 'react';
import type { QueryResult } from '../../../shared/types/database';

interface ResultHistoryProps {
    history: { query: string; result: QueryResult }[];
    activeIndex: number;
    onSelect: (index: number) => void;
}

export function ResultHistory({ history, activeIndex, onSelect }: ResultHistoryProps) {
    if (history.length === 0) return null;

    return (
        <div className="result-history">
            {history.map((item, i) => {
                const label = item.query.length > 40 ? item.query.substring(0, 40) + '...' : item.query;
                const hasError = !!item.result.error;
                return (
                    <button
                        key={i}
                        className={`history-tab ${i === activeIndex ? 'active' : ''} ${hasError ? 'error' : ''}`}
                        onClick={() => onSelect(i)}
                        title={item.query}
                    >
                        <span className="history-icon">{hasError ? '❌' : '✓'}</span>
                        <span className="history-label">{label}</span>
                        <span className="history-rows">
                            {hasError ? 'Error' : `${item.result.rowCount} rows`}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
