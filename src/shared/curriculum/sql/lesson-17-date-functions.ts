import type { Lesson } from '../../types/curriculum';

export const lesson17: Lesson = {
    id: 'date-functions',
    title: 'Working with Dates',
    module: 'sql',
    order: 17,
    prerequisites: ['multiple-joins'],
    content: `# Working with Dates in SQLite

In our database, dates are stored as text in \`'YYYY-MM-DD'\` format. SQLite provides functions to work with these date strings.

## Extracting Date Parts

Use \`strftime()\` to extract parts of a date:

\`\`\`sql
SELECT
  signup_date,
  strftime('%Y', signup_date) AS year,
  strftime('%m', signup_date) AS month,
  strftime('%d', signup_date) AS day
FROM customers
LIMIT 10;
\`\`\`

Common format codes:
- \`%Y\` — 4-digit year (2024)
- \`%m\` — month (01-12)
- \`%d\` — day (01-31)
- \`%w\` — day of week (0=Sunday)

## Filtering by Date

Since dates are stored as \`'YYYY-MM-DD'\` text, comparisons work naturally:

\`\`\`sql
-- Customers who signed up in 2024
SELECT first_name, last_name, signup_date
FROM customers
WHERE signup_date >= '2024-01-01'
  AND signup_date < '2025-01-01'
LIMIT 15;
\`\`\`

## Using SUBSTR for Year/Month

Since dates are formatted consistently, you can also use SUBSTR:

\`\`\`sql
-- Extract signup year using SUBSTR
SELECT
  SUBSTR(signup_date, 1, 4) AS signup_year,
  COUNT(*) AS customer_count
FROM customers
GROUP BY signup_year
ORDER BY signup_year;
\`\`\`

## Grouping by Date Parts

\`\`\`sql
-- Signups per month
SELECT
  strftime('%Y-%m', signup_date) AS month,
  COUNT(*) AS signups
FROM customers
GROUP BY month
ORDER BY month;
\`\`\`

## Date Calculations

\`\`\`sql
-- Campaign duration in days
SELECT
  campaign_name,
  start_date,
  end_date,
  CAST(julianday(end_date) - julianday(start_date) AS INTEGER) AS duration_days
FROM campaigns
ORDER BY duration_days DESC
LIMIT 10;
\`\`\`

## Key Takeaways

- Dates are stored as text (\`'YYYY-MM-DD'\`) in SQLite
- \`strftime()\` extracts year, month, day etc.
- Date comparisons work with \`>\`, \`<\`, \`BETWEEN\` since the format sorts correctly
- \`julianday()\` for date arithmetic
- \`SUBSTR()\` is a quick alternative for extracting year/month
`,
    questions: [
        {
            id: 'q1-date-year-count',
            prompt: 'Count how many customers signed up each year. Show the year and customer count, sorted by year.',
            hints: [
                'Use strftime(\'%Y\', signup_date) or SUBSTR(signup_date, 1, 4) to get the year',
                'GROUP BY the year expression, COUNT(*)',
                'SELECT strftime(\'%Y\', signup_date) AS year, COUNT(*) AS count FROM customers GROUP BY year ORDER BY year',
            ],
            expectedQuery: "SELECT strftime('%Y', signup_date) AS year, COUNT(*) AS count FROM customers GROUP BY year ORDER BY year",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-date-filter',
            prompt: 'Find all campaigns that started in 2024. Show campaign_name, start_date, and budget. Sort by start_date.',
            hints: [
                'Filter using start_date >= \'2024-01-01\' AND start_date < \'2025-01-01\'',
                'Or use strftime(\'%Y\', start_date) = \'2024\'',
                'SELECT campaign_name, start_date, budget FROM campaigns WHERE start_date >= \'2024-01-01\' AND start_date < \'2025-01-01\' ORDER BY start_date',
            ],
            expectedQuery: "SELECT campaign_name, start_date, budget FROM campaigns WHERE start_date >= '2024-01-01' AND start_date < '2025-01-01' ORDER BY start_date",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
