import type { Lesson } from '../../types/curriculum';

export const lesson09: Lesson = {
    id: 'inner-join',
    title: 'INNER JOIN — Combining Tables',
    module: 'sql',
    order: 9,
    prerequisites: ['having'],
    content: `# INNER JOIN — Combining Tables

Real-world data lives across multiple tables. \`JOIN\` lets you combine rows from different tables based on a related column. This is one of the most important SQL concepts!

## Why JOINs?

Our database has customers in one table and their campaign responses in another. To see a customer's name alongside their responses, we need to JOIN these tables.

## INNER JOIN Syntax

\`\`\`sql
SELECT columns
FROM table1
INNER JOIN table2
  ON table1.column = table2.column;
\`\`\`

\`INNER JOIN\` returns only rows that have matching values in **both** tables.

## Example: Customers + Campaign Responses

\`\`\`sql
SELECT
  c.first_name,
  c.last_name,
  cr.response_type,
  cr.revenue_generated
FROM customers c
INNER JOIN campaign_responses cr
  ON c.customer_id = cr.customer_id
LIMIT 10;
\`\`\`

> **Table Aliases:** \`customers c\` creates alias \`c\`, so you can write \`c.first_name\` instead of \`customers.first_name\`.

## Example: Campaigns + Responses

\`\`\`sql
SELECT
  camp.campaign_name,
  cr.response_type,
  cr.revenue_generated,
  cr.device_type
FROM campaigns camp
INNER JOIN campaign_responses cr
  ON camp.campaign_id = cr.campaign_id
LIMIT 15;
\`\`\`

## JOINs with Aggregates

JOINs become very powerful with GROUP BY:

\`\`\`sql
-- Total revenue per campaign (showing campaign names)
SELECT
  camp.campaign_name,
  SUM(cr.revenue_generated) AS total_revenue
FROM campaigns camp
INNER JOIN campaign_responses cr
  ON camp.campaign_id = cr.campaign_id
GROUP BY camp.campaign_name
ORDER BY total_revenue DESC;
\`\`\`

## JOINs with WHERE

\`\`\`sql
-- Purchases only, with customer names
SELECT
  c.first_name,
  c.last_name,
  cr.revenue_generated
FROM customers c
INNER JOIN campaign_responses cr
  ON c.customer_id = cr.customer_id
WHERE cr.response_type = 'purchase'
LIMIT 20;
\`\`\`

## Using USING

When the join column has the same name in both tables, you can use \`USING\`:

\`\`\`sql
SELECT camp.campaign_name, cr.response_type
FROM campaigns camp
INNER JOIN campaign_responses cr USING (campaign_id)
LIMIT 10;
\`\`\`

## Key Takeaways

- \`INNER JOIN\` combines rows from two tables where the join condition matches
- Use \`ON\` to specify which columns to match
- Table aliases (\`c\`, \`cr\`) make queries shorter and more readable
- Only matching rows appear (non-matching rows are excluded)
- Combine with \`WHERE\`, \`GROUP BY\`, \`ORDER BY\` as needed
`,
    questions: [
        {
            id: 'q1-basic-join',
            prompt: 'Join customers with campaign_responses to show each customer\'s first_name, last_name, and response_type. Limit to 15 rows.',
            hints: [
                'JOIN on customer_id which exists in both tables',
                'FROM customers INNER JOIN campaign_responses ON customers.customer_id = campaign_responses.customer_id',
                'SELECT c.first_name, c.last_name, cr.response_type FROM customers c INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id LIMIT 15',
            ],
            expectedQuery: 'SELECT c.first_name, c.last_name, cr.response_type FROM customers c INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id LIMIT 15',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-join-aggregate',
            prompt: 'Find the total revenue generated for each campaign name. Show campaign_name and total revenue, sorted by revenue descending.',
            hints: [
                'JOIN campaigns with campaign_responses on campaign_id',
                'Use SUM(revenue_generated) and GROUP BY campaign_name',
                'SELECT camp.campaign_name, SUM(cr.revenue_generated) FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id GROUP BY camp.campaign_name ORDER BY SUM(cr.revenue_generated) DESC',
            ],
            expectedQuery: 'SELECT camp.campaign_name, SUM(cr.revenue_generated) FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id GROUP BY camp.campaign_name ORDER BY SUM(cr.revenue_generated) DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 0 },
        },
        {
            id: 'q3-join-where',
            prompt: 'Find the number of purchase responses per campaign name. Only include purchase responses (response_type = \'purchase\'). Show campaign_name and count, sorted by count descending.',
            hints: [
                'JOIN campaigns with campaign_responses, add WHERE response_type = \'purchase\'',
                'GROUP BY campaign_name, use COUNT(*)',
                'SELECT camp.campaign_name, COUNT(*) FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id WHERE cr.response_type = \'purchase\' GROUP BY camp.campaign_name ORDER BY COUNT(*) DESC',
            ],
            expectedQuery: "SELECT camp.campaign_name, COUNT(*) FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id WHERE cr.response_type = 'purchase' GROUP BY camp.campaign_name ORDER BY COUNT(*) DESC",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
