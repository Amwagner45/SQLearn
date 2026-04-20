import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import type { QueryResult, SchemaInfo, TableInfo, ColumnInfo } from '../shared/types/database';

let db: SqlJsDatabase | null = null;

export async function initDatabase(): Promise<void> {
    // Fetch both WASM binary and DB file in parallel
    const wasmUrl = new URL('sql-wasm.wasm', window.location.href).href;
    const dbUrl = new URL('../assets/sqlearn.db', import.meta.url).href;

    const [wasmResponse, dbResponse] = await Promise.all([
        fetch(wasmUrl),
        fetch(dbUrl),
    ]);

    if (!wasmResponse.ok) {
        throw new Error(`Failed to fetch WASM: ${wasmResponse.status}`);
    }
    if (!dbResponse.ok) {
        throw new Error(`Failed to fetch database: ${dbResponse.status}`);
    }

    const [wasmBinary, dbBuffer] = await Promise.all([
        wasmResponse.arrayBuffer(),
        dbResponse.arrayBuffer(),
    ]);

    const SQL = await initSqlJs({ wasmBinary: new Uint8Array(wasmBinary) });
    db = new SQL.Database(new Uint8Array(dbBuffer));
    console.log('Database loaded in browser');
}

export async function executeQuery(sql: string): Promise<QueryResult> {
    if (!db) throw new Error('Database not initialized');

    const trimmed = sql.trim();
    if (!trimmed) {
        return { columns: [], columnTypes: [], rows: [], rowCount: 0, executionTimeMs: 0, error: 'Empty query' };
    }

    const upperSql = trimmed.toUpperCase();
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
