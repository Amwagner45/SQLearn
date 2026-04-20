import React, { useRef, useCallback, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { SchemaInfo } from '../../../shared/types/database';

interface SqlEditorProps {
    schema: SchemaInfo | null;
    onExecute: (sql: string) => void;
    isExecuting: boolean;
}

export function SqlEditor({ schema, onExecute, isExecuting }: SqlEditorProps) {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);
    const completionDisposableRef = useRef<any>(null);
    const schemaRef = useRef<SchemaInfo | null>(null);

    // Keep schemaRef in sync with the prop
    schemaRef.current = schema;

    // Register/re-register completion provider when schema changes
    useEffect(() => {
        const monaco = monacoRef.current;
        if (!monaco) return;

        // Dispose previous provider
        if (completionDisposableRef.current) {
            completionDisposableRef.current.dispose();
        }

        completionDisposableRef.current = monaco.languages.registerCompletionItemProvider('sql', {
            provideCompletionItems: (model: any, position: any) => {
                const currentSchema = schemaRef.current;
                if (!currentSchema) return { suggestions: [] };

                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions: any[] = [];

                for (const table of currentSchema.tables) {
                    suggestions.push({
                        label: table.name,
                        kind: monaco.languages.CompletionItemKind.Class,
                        insertText: table.name,
                        detail: `Table (${table.columns.length} columns)`,
                        range,
                    });

                    for (const col of table.columns) {
                        suggestions.push({
                            label: `${table.name}.${col.name}`,
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: `${table.name}.${col.name}`,
                            detail: `${col.type} — ${table.name}`,
                            range,
                        });
                        suggestions.push({
                            label: col.name,
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: col.name,
                            detail: `${col.type} — ${table.name}`,
                            range,
                        });
                    }
                }

                const keywords = [
                    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE',
                    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT',
                    'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN',
                    'ON', 'USING', 'AS', 'IS NULL', 'IS NOT NULL',
                    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
                    'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
                    'WITH', 'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
                    'EXISTS', 'ANY', 'ALL',
                    'ASC', 'DESC', 'NULLS FIRST', 'NULLS LAST',
                    'CAST', 'COALESCE', 'EXTRACT',
                    'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LAG', 'LEAD',
                    'OVER', 'PARTITION BY', 'ROWS BETWEEN',
                    'UPPER', 'LOWER', 'TRIM', 'SUBSTRING', 'LENGTH', 'REPLACE', 'CONCAT',
                    'ROUND', 'CEIL', 'FLOOR', 'ABS',
                    'CURRENT_DATE', 'CURRENT_TIMESTAMP',
                    'STRFTIME', 'JULIANDAY', 'SUBSTR',
                    'TRUE', 'FALSE',
                ];

                for (const kw of keywords) {
                    suggestions.push({
                        label: kw,
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: kw,
                        range,
                    });
                }

                return { suggestions };
            },
        });

        return () => {
            if (completionDisposableRef.current) {
                completionDisposableRef.current.dispose();
                completionDisposableRef.current = null;
            }
        };
    }, [schema]);

    const handleMount: OnMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Ctrl+Enter to execute
        editor.addAction({
            id: 'execute-query',
            label: 'Execute Query',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            run: () => {
                const selection = editor.getSelection();
                const model = editor.getModel();
                if (!model) return;

                let sql: string;
                if (selection && !selection.isEmpty()) {
                    sql = model.getValueInRange(selection);
                } else {
                    sql = model.getValue();
                }
                onExecute(sql.trim());
            },
        });

        editor.focus();
    }, [onExecute]);

    return (
        <div className="sql-editor">
            <div className="editor-toolbar">
                <span className="editor-label">SQL Editor</span>
                <div className="editor-actions">
                    <span className="editor-shortcut">Ctrl+Enter to run</span>
                    <button
                        className="run-btn"
                        onClick={() => {
                            const editor = editorRef.current;
                            if (!editor) return;
                            const model = editor.getModel();
                            if (!model) return;
                            const selection = editor.getSelection();
                            let sql: string;
                            if (selection && !selection.isEmpty()) {
                                sql = model.getValueInRange(selection);
                            } else {
                                sql = model.getValue();
                            }
                            onExecute(sql.trim());
                        }}
                        disabled={isExecuting}
                    >
                        {isExecuting ? '⏳ Running...' : '▶ Run Query'}
                    </button>
                </div>
            </div>
            <Editor
                height="100%"
                defaultLanguage="sql"
                defaultValue="-- Write your SQL query here\nSELECT * FROM customers LIMIT 10;"
                theme="vs-dark"
                onMount={handleMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'var(--font-mono)',
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    padding: { top: 8 },
                }}
            />
        </div>
    );
}
