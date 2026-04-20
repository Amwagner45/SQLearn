import type { Lesson } from '../../types/curriculum';

export const lesson03: Lesson = {
    id: 'where-clause',
    title: 'Filtering with WHERE',
    module: 'sql',
    order: 3,
    prerequisites: ['selecting-columns'],
    content: `# Filtering with WHERE

So far, you've retrieved all rows from a table. The \`WHERE\` clause lets you filter rows based on conditions — this is one of the most important SQL concepts.

## Basic Syntax

\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition;
\`\`\`

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`=\` | Equal to |
| \`!=\` or \`<>\` | Not equal to |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater than or equal to |
| \`<=\` | Less than or equal to |

### Examples

\`\`\`sql
-- Customers from California
SELECT first_name, last_name, state
FROM customers
WHERE state = 'California';

-- Campaigns with budget over $10,000
SELECT campaign_name, budget
FROM campaigns
WHERE budget > 10000;

-- Young customers (under 30)
SELECT first_name, last_name, age
FROM customers
WHERE age < 30;
\`\`\`

## Combining Conditions: AND & OR

Use \`AND\` when **all** conditions must be true:

\`\`\`sql
SELECT first_name, last_name, age, state
FROM customers
WHERE state = 'California' AND age >= 25;
\`\`\`

Use \`OR\` when **any** condition can be true:

\`\`\`sql
SELECT first_name, last_name, state
FROM customers
WHERE state = 'California' OR state = 'New York';
\`\`\`

## The IN Operator

Instead of multiple \`OR\` conditions, use \`IN\`:

\`\`\`sql
SELECT first_name, last_name, state
FROM customers
WHERE state IN ('California', 'New York', 'Texas');
\`\`\`

## The BETWEEN Operator

For ranges, use \`BETWEEN\`:

\`\`\`sql
SELECT first_name, last_name, age
FROM customers
WHERE age BETWEEN 25 AND 35;
\`\`\`

This is equivalent to \`age >= 25 AND age <= 35\`.

## NULL Values

To check for missing data, use \`IS NULL\` or \`IS NOT NULL\`:

\`\`\`sql
SELECT *
FROM survey_responses
WHERE response_text IS NULL;
\`\`\`

> **Important:** You cannot use \`= NULL\`. Always use \`IS NULL\`.

## Key Takeaways

- \`WHERE\` filters rows based on conditions
- Use comparison operators: \`=\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`
- Combine conditions with \`AND\` (all true) and \`OR\` (any true)
- Use \`IN\` for checking against a list of values
- Use \`BETWEEN\` for ranges
- Use \`IS NULL\` / \`IS NOT NULL\` for missing data
`,
    questions: [
        {
            id: 'q1-where-state',
            prompt: 'Find all customers from Texas. Select their first_name, last_name, and state.',
            hints: [
                'Use WHERE to filter by state',
                'The condition is: state = \'Texas\'',
                'SELECT first_name, last_name, state FROM customers WHERE state = \'Texas\'',
            ],
            expectedQuery: "SELECT first_name, last_name, state FROM customers WHERE state = 'Texas'",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-where-budget',
            prompt: 'Find all campaigns with a budget greater than $20,000. Select campaign_name and budget.',
            hints: [
                'Use WHERE with the > operator on the budget column',
                'WHERE budget > 20000',
                'SELECT campaign_name, budget FROM campaigns WHERE budget > 20000',
            ],
            expectedQuery: 'SELECT campaign_name, budget FROM campaigns WHERE budget > 20000',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q3-where-and',
            prompt: 'Find customers from California who are at least 30 years old. Select first_name, last_name, age, and state.',
            hints: [
                'You need two conditions combined with AND',
                'state = \'California\' AND age >= 30',
                'SELECT first_name, last_name, age, state FROM customers WHERE state = \'California\' AND age >= 30',
            ],
            expectedQuery: "SELECT first_name, last_name, age, state FROM customers WHERE state = 'California' AND age >= 30",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q4-where-in',
            prompt: 'Find all campaigns that are either "email" or "social" campaign types. Select campaign_name and campaign_type.',
            hints: [
                'Use the IN operator to check for multiple values',
                'WHERE campaign_type IN (\'email\', \'social\')',
                'SELECT campaign_name, campaign_type FROM campaigns WHERE campaign_type IN (\'email\', \'social\')',
            ],
            expectedQuery: "SELECT campaign_name, campaign_type FROM campaigns WHERE campaign_type IN ('email', 'social')",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
