import type { Lesson } from '../../types/curriculum';

export const lesson20: Lesson = {
    id: 'capstone',
    title: 'Capstone: Marketing Analysis',
    module: 'sql',
    order: 20,
    prerequisites: ['null-coalesce'],
    content: `# Capstone: Marketing Analysis

Congratulations on making it to the capstone! 🎉

In this final lesson, you'll combine everything you've learned to answer real business questions about our marketing dataset.

## The Scenario

You're a data analyst at a marketing company. Your manager needs insights from the database to make strategic decisions. Each question represents a real request you might get on the job.

## Tips for Complex Queries

1. **Break it down** — Write simpler parts first, then combine
2. **Test pieces** — Run subqueries or JOINs alone to verify intermediate results
3. **Use aliases** — Give tables and columns short, meaningful names
4. **Check your work** — Compare row counts and values to make sure results make sense

## What You'll Need

These questions may require combining:
- JOINs across multiple tables
- Aggregation (GROUP BY, HAVING)
- Subqueries or CTEs
- CASE expressions
- String functions
- Window functions

Good luck!
`,
    questions: [
        {
            id: 'q1-capstone-top-customers',
            prompt: 'Find the top 10 customers by total revenue generated from purchases. Show their full name (first_name || \' \' || last_name), total revenue, and number of purchases. Sort by total revenue descending.',
            hints: [
                'Join customers with campaign_responses WHERE response_type = \'purchase\'',
                'GROUP BY customer, use SUM(revenue_generated) and COUNT(*)',
                'SELECT c.first_name || \' \' || c.last_name AS full_name, SUM(cr.revenue_generated) AS total_revenue, COUNT(*) AS purchases FROM customers c INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id WHERE cr.response_type = \'purchase\' GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_revenue DESC LIMIT 10',
            ],
            expectedQuery: "SELECT c.first_name || ' ' || c.last_name AS full_name, SUM(cr.revenue_generated) AS total_revenue, COUNT(*) AS purchases FROM customers c INNER JOIN campaign_responses cr ON c.customer_id = cr.customer_id WHERE cr.response_type = 'purchase' GROUP BY c.customer_id, c.first_name, c.last_name ORDER BY total_revenue DESC LIMIT 10",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 0 },
        },
        {
            id: 'q2-capstone-campaign-roi',
            prompt: 'Calculate each campaign\'s ROI: (total_revenue - budget) / budget * 100. Show campaign_name, budget, total_revenue (from purchases), and roi. Only include campaigns with at least one purchase. Sort by ROI descending. Limit 10.',
            hints: [
                'Join campaigns to campaign_responses, filter purchases, GROUP BY campaign',
                'Use (SUM(cr.revenue_generated) - camp.budget) / camp.budget * 100 AS roi',
                'SELECT camp.campaign_name, camp.budget, SUM(cr.revenue_generated) AS total_revenue, ROUND((SUM(cr.revenue_generated) - camp.budget) / camp.budget * 100, 2) AS roi FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id WHERE cr.response_type = \'purchase\' GROUP BY camp.campaign_id, camp.campaign_name, camp.budget ORDER BY roi DESC LIMIT 10',
            ],
            expectedQuery: "SELECT camp.campaign_name, camp.budget, SUM(cr.revenue_generated) AS total_revenue, ROUND((SUM(cr.revenue_generated) - camp.budget) / camp.budget * 100, 2) AS roi FROM campaigns camp INNER JOIN campaign_responses cr ON camp.campaign_id = cr.campaign_id WHERE cr.response_type = 'purchase' GROUP BY camp.campaign_id, camp.campaign_name, camp.budget ORDER BY roi DESC LIMIT 10",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 1 },
        },
        {
            id: 'q3-capstone-nps',
            prompt: 'Calculate the Net Promoter Score for each survey. NPS = (% Promoters - % Detractors). A Promoter has nps_score >= 9, Detractor has nps_score <= 6. Show survey_name and the calculated NPS rounded to 1 decimal place. Sort by NPS descending.',
            hints: [
                'Join surveys with survey_responses, GROUP BY survey',
                'Use CASE WHEN to count promoters and detractors, divide by total * 100',
                'SELECT s.survey_name, ROUND(SUM(CASE WHEN sr.nps_score >= 9 THEN 1.0 ELSE 0 END) * 100.0 / COUNT(*) - SUM(CASE WHEN sr.nps_score <= 6 THEN 1.0 ELSE 0 END) * 100.0 / COUNT(*), 1) AS nps FROM surveys s INNER JOIN survey_responses sr ON s.survey_id = sr.survey_id GROUP BY s.survey_id, s.survey_name ORDER BY nps DESC',
            ],
            expectedQuery: "SELECT s.survey_name, ROUND(SUM(CASE WHEN sr.nps_score >= 9 THEN 1.0 ELSE 0 END) * 100.0 / COUNT(*) - SUM(CASE WHEN sr.nps_score <= 6 THEN 1.0 ELSE 0 END) * 100.0 / COUNT(*), 1) AS nps FROM surveys s INNER JOIN survey_responses sr ON s.survey_id = sr.survey_id GROUP BY s.survey_id, s.survey_name ORDER BY nps DESC",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 0 },
        },
    ],
};
