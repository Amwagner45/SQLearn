import type { Lesson } from '../../types/curriculum';

export const lesson12: Lesson = {
    id: 'case-expressions',
    title: 'CASE Expressions',
    module: 'sql',
    order: 12,
    prerequisites: ['subqueries'],
    content: `# CASE Expressions

\`CASE\` lets you add conditional (if/then) logic to your SQL queries. It's like an IF statement that you can use anywhere in a query.

## Syntax

\`\`\`sql
CASE
  WHEN condition1 THEN result1
  WHEN condition2 THEN result2
  ELSE default_result
END
\`\`\`

## Categorizing Data

\`\`\`sql
-- Categorize customers by age group
SELECT
  first_name,
  last_name,
  age,
  CASE
    WHEN age < 25 THEN 'Young Adult'
    WHEN age BETWEEN 25 AND 40 THEN 'Adult'
    WHEN age BETWEEN 41 AND 60 THEN 'Middle Aged'
    ELSE 'Senior'
  END AS age_group
FROM customers
LIMIT 20;
\`\`\`

## CASE with Aggregates

A very powerful pattern — conditional counting/summing:

\`\`\`sql
-- Count responses by type for each campaign
SELECT
  campaign_id,
  COUNT(CASE WHEN response_type = 'purchase' THEN 1 END) AS purchases,
  COUNT(CASE WHEN response_type = 'click' THEN 1 END) AS clicks,
  COUNT(CASE WHEN response_type = 'open' THEN 1 END) AS opens
FROM campaign_responses
GROUP BY campaign_id
LIMIT 10;
\`\`\`

## NPS Score Classification

Net Promoter Score classifies respondents:

\`\`\`sql
SELECT
  CASE
    WHEN nps_score >= 9 THEN 'Promoter'
    WHEN nps_score >= 7 THEN 'Passive'
    ELSE 'Detractor'
  END AS nps_category,
  COUNT(*) AS count
FROM survey_responses
GROUP BY nps_category
ORDER BY count DESC;
\`\`\`

## Key Takeaways

- \`CASE\` adds if/then logic to SQL
- Always end with \`END\`
- Use \`ELSE\` for a default (otherwise NULL)
- Combine with aggregates for conditional counting
- Alias the CASE expression with \`AS\`
`,
    questions: [
        {
            id: 'q1-case-age-group',
            prompt: 'Classify customers into age groups: \'Under 25\', \'25-40\', \'41-60\', \'Over 60\'. Count how many customers are in each group. Show the age_group and count, sorted by count descending.',
            hints: [
                'Use CASE WHEN age < 25 THEN \'Under 25\' WHEN age <= 40 THEN \'25-40\' etc.',
                'GROUP BY the CASE expression (or use an alias)',
                'SELECT CASE WHEN age < 25 THEN \'Under 25\' WHEN age <= 40 THEN \'25-40\' WHEN age <= 60 THEN \'41-60\' ELSE \'Over 60\' END AS age_group, COUNT(*) AS count FROM customers GROUP BY age_group ORDER BY count DESC',
            ],
            expectedQuery: "SELECT CASE WHEN age < 25 THEN 'Under 25' WHEN age <= 40 THEN '25-40' WHEN age <= 60 THEN '41-60' ELSE 'Over 60' END AS age_group, COUNT(*) AS count FROM customers GROUP BY age_group ORDER BY count DESC",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q2-case-nps',
            prompt: 'Classify survey responses by NPS: \'Promoter\' (9-10), \'Passive\' (7-8), \'Detractor\' (0-6). Count each category. Show nps_category and count.',
            hints: [
                'CASE WHEN nps_score >= 9 THEN \'Promoter\' WHEN nps_score >= 7 THEN \'Passive\' ELSE \'Detractor\' END',
                'GROUP BY the CASE expression',
                'SELECT CASE WHEN nps_score >= 9 THEN \'Promoter\' WHEN nps_score >= 7 THEN \'Passive\' ELSE \'Detractor\' END AS nps_category, COUNT(*) FROM survey_responses GROUP BY nps_category',
            ],
            expectedQuery: "SELECT CASE WHEN nps_score >= 9 THEN 'Promoter' WHEN nps_score >= 7 THEN 'Passive' ELSE 'Detractor' END AS nps_category, COUNT(*) FROM survey_responses GROUP BY nps_category",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
