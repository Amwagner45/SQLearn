import type { Lesson } from '../../types/curriculum';

export const lesson02: Lesson = {
    id: 'selecting-columns',
    title: 'Selecting Specific Columns',
    module: 'sql',
    order: 2,
    prerequisites: ['select-basics'],
    content: `# Selecting Specific Columns

In the previous lesson, you used \`SELECT *\` to retrieve all columns. But in practice, you usually only need certain columns. Selecting specific columns makes your queries faster and results easier to read.

## Syntax

Instead of \`*\`, list the column names separated by commas:

\`\`\`sql
SELECT first_name, last_name, email
FROM customers
LIMIT 5;
\`\`\`

This returns only the three specified columns.

## Column Aliases with AS

You can rename columns in your output using \`AS\`:

\`\`\`sql
SELECT
  first_name AS "First Name",
  last_name AS "Last Name",
  acquisition_channel AS "How They Found Us"
FROM customers
LIMIT 5;
\`\`\`

Aliases make your results more readable, especially when sharing with non-technical teammates.

> **Note:** If your alias contains spaces, wrap it in double quotes.

## Combining Columns

You can use the \`||\` operator (concatenation) to combine text columns:

\`\`\`sql
SELECT
  first_name || ' ' || last_name AS full_name,
  email
FROM customers
LIMIT 5;
\`\`\`

## Examples with Different Tables

\`\`\`sql
-- Campaign names and budgets
SELECT campaign_name, budget
FROM campaigns;

-- Product names and prices
SELECT product_name, price, category
FROM products
LIMIT 10;

-- Survey names and topics
SELECT survey_name, topic
FROM surveys;
\`\`\`

## Key Takeaways

- List specific column names instead of \`*\` when you don't need all data
- Use \`AS\` to give columns friendlier names
- Use \`||\` to concatenate text values
- Always specify only the columns you need — it's a best practice
`,
    questions: [
        {
            id: 'q1-select-name-email',
            prompt: 'Select just the first_name, last_name, and email columns from the customers table. Show 10 rows.',
            hints: [
                'List the column names after SELECT, separated by commas',
                'SELECT first_name, last_name, email FROM customers',
                'Add LIMIT 10 at the end',
            ],
            expectedQuery: 'SELECT first_name, last_name, email FROM customers LIMIT 10',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-campaign-name-budget',
            prompt: 'Select the campaign_name, campaign_type, and budget from the campaigns table.',
            hints: [
                'Use SELECT with three column names',
                'The table is "campaigns"',
                'SELECT campaign_name, campaign_type, budget FROM campaigns',
            ],
            expectedQuery: 'SELECT campaign_name, campaign_type, budget FROM campaigns',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q3-product-info',
            prompt: 'Select the product_name, category, and price from the products table. Show the first 15 rows.',
            hints: [
                'List three columns: product_name, category, price',
                'FROM products',
                'Add LIMIT 15',
            ],
            expectedQuery: 'SELECT product_name, category, price FROM products LIMIT 15',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
