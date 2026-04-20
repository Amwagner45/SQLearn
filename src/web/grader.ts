import type { GradingConfig, GradingResult } from '../shared/types/curriculum';
import { executeQuery } from './database';
import { normalizeResultSet } from '../shared/grading/normalizer';

export async function gradeQuery(
    studentSql: string,
    expectedSql: string,
    config: GradingConfig
): Promise<GradingResult> {
    const studentResult = await executeQuery(studentSql);
    if (studentResult.error) {
        return {
            correct: false,
            feedback: `Query error: ${studentResult.error}`,
            expectedRowCount: 0,
            actualRowCount: 0,
            expectedColumnCount: 0,
            actualColumnCount: 0,
        };
    }

    const expectedResult = await executeQuery(expectedSql);
    if (expectedResult.error) {
        return {
            correct: false,
            feedback: `Internal error running expected query: ${expectedResult.error}`,
            expectedRowCount: 0,
            actualRowCount: 0,
            expectedColumnCount: 0,
            actualColumnCount: 0,
        };
    }

    const normalizedStudent = normalizeResultSet(studentResult, config);
    const normalizedExpected = normalizeResultSet(expectedResult, config);

    if (normalizedStudent.columns.length !== normalizedExpected.columns.length) {
        return {
            correct: false,
            feedback: `Expected ${normalizedExpected.columns.length} column(s), but your query returned ${normalizedStudent.columns.length} column(s).`,
            expectedRowCount: normalizedExpected.rows.length,
            actualRowCount: normalizedStudent.rows.length,
            expectedColumnCount: normalizedExpected.columns.length,
            actualColumnCount: normalizedStudent.columns.length,
        };
    }

    if (config.checkColumnNames) {
        const expectedCols = normalizedExpected.columns.map(c => c.toLowerCase()).sort();
        const studentCols = normalizedStudent.columns.map(c => c.toLowerCase()).sort();
        for (let i = 0; i < expectedCols.length; i++) {
            if (expectedCols[i] !== studentCols[i]) {
                return {
                    correct: false,
                    feedback: `Column name mismatch. Expected columns: [${expectedCols.join(', ')}], got: [${studentCols.join(', ')}].`,
                    expectedRowCount: normalizedExpected.rows.length,
                    actualRowCount: normalizedStudent.rows.length,
                    expectedColumnCount: normalizedExpected.columns.length,
                    actualColumnCount: normalizedStudent.columns.length,
                };
            }
        }
    }

    if (normalizedStudent.rows.length !== normalizedExpected.rows.length) {
        return {
            correct: false,
            feedback: `Expected ${normalizedExpected.rows.length} row(s), but your query returned ${normalizedStudent.rows.length} row(s).`,
            expectedRowCount: normalizedExpected.rows.length,
            actualRowCount: normalizedStudent.rows.length,
            expectedColumnCount: normalizedExpected.columns.length,
            actualColumnCount: normalizedStudent.columns.length,
        };
    }

    const diffs = [];
    for (let i = 0; i < normalizedExpected.rows.length; i++) {
        const expRow = normalizedExpected.rows[i];
        const stuRow = normalizedStudent.rows[i];
        let match = true;
        for (let j = 0; j < expRow.length; j++) {
            if (!valuesEqual(expRow[j], stuRow[j], config.floatPrecision)) {
                match = false;
                break;
            }
        }
        if (!match) {
            diffs.push({ rowIndex: i, expected: expRow, actual: stuRow });
        }
    }

    if (diffs.length > 0) {
        const firstDiff = diffs[0];
        return {
            correct: false,
            feedback: `Data mismatch in ${diffs.length} row(s). First difference at row ${firstDiff.rowIndex + 1}.`,
            expectedRowCount: normalizedExpected.rows.length,
            actualRowCount: normalizedStudent.rows.length,
            expectedColumnCount: normalizedExpected.columns.length,
            actualColumnCount: normalizedStudent.columns.length,
            diff: diffs.slice(0, 5),
        };
    }

    return {
        correct: true,
        feedback: 'Correct! Great job!',
        expectedRowCount: normalizedExpected.rows.length,
        actualRowCount: normalizedStudent.rows.length,
        expectedColumnCount: normalizedExpected.columns.length,
        actualColumnCount: normalizedStudent.columns.length,
    };
}

function valuesEqual(a: any, b: any, floatPrecision: number): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;

    if (typeof a === 'number' && typeof b === 'number') {
        const factor = Math.pow(10, floatPrecision);
        return Math.round(a * factor) === Math.round(b * factor);
    }

    return String(a).toLowerCase() === String(b).toLowerCase();
}
