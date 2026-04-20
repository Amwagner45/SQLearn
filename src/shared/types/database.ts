export interface QueryResult {
    columns: string[];
    columnTypes: string[];
    rows: any[][];
    rowCount: number;
    executionTimeMs: number;
    error?: string;
}

export interface TableInfo {
    name: string;
    columns: ColumnInfo[];
}

export interface ColumnInfo {
    name: string;
    type: string;
}

export interface SchemaInfo {
    tables: TableInfo[];
}
