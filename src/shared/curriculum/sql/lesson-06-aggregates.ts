import type { Lesson } from '../../types/curriculum';

export const lesson06: Lesson = {
    id: 'aggregate-functions',
    title: 'Aggregate Functions',
    module: 'sql',
    order: 6,
    prerequisites: ['distinct-values'],
    content: `# Aggregate Functions

Aggregate functions perform calculations across multiple rows and return a single result. They're essential for summarizing data.

## The Five Core Aggregates

| Function | Description | Example |
|----------|-------------|---------|
| \`COUNT()\` | Counts rows | How many customers? |
| \`SUM()\` | Adds up values | Total revenue? |
| \`AVG()\` | Calculates average | Average age? |
| \`MIN()\` | Finds minimum | Youngest customer? |
| \`MAX()\` | Finds maximum | Highest budget? |

## COUNT

\`\`\`sql
-- Count all customers
SELECT COUNT(*) AS total_customers FROM customers;

-- Count customers from Texas
SELECT COUNT(*) AS texas_customers
FROM customers
WHERE state = 'Texas';

-- Count non-null response texts
SELECT COUNT(response_text) AS responses_with_text
FROM survey_responses;
\`\`\`

> **Note:** \`COUNT(*)\` counts all rows. \`COUNT(column)\` counts non-NULL values in that column.

## SUM

\`\`\`sql
-- Total revenue from all campaign responses
SELECT SUM(revenue_generated) AS total_revenue
FROM campaign_responses;

-- Total budget across all campaigns
SELECT SUM(budget) AS total_budget
FROM campaigns;
\`\`\`

## AVG

\`\`\`sql
-- Average customer age
SELECT AVG(age) AS avg_age FROM customers;

-- Average campaign budget
SELECT AVG(budget) AS avg_budget FROM campaigns;
\`\`\`

## MIN and MAX

\`\`\`sql
-- Youngest and oldest customer ages
SELECT MIN(age) AS youngest, MAX(age) AS oldest
FROM customers;

-- Cheapest and most expensive product
SELECT MIN(price) AS cheapest, MAX(price) AS most_expensive
FROM products;
\`\`\`

## Combining Aggregates

You can use multiple aggregates in one query:

\`\`\`sql
SELECT
  COUNT(*) AS total_campaigns,
  SUM(budget) AS total_budget,
  AVG(budget) AS avg_budget,
  MIN(budget) AS min_budget,
  MAX(budget) AS max_budget
FROM campaigns;
\`\`\`

## Key Takeaways

- \`COUNT(*)\` counts all rows; \`COUNT(column)\` counts non-NULL values
- \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` work on numeric columns
- Aggregates return a single row
- Combine with \`WHERE\` to aggregate filtered data
- Use \`AS\` to name your aggregate columns
`,
    questions: [
        {
            id: 'q1-count-customers',
            prompt: 'Count the total number of customers in the customers table.',
            hints: [
                'Use the COUNT(*) function',
                'SELECT COUNT(*) FROM customers',
                'You can add AS total_customers for a nice column name',
            ],
            expectedQuery: 'SELECT COUNT(*) FROM customers',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-sum-revenue',
            prompt: 'Find the total revenue generated from all campaign responses.',
            hints: [
                'Use SUM() on the revenue_generated column',
                'The table is campaign_responses',
                'SELECT SUM(revenue_generated) FROM campaign_responses',
            ],
            expectedQuery: 'SELECT SUM(revenue_generated) FROM campaign_responses',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 0 },
        },
        {
            id: 'q3-multiple-aggs',
            prompt: 'Find the average, minimum, and maximum price from the products table.',
            hints: [
                'Use AVG(price), MIN(price), and MAX(price)',
                'All three go in one SELECT statement',
                'SELECT AVG(price), MIN(price), MAX(price) FROM products',
            ],
            expectedQuery: 'SELECT AVG(price), MIN(price), MAX(price) FROM products',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
