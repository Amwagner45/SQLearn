import type { Lesson } from '../../types/curriculum';

export const lesson08: Lesson = {
    id: 'having',
    title: 'HAVING — Filtering Groups',
    module: 'sql',
    order: 8,
    prerequisites: ['group-by'],
    content: `# HAVING — Filtering Groups

\`WHERE\` filters individual rows *before* grouping. But what if you want to filter *after* grouping? That's what \`HAVING\` does.

## The Problem

Say you want states with more than 20 customers. You can't use \`WHERE COUNT(*) > 20\` because \`WHERE\` runs before grouping.

## Syntax

\`\`\`sql
SELECT group_column, AGGREGATE(column)
FROM table_name
GROUP BY group_column
HAVING condition_on_aggregate;
\`\`\`

## Examples

\`\`\`sql
-- States with more than 20 customers
SELECT state, COUNT(*) AS customer_count
FROM customers
GROUP BY state
HAVING COUNT(*) > 20
ORDER BY customer_count DESC;

-- Campaign types with total budget over $50,000
SELECT campaign_type, SUM(budget) AS total_budget
FROM campaigns
GROUP BY campaign_type
HAVING SUM(budget) > 50000;

-- Surveys with average rating below 3
SELECT survey_id, AVG(rating) AS avg_rating
FROM survey_responses
GROUP BY survey_id
HAVING AVG(rating) < 3;
\`\`\`

## WHERE vs HAVING

| | WHERE | HAVING |
|---|-------|--------|
| **When** | Before GROUP BY | After GROUP BY |
| **Filters** | Individual rows | Groups |
| **Can use aggregates?** | No | Yes |

You can use both in the same query:

\`\`\`sql
-- For customers under 40, find states with more than 5 such customers
SELECT state, COUNT(*) AS young_count
FROM customers
WHERE age < 40
GROUP BY state
HAVING COUNT(*) > 5
ORDER BY young_count DESC;
\`\`\`

## Query Execution Order

Understanding the order SQL processes clauses helps:

1. \`FROM\` — pick the table
2. \`WHERE\` — filter rows
3. \`GROUP BY\` — group remaining rows
4. \`HAVING\` — filter groups
5. \`SELECT\` — pick columns
6. \`ORDER BY\` — sort results
7. \`LIMIT\` — limit output

## Key Takeaways

- \`HAVING\` filters groups (after GROUP BY)
- \`WHERE\` filters rows (before GROUP BY)
- Use \`HAVING\` with aggregate conditions like \`COUNT(*) > 10\`
- You can combine \`WHERE\` and \`HAVING\` in the same query
`,
    questions: [
        {
            id: 'q1-having-count',
            prompt: 'Find acquisition channels that have more than 150 customers. Show the channel and customer count, sorted by count descending.',
            hints: [
                'GROUP BY acquisition_channel, then use HAVING COUNT(*) > 150',
                'SELECT acquisition_channel, COUNT(*) FROM customers GROUP BY acquisition_channel HAVING COUNT(*) > 150',
                'Add ORDER BY COUNT(*) DESC at the end',
            ],
            expectedQuery: 'SELECT acquisition_channel, COUNT(*) AS customer_count FROM customers GROUP BY acquisition_channel HAVING COUNT(*) > 150 ORDER BY customer_count DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-having-sum',
            prompt: 'Find campaign channels (from the campaigns table) where the total budget exceeds $30,000. Show channel and total budget.',
            hints: [
                'GROUP BY channel and use SUM(budget)',
                'Add HAVING SUM(budget) > 30000',
                'SELECT channel, SUM(budget) FROM campaigns GROUP BY channel HAVING SUM(budget) > 30000',
            ],
            expectedQuery: 'SELECT channel, SUM(budget) FROM campaigns GROUP BY channel HAVING SUM(budget) > 30000',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 0 },
        },
        {
            id: 'q3-where-and-having',
            prompt: 'Among purchase responses only (response_type = \'purchase\'), find campaigns (by campaign_id) that generated more than $500 in total revenue. Show campaign_id and total revenue, sorted by revenue descending.',
            hints: [
                'Use WHERE response_type = \'purchase\' to filter first, then GROUP BY campaign_id',
                'Add HAVING SUM(revenue_generated) > 500',
                'SELECT campaign_id, SUM(revenue_generated) FROM campaign_responses WHERE response_type = \'purchase\' GROUP BY campaign_id HAVING SUM(revenue_generated) > 500 ORDER BY SUM(revenue_generated) DESC',
            ],
            expectedQuery: "SELECT campaign_id, SUM(revenue_generated) FROM campaign_responses WHERE response_type = 'purchase' GROUP BY campaign_id HAVING SUM(revenue_generated) > 500 ORDER BY SUM(revenue_generated) DESC",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 0 },
        },
    ],
};
