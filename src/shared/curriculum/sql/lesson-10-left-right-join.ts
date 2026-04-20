import type { Lesson } from '../../types/curriculum';

export const lesson10: Lesson = {
    id: 'left-right-join',
    title: 'LEFT & RIGHT JOINs',
    module: 'sql',
    order: 10,
    prerequisites: ['inner-join'],
    content: `# LEFT & RIGHT JOINs

\`INNER JOIN\` only returns rows that match in both tables. But sometimes you want to keep all rows from one table, even if there's no match. That's where \`LEFT JOIN\` and \`RIGHT JOIN\` come in.

## LEFT JOIN

Returns **all rows from the left table**, and matching rows from the right table. If no match, the right side columns are \`NULL\`.

\`\`\`sql
SELECT
  c.first_name,
  c.last_name,
  cr.response_type
FROM customers c
LEFT JOIN campaign_responses cr
  ON c.customer_id = cr.customer_id
LIMIT 20;
\`\`\`

Customers with no campaign responses still appear — their response_type will be \`NULL\`.

## Finding Non-Matching Rows

A powerful pattern: find rows with no match using \`IS NULL\`:

\`\`\`sql
-- Customers who never responded to any campaign
SELECT c.first_name, c.last_name, c.email
FROM customers c
LEFT JOIN campaign_responses cr
  ON c.customer_id = cr.customer_id
WHERE cr.response_id IS NULL;
\`\`\`

## LEFT JOIN with Aggregates

\`\`\`sql
-- Count responses per customer (including 0 for those with none)
SELECT
  c.first_name,
  c.last_name,
  COUNT(cr.response_id) AS response_count
FROM customers c
LEFT JOIN campaign_responses cr
  ON c.customer_id = cr.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY response_count ASC
LIMIT 20;
\`\`\`

> **Note:** Use \`COUNT(cr.response_id)\` instead of \`COUNT(*)\` to correctly count 0 for unmatched rows.

## RIGHT JOIN

\`RIGHT JOIN\` keeps all rows from the **right** table. It's the mirror of LEFT JOIN:

\`\`\`sql
SELECT camp.campaign_name, cr.response_type
FROM campaign_responses cr
RIGHT JOIN campaigns camp
  ON camp.campaign_id = cr.campaign_id
LIMIT 15;
\`\`\`

> In practice, \`LEFT JOIN\` is used much more often than \`RIGHT JOIN\`. You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the table order.

## Comparison

| Join Type | Keeps |
|-----------|-------|
| INNER JOIN | Only matching rows from both |
| LEFT JOIN | All rows from left + matches from right |
| RIGHT JOIN | All rows from right + matches from left |

## Key Takeaways

- \`LEFT JOIN\` keeps all rows from the left table
- Non-matching rows have \`NULL\` in the right table's columns
- Use \`WHERE right_table.column IS NULL\` to find non-matching rows
- Use \`COUNT(specific_column)\` instead of \`COUNT(*)\` with LEFT JOINs
- \`RIGHT JOIN\` is rarely used — prefer LEFT JOIN by reordering tables
`,
    questions: [
        {
            id: 'q1-left-join-basic',
            prompt: 'Show all customers with their survey response count. Include customers who have never taken a survey (they should show 0). Display first_name, last_name, and response_count. Limit to 20 rows, sorted by response count ascending.',
            hints: [
                'Use LEFT JOIN from customers to survey_responses on customer_id',
                'Use COUNT(sr.survey_response_id) to correctly count 0 for unmatched',
                'SELECT c.first_name, c.last_name, COUNT(sr.survey_response_id) AS response_count FROM customers c LEFT JOIN survey_responses sr ON c.customer_id = sr.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY response_count ASC LIMIT 20',
            ],
            expectedQuery: 'SELECT c.first_name, c.last_name, COUNT(sr.survey_response_id) AS response_count FROM customers c LEFT JOIN survey_responses sr ON c.customer_id = sr.customer_id GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY response_count ASC LIMIT 20',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-find-no-match',
            prompt: 'Find customers who have never responded to any campaign. Show their first_name, last_name, and email.',
            hints: [
                'LEFT JOIN customers with campaign_responses',
                'Add WHERE cr.response_id IS NULL to find non-matching rows',
                'SELECT c.first_name, c.last_name, c.email FROM customers c LEFT JOIN campaign_responses cr ON c.customer_id = cr.customer_id WHERE cr.response_id IS NULL',
            ],
            expectedQuery: 'SELECT c.first_name, c.last_name, c.email FROM customers c LEFT JOIN campaign_responses cr ON c.customer_id = cr.customer_id WHERE cr.response_id IS NULL',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
