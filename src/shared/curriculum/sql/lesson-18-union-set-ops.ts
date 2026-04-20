import type { Lesson } from '../../types/curriculum';

export const lesson18: Lesson = {
    id: 'union-set-ops',
    title: 'UNION & Set Operations',
    module: 'sql',
    order: 18,
    prerequisites: ['date-functions'],
    content: `# UNION & Set Operations

Set operations combine the results of two or more SELECT queries.

## UNION

Combines results and removes duplicates:

\`\`\`sql
-- All unique response types from campaign_responses and device types
SELECT response_type AS value, 'response_type' AS source
FROM campaign_responses
UNION
SELECT device_type AS value, 'device_type' AS source
FROM campaign_responses;
\`\`\`

## UNION ALL

Combines results but keeps duplicates (faster):

\`\`\`sql
-- Customers from California OR New York
SELECT first_name, last_name, state
FROM customers
WHERE state = 'California'
UNION ALL
SELECT first_name, last_name, state
FROM customers
WHERE state = 'New York';
\`\`\`

## Rules for UNION

1. Both SELECT statements must have the **same number of columns**
2. Corresponding columns should have **compatible types**
3. Column names come from the **first** SELECT

## EXCEPT

Returns rows in the first query that are NOT in the second:

\`\`\`sql
-- Customers who signed up but never responded to a campaign
SELECT customer_id FROM customers
EXCEPT
SELECT DISTINCT customer_id FROM campaign_responses;
\`\`\`

## INTERSECT

Returns only rows that appear in BOTH queries:

\`\`\`sql
-- Customers who both responded to campaigns AND took surveys
SELECT DISTINCT customer_id FROM campaign_responses
INTERSECT
SELECT DISTINCT customer_id FROM survey_responses;
\`\`\`

## Key Takeaways

- \`UNION\` combines results, removes duplicates
- \`UNION ALL\` combines without removing duplicates (faster)
- \`EXCEPT\` returns rows only in the first query
- \`INTERSECT\` returns rows in both queries
- All set operations require matching column counts
`,
    questions: [
        {
            id: 'q1-union',
            prompt: 'Use UNION to find all distinct states from customers and all distinct channels from campaigns, in a single result. Alias the column as \'value\'.',
            hints: [
                'SELECT DISTINCT state AS value FROM customers UNION SELECT DISTINCT channel AS value FROM campaigns',
                'UNION automatically removes duplicates',
                'SELECT DISTINCT state AS value FROM customers UNION SELECT DISTINCT channel AS value FROM campaigns',
            ],
            expectedQuery: 'SELECT DISTINCT state AS value FROM customers UNION SELECT DISTINCT channel AS value FROM campaigns',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-except',
            prompt: 'Find customer_ids that appear in customers but have never made a purchase (response_type = \'purchase\') in campaign_responses. Use EXCEPT.',
            hints: [
                'SELECT customer_id FROM customers EXCEPT SELECT DISTINCT customer_id FROM campaign_responses WHERE ...',
                'Filter the second query with WHERE response_type = \'purchase\'',
                'SELECT customer_id FROM customers EXCEPT SELECT DISTINCT customer_id FROM campaign_responses WHERE response_type = \'purchase\'',
            ],
            expectedQuery: "SELECT customer_id FROM customers EXCEPT SELECT DISTINCT customer_id FROM campaign_responses WHERE response_type = 'purchase'",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
