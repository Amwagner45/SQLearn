import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import type { QueryResult, SchemaInfo, TableInfo, ColumnInfo } from '../shared/types/database';

let db: SqlJsDatabase | null = null;

function getWasmPath(): string {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'resources', 'sql-wasm.wasm');
    }
    return path.join(app.getAppPath(), 'resources', 'sql-wasm.wasm');
}

export async function initDatabase(dbPath: string): Promise<void> {
    const wasmBinary = fs.readFileSync(getWasmPath());
    const SQL = await initSqlJs({ wasmBinary });
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    console.log(`Database opened: ${dbPath}`);
}

export async function executeQuery(sql: string): Promise<QueryResult> {
    if (!db) throw new Error('Database not initialized');

    const trimmed = sql.trim();
    if (!trimmed) {
        return { columns: [], columnTypes: [], rows: [], rowCount: 0, executionTimeMs: 0, error: 'Empty query' };
    }

    // Strip comments before checking the statement type
    const stripped = trimmed.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    const upperSql = stripped.toUpperCase();
    const allowed = upperSql.startsWith('SELECT') || upperSql.startsWith('WITH') || upperSql.startsWith('EXPLAIN');
    if (!allowed) {
        return {
            columns: [],
            columnTypes: [],
            rows: [],
            rowCount: 0,
            executionTimeMs: 0,
            error: 'Only SELECT, WITH (CTE), and EXPLAIN queries are allowed.',
        };
    }

    const start = performance.now();
    try {
        const results = db.exec(trimmed);
        const elapsed = performance.now() - start;

        if (!results || results.length === 0) {
            return { columns: [], columnTypes: [], rows: [], rowCount: 0, executionTimeMs: elapsed };
        }

        const result = results[0];
        const columns = result.columns;
        const rows = result.values;
        const columnTypes = columns.map((_col, i) => {
            const val = rows.length > 0 ? rows[0][i] : null;
            return val === null ? 'unknown' : typeof val;
        });

        return {
            columns,
            columnTypes,
            rows,
            rowCount: rows.length,
            executionTimeMs: elapsed,
        };
    } catch (err: any) {
        const elapsed = performance.now() - start;
        return {
            columns: [],
            columnTypes: [],
            rows: [],
            rowCount: 0,
            executionTimeMs: elapsed,
            error: err.message || String(err),
        };
    }
}

export async function getSchema(): Promise<SchemaInfo> {
    if (!db) throw new Error('Database not initialized');

    const tables: TableInfo[] = [];
    const tableResults = db.exec(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    );

    if (tableResults.length > 0) {
        for (const row of tableResults[0].values) {
            const tableName = row[0] as string;
            const colResults = db.exec(`PRAGMA table_info("${tableName}")`);

            const columns: ColumnInfo[] = [];
            if (colResults.length > 0) {
                for (const colRow of colResults[0].values) {
                    columns.push({
                        name: colRow[1] as string,
                        type: (colRow[2] as string) || 'TEXT',
                    });
                }
            }

            tables.push({ name: tableName, columns });
        }
    }

    return { tables };
}

export async function executeRawQuery(sql: string): Promise<any[]> {
    if (!db) throw new Error('Database not initialized');
    const results = db.exec(sql);
    if (!results || results.length === 0) return [];
    return results[0].values.map(row => {
        const obj: Record<string, any> = {};
        results[0].columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
    });
}

export async function closeDatabase(): Promise<void> {
    if (db) {
        db.close();
        db = null;
    }
}
