import React, { useState } from 'react';
import type { SchemaInfo } from '../../../shared/types/database';

interface SchemaExplorerProps {
    schema: SchemaInfo | null;
}

export function SchemaExplorer({ schema }: SchemaExplorerProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    if (!schema) {
        return <div className="schema-explorer"><div className="schema-loading">Loading schema...</div></div>;
    }

    function toggleTable(name: string) {
        setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
    }

    return (
        <div className="schema-explorer">
            {schema.tables.map(table => (
                <div key={table.name} className="schema-table">
                    <button
                        className="schema-table-header"
                        onClick={() => toggleTable(table.name)}
                    >
                        <span className="schema-toggle">{expanded[table.name] ? '▼' : '▶'}</span>
                        <span className="schema-table-icon">🗂</span>
                        <span className="schema-table-name">{table.name}</span>
                        <span className="schema-table-count">{table.columns.length}</span>
                    </button>
                    {expanded[table.name] && (
                        <div className="schema-columns">
                            {table.columns.map(col => (
                                <div key={col.name} className="schema-column">
                                    <span className="schema-col-icon">│</span>
                                    <span className="schema-col-name">{col.name}</span>
                                    <span className="schema-col-type">{col.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
