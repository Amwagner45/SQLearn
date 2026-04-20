import type { GradingConfig } from '../../shared/types/curriculum';
import type { QueryResult } from '../../shared/types/database';

interface NormalizedResult {
    columns: string[];
    rows: any[][];
}

export function normalizeResultSet(result: QueryResult, config: GradingConfig): NormalizedResult {
    let columns = [...result.columns];
    let rows = result.rows.map(r => [...r]);

    // If not checking column order, reorder columns to a canonical order
    if (!config.checkColumnOrder && columns.length > 0 && rows.length > 0) {
        const reordered = reorderColumnsByFingerprint(columns, rows);
        columns = reordered.columns;
        rows = reordered.rows;
    }

    // If not checking row order, sort rows deterministically
    if (!config.checkRowOrder) {
        rows = sortRows(rows);
    }

    // Round floats
    rows = rows.map(row =>
        row.map(val => {
            if (typeof val === 'number' && !Number.isInteger(val)) {
                const factor = Math.pow(10, config.floatPrecision);
                return Math.round(val * factor) / factor;
            }
            return val;
        })
    );

    return { columns, rows };
}

function reorderColumnsByFingerprint(columns: string[], rows: any[][]): { columns: string[]; rows: any[][] } {
    // Create a fingerprint for each column based on its data
    const fingerprints = columns.map((col, idx) => {
        const values = rows.slice(0, Math.min(10, rows.length)).map(r => String(r[idx] ?? ''));
        return {
            originalIndex: idx,
            fingerprint: values.join('|'),
            name: col,
        };
    });

    // Sort columns by fingerprint for deterministic ordering
    fingerprints.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));

    const newColumns = fingerprints.map(f => f.name);
    const newRows = rows.map(row => fingerprints.map(f => row[f.originalIndex]));

    return { columns: newColumns, rows: newRows };
}

function sortRows(rows: any[][]): any[][] {
    return [...rows].sort((a, b) => {
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            const va = a[i];
            const vb = b[i];
            if (va === vb) continue;
            if (va === null || va === undefined) return -1;
            if (vb === null || vb === undefined) return 1;
            const sa = String(va).toLowerCase();
            const sb = String(vb).toLowerCase();
            if (sa < sb) return -1;
            if (sa > sb) return 1;
        }
        return 0;
    });
}
