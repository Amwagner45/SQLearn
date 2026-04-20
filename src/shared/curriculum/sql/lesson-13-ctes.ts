import type { Lesson } from '../../types/curriculum';

export const lesson13: Lesson = {
    id: 'ctes',
    title: 'Common Table Expressions (CTEs)',
    module: 'sql',
    order: 13,
    prerequisites: ['case-expressions'],
    content: `# Common Table Expressions (CTEs)

CTEs (using the \`WITH\` keyword) let you define temporary named result sets that you can reference in your main query. They make complex queries more readable.

## Syntax

\`\`\`sql
WITH cte_name AS (
  SELECT ...
)
SELECT ...
FROM cte_name;
\`\`\`

## Example: Campaign Performance

\`\`\`sql
WITH campaign_revenue AS (
  SELECT
    campaign_id,
    COUNT(*) AS total_responses,
    SUM(revenue_generated) AS total_revenue
  FROM campaign_responses
  GROUP BY campaign_id
)
SELECT
  c.campaign_name,
  cr.total_responses,
  cr.total_revenue
FROM campaigns c
INNER JOIN campaign_revenue cr ON c.campaign_id = cr.campaign_id
ORDER BY cr.total_revenue DESC;
\`\`\`

## Multiple CTEs

\`\`\`sql
WITH customer_purchases AS (
  SELECT customer_id, SUM(revenue_generated) AS total_spent
  FROM campaign_responses
  WHERE response_type = 'purchase'
  GROUP BY customer_id
),
high_spenders AS (
  SELECT customer_id, total_spent
  FROM customer_purchases
  WHERE total_spent > 200
)
SELECT c.first_name, c.last_name, hs.total_spent
FROM high_spenders hs
INNER JOIN customers c ON hs.customer_id = c.customer_id
ORDER BY hs.total_spent DESC;
\`\`\`

## CTE vs Subquery

CTEs and subqueries can often solve the same problem, but CTEs are:
- **More readable** — give meaningful names to intermediate steps
- **Reusable** — reference the same CTE multiple times
- **Self-documenting** — each CTE is a named logical step

## Key Takeaways

- CTEs start with \`WITH name AS (...)\`
- Multiple CTEs are separated by commas
- CTEs make complex queries readable by breaking them into steps
- The CTE only exists for the duration of the query
`,
    questions: [
        {
            id: 'q1-cte-basic',
            prompt: 'Using a CTE, first calculate the total revenue per campaign_id from campaign_responses, then join with campaigns to show campaign_name and total_revenue. Sort by total_revenue descending.',
            hints: [
                'WITH revenue AS (SELECT campaign_id, SUM(revenue_generated) AS total_revenue FROM campaign_responses GROUP BY campaign_id)',
                'Then join: SELECT c.campaign_name, r.total_revenue FROM campaigns c INNER JOIN revenue r ON c.campaign_id = r.campaign_id',
                'Full query: WITH revenue AS (SELECT campaign_id, SUM(revenue_generated) AS total_revenue FROM campaign_responses GROUP BY campaign_id) SELECT c.campaign_name, r.total_revenue FROM campaigns c INNER JOIN revenue r ON c.campaign_id = r.campaign_id ORDER BY r.total_revenue DESC',
            ],
            expectedQuery: 'WITH revenue AS (SELECT campaign_id, SUM(revenue_generated) AS total_revenue FROM campaign_responses GROUP BY campaign_id) SELECT c.campaign_name, r.total_revenue FROM campaigns c INNER JOIN revenue r ON c.campaign_id = r.campaign_id ORDER BY r.total_revenue DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 0 },
        },
        {
            id: 'q2-cte-filter',
            prompt: 'Using a CTE, find the average rating per survey_id from survey_responses. Then show only surveys with an average rating above 3, joined with the surveys table to show survey_name and avg_rating. Sort by avg_rating descending.',
            hints: [
                'CTE: SELECT survey_id, AVG(rating) AS avg_rating FROM survey_responses GROUP BY survey_id',
                'Main query: JOIN with surveys, add WHERE avg_rating > 3',
                'WITH avg_ratings AS (SELECT survey_id, AVG(rating) AS avg_rating FROM survey_responses GROUP BY survey_id) SELECT s.survey_name, ar.avg_rating FROM surveys s INNER JOIN avg_ratings ar ON s.survey_id = ar.survey_id WHERE ar.avg_rating > 3 ORDER BY ar.avg_rating DESC',
            ],
            expectedQuery: 'WITH avg_ratings AS (SELECT survey_id, AVG(rating) AS avg_rating FROM survey_responses GROUP BY survey_id) SELECT s.survey_name, ar.avg_rating FROM surveys s INNER JOIN avg_ratings ar ON s.survey_id = ar.survey_id WHERE ar.avg_rating > 3 ORDER BY ar.avg_rating DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 1 },
        },
    ],
};
