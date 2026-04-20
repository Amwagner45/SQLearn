import type { Lesson } from '../../types/curriculum';

export const lesson04: Lesson = {
    id: 'order-by',
    title: 'Sorting with ORDER BY',
    module: 'sql',
    order: 4,
    prerequisites: ['where-clause'],
    content: `# Sorting with ORDER BY

By default, SQL doesn't guarantee the order of results. The \`ORDER BY\` clause lets you sort results by one or more columns.

## Basic Syntax

\`\`\`sql
SELECT columns
FROM table_name
ORDER BY column_name;
\`\`\`

By default, sorting is **ascending** (A→Z, 0→9, oldest→newest).

## Ascending vs Descending

\`\`\`sql
-- Ascending (default) - youngest first
SELECT first_name, last_name, age
FROM customers
ORDER BY age ASC
LIMIT 10;

-- Descending - oldest first
SELECT first_name, last_name, age
FROM customers
ORDER BY age DESC
LIMIT 10;
\`\`\`

## Sorting by Multiple Columns

You can sort by multiple columns. SQL sorts by the first column, then uses the second column to break ties:

\`\`\`sql
SELECT first_name, last_name, state, age
FROM customers
ORDER BY state ASC, age DESC
LIMIT 20;
\`\`\`

This sorts by state alphabetically, and within each state, by age from oldest to youngest.

## Sorting with WHERE

You can combine \`WHERE\` and \`ORDER BY\`:

\`\`\`sql
SELECT campaign_name, budget
FROM campaigns
WHERE budget > 10000
ORDER BY budget DESC;
\`\`\`

> **Remember:** \`WHERE\` always comes before \`ORDER BY\`.

## Sorting by Column Position

You can also sort by column position number (1-based):

\`\`\`sql
SELECT first_name, age, state
FROM customers
ORDER BY 3, 2 DESC
LIMIT 10;
\`\`\`

This sorts by the 3rd column (state), then 2nd column (age) descending.

## Key Takeaways

- \`ORDER BY\` sorts your results
- \`ASC\` = ascending (default), \`DESC\` = descending
- Sort by multiple columns separated by commas
- \`WHERE\` comes before \`ORDER BY\`
- \`LIMIT\` comes after \`ORDER BY\`
`,
    questions: [
        {
            id: 'q1-order-age',
            prompt: 'List the 10 oldest customers. Select first_name, last_name, and age, sorted by age descending.',
            hints: [
                'Use ORDER BY age DESC to sort from oldest to youngest',
                'Add LIMIT 10 to get only 10 results',
                'SELECT first_name, last_name, age FROM customers ORDER BY age DESC LIMIT 10',
            ],
            expectedQuery: 'SELECT first_name, last_name, age FROM customers ORDER BY age DESC LIMIT 10',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-order-budget',
            prompt: 'Show all campaigns sorted by budget from highest to lowest. Select campaign_name and budget.',
            hints: [
                'Use ORDER BY budget DESC',
                'You don\'t need a WHERE clause for this one',
                'SELECT campaign_name, budget FROM campaigns ORDER BY budget DESC',
            ],
            expectedQuery: 'SELECT campaign_name, budget FROM campaigns ORDER BY budget DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q3-order-multi',
            prompt: 'Show the 20 cheapest products, sorted by category alphabetically, then by price ascending within each category. Select product_name, category, and price.',
            hints: [
                'Sort by two columns: category first, then price',
                'ORDER BY category ASC, price ASC',
                'SELECT product_name, category, price FROM products ORDER BY category ASC, price ASC LIMIT 20',
            ],
            expectedQuery: 'SELECT product_name, category, price FROM products ORDER BY category ASC, price ASC LIMIT 20',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
