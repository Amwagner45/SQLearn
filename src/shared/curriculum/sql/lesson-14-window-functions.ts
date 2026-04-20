import type { Lesson } from '../../types/curriculum';

export const lesson14: Lesson = {
    id: 'window-functions',
    title: 'Window Functions',
    module: 'sql',
    order: 14,
    prerequisites: ['ctes'],
    content: `# Window Functions

Window functions perform calculations across a set of rows that are related to the current row — without collapsing them into a single row like GROUP BY does.

## Syntax

\`\`\`sql
FUNCTION() OVER (
  PARTITION BY column
  ORDER BY column
)
\`\`\`

## ROW_NUMBER

Assigns a unique sequential number to each row:

\`\`\`sql
SELECT
  first_name,
  last_name,
  state,
  age,
  ROW_NUMBER() OVER (ORDER BY age DESC) AS rank
FROM customers
LIMIT 10;
\`\`\`

## PARTITION BY

Like GROUP BY, but keeps all rows:

\`\`\`sql
-- Rank customers by age within each state
SELECT
  first_name,
  state,
  age,
  ROW_NUMBER() OVER (PARTITION BY state ORDER BY age DESC) AS state_rank
FROM customers
LIMIT 20;
\`\`\`

## RANK and DENSE_RANK

- \`ROW_NUMBER()\` — always unique (1, 2, 3, 4...)
- \`RANK()\` — ties get same rank, gaps after (1, 2, 2, 4...)
- \`DENSE_RANK()\` — ties get same rank, no gaps (1, 2, 2, 3...)

## Running Totals with SUM

\`\`\`sql
SELECT
  campaign_id,
  response_date,
  revenue_generated,
  SUM(revenue_generated) OVER (
    PARTITION BY campaign_id
    ORDER BY response_date
  ) AS running_total
FROM campaign_responses
WHERE response_type = 'purchase'
LIMIT 20;
\`\`\`

## LAG and LEAD

Access previous/next rows:

\`\`\`sql
-- Compare each campaign's budget to the previous one
SELECT
  campaign_name,
  budget,
  LAG(budget) OVER (ORDER BY budget) AS prev_budget,
  budget - LAG(budget) OVER (ORDER BY budget) AS diff
FROM campaigns
LIMIT 15;
\`\`\`

## Key Takeaways

- Window functions calculate across related rows without collapsing them
- \`OVER()\` defines the window
- \`PARTITION BY\` groups rows within the window
- \`ORDER BY\` within OVER defines the row order
- ROW_NUMBER, RANK, DENSE_RANK for ranking
- SUM/AVG OVER for running totals/averages
- LAG/LEAD for accessing adjacent rows
`,
    questions: [
        {
            id: 'q1-row-number',
            prompt: 'Rank all customers by age (oldest first) using ROW_NUMBER. Show first_name, last_name, age, and the rank. Limit to 15 rows.',
            hints: [
                'Use ROW_NUMBER() OVER (ORDER BY age DESC)',
                'This goes in the SELECT as a new column',
                'SELECT first_name, last_name, age, ROW_NUMBER() OVER (ORDER BY age DESC) AS rank FROM customers LIMIT 15',
            ],
            expectedQuery: 'SELECT first_name, last_name, age, ROW_NUMBER() OVER (ORDER BY age DESC) AS rank FROM customers LIMIT 15',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-partition-rank',
            prompt: 'Rank campaigns by budget within each campaign_type (highest budget first). Show campaign_name, campaign_type, budget, and the rank within type. Sort by campaign_type, then rank.',
            hints: [
                'Use RANK() OVER (PARTITION BY campaign_type ORDER BY budget DESC)',
                'Add ORDER BY campaign_type, rank to the outer query',
                'SELECT campaign_name, campaign_type, budget, RANK() OVER (PARTITION BY campaign_type ORDER BY budget DESC) AS type_rank FROM campaigns ORDER BY campaign_type, type_rank',
            ],
            expectedQuery: 'SELECT campaign_name, campaign_type, budget, RANK() OVER (PARTITION BY campaign_type ORDER BY budget DESC) AS type_rank FROM campaigns ORDER BY campaign_type, type_rank',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
