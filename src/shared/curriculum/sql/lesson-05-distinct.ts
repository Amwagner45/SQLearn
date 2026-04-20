import type { Lesson } from '../../types/curriculum';

export const lesson05: Lesson = {
    id: 'distinct-values',
    title: 'DISTINCT & Unique Values',
    module: 'sql',
    order: 5,
    prerequisites: ['order-by'],
    content: `# DISTINCT & Unique Values

Often you want to know what unique values exist in a column — for example, "what states are our customers from?" or "what campaign types do we run?" The \`DISTINCT\` keyword removes duplicate rows from your results.

## Basic Syntax

\`\`\`sql
SELECT DISTINCT column_name
FROM table_name;
\`\`\`

## Examples

\`\`\`sql
-- What states do our customers live in?
SELECT DISTINCT state
FROM customers
ORDER BY state;

-- What types of campaigns do we run?
SELECT DISTINCT campaign_type
FROM campaigns;

-- What acquisition channels bring in customers?
SELECT DISTINCT acquisition_channel
FROM customers
ORDER BY acquisition_channel;
\`\`\`

## DISTINCT with Multiple Columns

When you use \`DISTINCT\` with multiple columns, it returns unique **combinations**:

\`\`\`sql
-- Unique combinations of state and acquisition channel
SELECT DISTINCT state, acquisition_channel
FROM customers
ORDER BY state, acquisition_channel;
\`\`\`

This shows every unique pair of (state, acquisition_channel) that exists in the data.

## DISTINCT with WHERE

You can combine \`DISTINCT\` with \`WHERE\`:

\`\`\`sql
-- What channels are used by customers from California?
SELECT DISTINCT acquisition_channel
FROM customers
WHERE state = 'California'
ORDER BY acquisition_channel;
\`\`\`

## Counting Distinct Values

A very common pattern is counting how many unique values exist:

\`\`\`sql
-- How many unique states do our customers come from?
SELECT COUNT(DISTINCT state) AS unique_states
FROM customers;
\`\`\`

> We'll cover \`COUNT\` and other aggregate functions in detail in a later lesson.

## Key Takeaways

- \`DISTINCT\` removes duplicate rows from results
- Works with single or multiple columns
- With multiple columns, returns unique combinations
- Can be combined with \`WHERE\`, \`ORDER BY\`, etc.
- \`COUNT(DISTINCT column)\` counts unique values
`,
    questions: [
        {
            id: 'q1-distinct-states',
            prompt: 'Find all unique states that customers live in. Sort the results alphabetically.',
            hints: [
                'Use SELECT DISTINCT to get unique values',
                'The column is "state" from the "customers" table',
                'SELECT DISTINCT state FROM customers ORDER BY state',
            ],
            expectedQuery: 'SELECT DISTINCT state FROM customers ORDER BY state',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-distinct-campaign-types',
            prompt: 'List all unique campaign types that exist in the campaigns table. Sort alphabetically.',
            hints: [
                'Use DISTINCT on the campaign_type column',
                'FROM campaigns',
                'SELECT DISTINCT campaign_type FROM campaigns ORDER BY campaign_type',
            ],
            expectedQuery: 'SELECT DISTINCT campaign_type FROM campaigns ORDER BY campaign_type',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q3-distinct-combo',
            prompt: 'Find all unique combinations of campaign_type and channel from the campaigns table. Sort by campaign_type then channel.',
            hints: [
                'Use DISTINCT with two columns',
                'SELECT DISTINCT campaign_type, channel FROM campaigns',
                'Add ORDER BY campaign_type, channel',
            ],
            expectedQuery: 'SELECT DISTINCT campaign_type, channel FROM campaigns ORDER BY campaign_type, channel',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
