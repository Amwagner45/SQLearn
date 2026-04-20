import type { Lesson } from '../../types/curriculum';

export const lesson11: Lesson = {
    id: 'subqueries',
    title: 'Subqueries',
    module: 'sql',
    order: 11,
    prerequisites: ['left-right-join'],
    content: `# Subqueries

A subquery is a query inside another query. It lets you use the result of one query as input to another.

## Subquery in WHERE

\`\`\`sql
-- Customers who responded to campaign #1
SELECT first_name, last_name
FROM customers
WHERE customer_id IN (
  SELECT customer_id FROM campaign_responses WHERE campaign_id = 1
);
\`\`\`

## Scalar Subqueries

A subquery that returns a single value:

\`\`\`sql
-- Customers older than the average age
SELECT first_name, last_name, age
FROM customers
WHERE age > (SELECT AVG(age) FROM customers);
\`\`\`

## Subquery in FROM (Derived Tables)

\`\`\`sql
-- Top states by customer count, then filter
SELECT *
FROM (
  SELECT state, COUNT(*) AS cnt
  FROM customers
  GROUP BY state
) AS state_counts
WHERE cnt > 20
ORDER BY cnt DESC;
\`\`\`

## EXISTS

\`EXISTS\` checks if a subquery returns any rows:

\`\`\`sql
-- Customers who have at least one purchase
SELECT c.first_name, c.last_name
FROM customers c
WHERE EXISTS (
  SELECT 1 FROM campaign_responses cr
  WHERE cr.customer_id = c.customer_id
  AND cr.response_type = 'purchase'
);
\`\`\`

## Key Takeaways

- Subqueries go in parentheses
- Use \`IN\` for subqueries returning a list of values
- Use comparison operators for scalar subqueries (single value)
- \`EXISTS\` checks if matching rows exist (very efficient)
- Subqueries in FROM create "derived tables" (need an alias)
`,
    questions: [
        {
            id: 'q1-subquery-in',
            prompt: 'Find the names of customers who have made at least one purchase (response_type = \'purchase\' in campaign_responses). Show first_name and last_name using a subquery with IN.',
            hints: [
                'Write a subquery: SELECT customer_id FROM campaign_responses WHERE response_type = \'purchase\'',
                'Use this in WHERE customer_id IN (...)',
                'SELECT first_name, last_name FROM customers WHERE customer_id IN (SELECT customer_id FROM campaign_responses WHERE response_type = \'purchase\')',
            ],
            expectedQuery: "SELECT first_name, last_name FROM customers WHERE customer_id IN (SELECT customer_id FROM campaign_responses WHERE response_type = 'purchase')",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-subquery-scalar',
            prompt: 'Find all campaigns with a budget higher than the average budget. Show campaign_name and budget, sorted by budget descending.',
            hints: [
                'The subquery is: SELECT AVG(budget) FROM campaigns',
                'WHERE budget > (subquery)',
                'SELECT campaign_name, budget FROM campaigns WHERE budget > (SELECT AVG(budget) FROM campaigns) ORDER BY budget DESC',
            ],
            expectedQuery: 'SELECT campaign_name, budget FROM campaigns WHERE budget > (SELECT AVG(budget) FROM campaigns) ORDER BY budget DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q3-subquery-exists',
            prompt: 'Using EXISTS, find customers who have completed at least one survey response. Show first_name, last_name, and email.',
            hints: [
                'Use WHERE EXISTS with a correlated subquery on survey_responses',
                'The subquery should match on customer_id: WHERE sr.customer_id = c.customer_id',
                'SELECT c.first_name, c.last_name, c.email FROM customers c WHERE EXISTS (SELECT 1 FROM survey_responses sr WHERE sr.customer_id = c.customer_id)',
            ],
            expectedQuery: 'SELECT c.first_name, c.last_name, c.email FROM customers c WHERE EXISTS (SELECT 1 FROM survey_responses sr WHERE sr.customer_id = c.customer_id)',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
