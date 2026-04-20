import React, { useState, useEffect } from 'react';
import { SqlEditor } from './SqlEditor';
import { ResultTable } from './ResultTable';
import { ResultHistory } from './ResultHistory';
import { SchemaExplorer } from './SchemaExplorer';
import type { QueryResult, SchemaInfo } from '../../../shared/types/database';
import './sql.css';

export function SqlWorkspace() {
    const [schema, setSchema] = useState<SchemaInfo | null>(null);
    const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
    const [resultHistory, setResultHistory] = useState<{ query: string; result: QueryResult }[]>([]);
    const [activeHistoryIndex, setActiveHistoryIndex] = useState(0);
    const [isExecuting, setIsExecuting] = useState(false);
    const [schemaCollapsed, setSchemaCollapsed] = useState(false);

    useEffect(() => {
        loadSchema();
    }, []);

    async function loadSchema() {
        try {
            const s = await window.api.getSchema();
            setSchema(s);
        } catch (err) {
            console.error('Failed to load schema:', err);
        }
    }

    async function handleExecuteQuery(sql: string) {
        setIsExecuting(true);
        try {
            const result = await window.api.executeQuery(sql);
            setCurrentResult(result);
            setResultHistory(prev => {
                const next = [{ query: sql, result }, ...prev].slice(0, 5);
                return next;
            });
            setActiveHistoryIndex(0);
        } catch (err: any) {
            setCurrentResult({
                columns: [],
                columnTypes: [],
                rows: [],
                rowCount: 0,
                executionTimeMs: 0,
                error: err.message || String(err),
            });
        } finally {
            setIsExecuting(false);
        }
    }

    function handleSelectHistory(index: number) {
        setActiveHistoryIndex(index);
        setCurrentResult(resultHistory[index]?.result || null);
    }

    const displayResult = currentResult;

    return (
        <div className="sql-workspace">
            {!schemaCollapsed && (
                <div className="sql-schema-panel">
                    <div className="panel-header">
                        <span>Schema Explorer</span>
                        <button className="panel-toggle" onClick={() => setSchemaCollapsed(true)}>×</button>
                    </div>
                    <SchemaExplorer schema={schema} />
                </div>
            )}
            {schemaCollapsed && (
                <button
                    className="schema-expand-btn"
                    onClick={() => setSchemaCollapsed(false)}
                    title="Show Schema Explorer"
                >
                    📊
                </button>
            )}
            <div className="sql-editor-area">
                <div className="sql-editor-container">
                    <SqlEditor
                        schema={schema}
                        onExecute={handleExecuteQuery}
                        isExecuting={isExecuting}
                    />
                </div>
                <div className="sql-results-container">
                    <ResultHistory
                        history={resultHistory}
                        activeIndex={activeHistoryIndex}
                        onSelect={handleSelectHistory}
                    />
                    <ResultTable result={displayResult} isExecuting={isExecuting} />
                </div>
            </div>
        </div>
    );
}
