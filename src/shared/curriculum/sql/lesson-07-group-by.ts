import type { Lesson } from '../../types/curriculum';

export const lesson07: Lesson = {
    id: 'group-by',
    title: 'GROUP BY',
    module: 'sql',
    order: 7,
    prerequisites: ['aggregate-functions'],
    content: `# GROUP BY

\`GROUP BY\` is one of the most powerful SQL features. It lets you split your data into groups and run aggregate functions on each group separately.

## Why GROUP BY?

Without \`GROUP BY\`, aggregate functions summarize the entire table into one row. With \`GROUP BY\`, you get one row per group.

## Basic Syntax

\`\`\`sql
SELECT group_column, AGGREGATE_FUNCTION(column)
FROM table_name
GROUP BY group_column;
\`\`\`

## Examples

\`\`\`sql
-- Count customers by state
SELECT state, COUNT(*) AS customer_count
FROM customers
GROUP BY state
ORDER BY customer_count DESC;

-- Total budget by campaign type
SELECT campaign_type, SUM(budget) AS total_budget
FROM campaigns
GROUP BY campaign_type;

-- Average age by acquisition channel
SELECT acquisition_channel, AVG(age) AS avg_age
FROM customers
GROUP BY acquisition_channel;
\`\`\`

## GROUP BY with Multiple Columns

\`\`\`sql
-- Count customers by state and gender
SELECT state, gender, COUNT(*) AS count
FROM customers
GROUP BY state, gender
ORDER BY state, gender;
\`\`\`

## Important Rule

> **Every column in SELECT must either be in GROUP BY or inside an aggregate function.**

This is **correct**:
\`\`\`sql
SELECT state, COUNT(*) FROM customers GROUP BY state;
\`\`\`

This would cause an **error**:
\`\`\`sql
-- ERROR: first_name is not in GROUP BY or an aggregate
SELECT state, first_name, COUNT(*) FROM customers GROUP BY state;
\`\`\`

## Combining with WHERE

\`WHERE\` filters rows **before** grouping:

\`\`\`sql
-- Count customers by state, but only for ages 25-40
SELECT state, COUNT(*) AS count
FROM customers
WHERE age BETWEEN 25 AND 40
GROUP BY state
ORDER BY count DESC;
\`\`\`

## Key Takeaways

- \`GROUP BY\` splits data into groups for aggregate calculations
- Every non-aggregate column in SELECT must be in GROUP BY
- \`WHERE\` filters before grouping
- Results have one row per unique group
- Combine with \`ORDER BY\` to sort grouped results
`,
    questions: [
        {
            id: 'q1-count-by-state',
            prompt: 'Count the number of customers in each state. Show the state and count, sorted by count descending.',
            hints: [
                'Use GROUP BY state with COUNT(*)',
                'SELECT state, COUNT(*) FROM customers GROUP BY state',
                'Add ORDER BY COUNT(*) DESC (or use an alias)',
            ],
            expectedQuery: 'SELECT state, COUNT(*) AS customer_count FROM customers GROUP BY state ORDER BY customer_count DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-budget-by-type',
            prompt: 'Find the total budget for each campaign type. Show campaign_type and the total budget.',
            hints: [
                'Use SUM(budget) with GROUP BY campaign_type',
                'SELECT campaign_type, SUM(budget) FROM campaigns GROUP BY campaign_type',
                'The table is "campaigns"',
            ],
            expectedQuery: 'SELECT campaign_type, SUM(budget) FROM campaigns GROUP BY campaign_type',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 0 },
        },
        {
            id: 'q3-avg-rating-by-survey',
            prompt: 'Find the average rating for each survey. Show survey_id and the average rating, sorted by average rating descending.',
            hints: [
                'Use AVG(rating) with GROUP BY survey_id',
                'The table is survey_responses',
                'SELECT survey_id, AVG(rating) FROM survey_responses GROUP BY survey_id ORDER BY AVG(rating) DESC',
            ],
            expectedQuery: 'SELECT survey_id, AVG(rating) FROM survey_responses GROUP BY survey_id ORDER BY AVG(rating) DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 1 },
        },
    ],
};
