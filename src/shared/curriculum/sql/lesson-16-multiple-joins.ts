import type { Lesson } from '../../types/curriculum';

export const lesson16: Lesson = {
    id: 'multiple-joins',
    title: 'Joining Multiple Tables',
    module: 'sql',
    order: 16,
    prerequisites: ['string-functions'],
    content: `# Joining Multiple Tables

Real-world queries often need data from 3 or more tables. You chain JOIN clauses one after another.

## Syntax

\`\`\`sql
SELECT ...
FROM table_a a
INNER JOIN table_b b ON a.id = b.a_id
INNER JOIN table_c c ON b.id = c.b_id;
\`\`\`

## Example: Customer → Response → Campaign

\`\`\`sql
-- Which customers purchased from which campaigns?
SELECT
  c.first_name,
  c.last_name,
  camp.campaign_name,
  cr.revenue_generated
FROM customers c
INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id
INNER JOIN campaigns camp ON cr.campaign_id = camp.campaign_id
WHERE cr.response_type = 'purchase'
LIMIT 20;
\`\`\`

## Mixing JOIN Types

\`\`\`sql
-- All customers, their campaign responses (if any), and campaign names
SELECT
  c.first_name,
  c.last_name,
  camp.campaign_name,
  cr.response_type
FROM customers c
LEFT JOIN campaign_responses cr ON c.customer_id = cr.customer_id
LEFT JOIN campaigns camp ON cr.campaign_id = camp.campaign_id
LIMIT 20;
\`\`\`

## Aggregating Across Joins

\`\`\`sql
-- Total revenue per customer across all campaigns
SELECT
  c.first_name,
  c.last_name,
  SUM(cr.revenue_generated) AS total_revenue,
  COUNT(cr.response_id) AS total_interactions
FROM customers c
INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY total_revenue DESC
LIMIT 15;
\`\`\`

## Key Takeaways

- Chain multiple JOINs to connect 3+ tables
- Each JOIN needs its own ON condition
- Use table aliases (a, b, c) for readability
- You can mix INNER JOIN and LEFT JOIN in one query
- GROUP BY and aggregates work across multi-table joins
`,
    questions: [
        {
            id: 'q1-three-table-join',
            prompt: 'Show customer first_name, last_name, campaign_name, and revenue_generated for all purchases (response_type = \'purchase\'). Join customers → campaign_responses → campaigns. Sort by revenue_generated descending, limit 15.',
            hints: [
                'Join customers to campaign_responses on customer_id, then campaign_responses to campaigns on campaign_id',
                'Add WHERE cr.response_type = \'purchase\' and ORDER BY cr.revenue_generated DESC LIMIT 15',
                'SELECT c.first_name, c.last_name, camp.campaign_name, cr.revenue_generated FROM customers c INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id INNER JOIN campaigns camp ON cr.campaign_id = camp.campaign_id WHERE cr.response_type = \'purchase\' ORDER BY cr.revenue_generated DESC LIMIT 15',
            ],
            expectedQuery: "SELECT c.first_name, c.last_name, camp.campaign_name, cr.revenue_generated FROM customers c INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id INNER JOIN campaigns camp ON cr.campaign_id = camp.campaign_id WHERE cr.response_type = 'purchase' ORDER BY cr.revenue_generated DESC LIMIT 15",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-multi-join-agg',
            prompt: 'Find each campaign_name with its total revenue (SUM of revenue_generated from campaign_responses where response_type = \'purchase\') and the number of purchases. Sort by total revenue descending. Limit 10.',
            hints: [
                'Join campaigns to campaign_responses, filter WHERE response_type = \'purchase\'',
                'GROUP BY campaign_name, use SUM and COUNT',
                'SELECT camp.campaign_name, SUM(cr.revenue_generated) AS total_revenue, COUNT(*) AS purchases FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id WHERE cr.response_type = \'purchase\' GROUP BY camp.campaign_name ORDER BY total_revenue DESC LIMIT 10',
            ],
            expectedQuery: "SELECT camp.campaign_name, SUM(cr.revenue_generated) AS total_revenue, COUNT(*) AS purchases FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id WHERE cr.response_type = 'purchase' GROUP BY camp.campaign_name ORDER BY total_revenue DESC LIMIT 10",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 0 },
        },
    ],
};
