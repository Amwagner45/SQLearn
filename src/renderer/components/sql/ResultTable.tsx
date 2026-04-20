import React from 'react';
import type { QueryResult } from '../../../shared/types/database';

interface ResultTableProps {
    result: QueryResult | null;
    isExecuting: boolean;
}

export function ResultTable({ result, isExecuting }: ResultTableProps) {
    if (isExecuting) {
        return (
            <div className="result-table-container">
                <div className="result-status">⏳ Executing query...</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="result-table-container">
                <div className="result-status">Run a query to see results here.</div>
            </div>
        );
    }

    if (result.error) {
        return (
            <div className="result-table-container">
                <div className="result-error">
                    <span className="error-icon">❌</span>
                    <pre className="error-message">{result.error}</pre>
                </div>
            </div>
        );
    }

    if (result.rows.length === 0) {
        return (
            <div className="result-table-container">
                <div className="result-status">
                    Query returned 0 rows ({result.executionTimeMs.toFixed(1)} ms)
                </div>
            </div>
        );
    }

    return (
        <div className="result-table-container">
            <div className="result-info">
                <span>{result.rowCount} row{result.rowCount !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{result.columns.length} column{result.columns.length !== 1 ? 's' : ''}</span>
                <span>•</span>
                <span>{result.executionTimeMs.toFixed(1)} ms</span>
            </div>
            <div className="result-table-scroll">
                <table className="result-table">
                    <thead>
                        <tr>
                            <th className="row-number-header">#</th>
                            {result.columns.map((col, i) => (
                                <th key={i}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {result.rows.map((row, ri) => (
                            <tr key={ri}>
                                <td className="row-number">{ri + 1}</td>
                                {row.map((val, ci) => (
                                    <td key={ci} className={val === null ? 'null-value' : ''}>
                                        {val === null ? 'NULL' : String(val)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
