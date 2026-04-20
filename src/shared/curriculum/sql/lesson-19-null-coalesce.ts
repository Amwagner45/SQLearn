import type { Lesson } from '../../types/curriculum';

export const lesson19: Lesson = {
    id: 'null-coalesce',
    title: 'Working with NULLs',
    module: 'sql',
    order: 19,
    prerequisites: ['union-set-ops'],
    content: `# Working with NULLs

\`NULL\` means "unknown" or "missing" — it's not zero, not empty string, not false.

## Checking for NULL

\`\`\`sql
-- Survey responses with no text
SELECT survey_response_id, survey_id, rating
FROM survey_responses
WHERE response_text IS NULL
LIMIT 10;
\`\`\`

\`\`\`sql
-- Survey responses that DO have text
SELECT survey_response_id, response_text
FROM survey_responses
WHERE response_text IS NOT NULL
LIMIT 10;
\`\`\`

## COALESCE

Returns the first non-NULL value:

\`\`\`sql
SELECT
  survey_response_id,
  COALESCE(response_text, 'No response given') AS display_text
FROM survey_responses
LIMIT 15;
\`\`\`

## NULLIF

Returns NULL if two values are equal (useful for avoiding division by zero):

\`\`\`sql
-- NULLIF(a, b) returns NULL if a = b, otherwise returns a
SELECT 
  campaign_id,
  COUNT(*) AS total_responses,
  SUM(CASE WHEN response_type = 'purchase' THEN 1 ELSE 0 END) AS purchases,
  ROUND(
    SUM(CASE WHEN response_type = 'purchase' THEN 1.0 ELSE 0 END) * 100.0 /
    NULLIF(COUNT(*), 0),
  2) AS purchase_rate
FROM campaign_responses
GROUP BY campaign_id
LIMIT 10;
\`\`\`

## NULL in Aggregates

Aggregate functions (COUNT, SUM, AVG) ignore NULLs — except \`COUNT(*)\` which counts all rows:

\`\`\`sql
SELECT
  COUNT(*) AS total_rows,
  COUNT(response_text) AS rows_with_text,
  COUNT(*) - COUNT(response_text) AS rows_without_text
FROM survey_responses;
\`\`\`

## Key Takeaways

- Use \`IS NULL\` and \`IS NOT NULL\` (never \`= NULL\`)
- \`COALESCE(a, b, c)\` returns the first non-NULL value
- \`NULLIF(a, b)\` returns NULL when a equals b
- Aggregates skip NULLs (except COUNT(*))
`,
    questions: [
        {
            id: 'q1-null-count',
            prompt: 'Count the total number of survey_responses, the number with response_text, and the number without response_text.',
            hints: [
                'COUNT(*) for total, COUNT(response_text) for non-null',
                'The difference gives you null count',
                'SELECT COUNT(*) AS total, COUNT(response_text) AS with_text, COUNT(*) - COUNT(response_text) AS without_text FROM survey_responses',
            ],
            expectedQuery: 'SELECT COUNT(*) AS total, COUNT(response_text) AS with_text, COUNT(*) - COUNT(response_text) AS without_text FROM survey_responses',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-coalesce',
            prompt: 'Show survey_response_id, rating, and response_text — but replace NULL response_text with \'N/A\' using COALESCE. Limit 20.',
            hints: [
                'Use COALESCE(response_text, \'N/A\')',
                'SELECT survey_response_id, rating, COALESCE(response_text, \'N/A\') FROM survey_responses LIMIT 20',
                'SELECT survey_response_id, rating, COALESCE(response_text, \'N/A\') FROM survey_responses LIMIT 20',
            ],
            expectedQuery: "SELECT survey_response_id, rating, COALESCE(response_text, 'N/A') FROM survey_responses LIMIT 20",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
