import type { Lesson } from '../../types/curriculum';

export const lesson01: Lesson = {
    id: 'select-basics',
    title: 'Introduction to SELECT',
    module: 'sql',
    order: 1,
    prerequisites: [],
    content: `# Introduction to SELECT

Welcome to your first SQL lesson! SQL (Structured Query Language) is the standard language for working with databases. Every data analyst, marketer, and business intelligence professional uses SQL daily.

## What is a Database?

A database is an organized collection of data stored in tables. Think of it like a spreadsheet workbook where each sheet is a **table**, each column is a **field**, and each row is a **record**.

In this course, you'll work with a marketing analytics database containing data about customers, campaigns, surveys, and products.

## The SELECT Statement

The most fundamental SQL command is \`SELECT\`. It retrieves data from a table.

### Select All Columns

To see everything in a table, use \`SELECT *\`:

\`\`\`sql
SELECT * FROM customers;
\`\`\`

The \`*\` means "all columns." \`FROM customers\` tells SQL which table to look in.

### Limiting Results

Real tables can have thousands of rows. Use \`LIMIT\` to only see a few:

\`\`\`sql
SELECT * FROM customers LIMIT 10;
\`\`\`

This returns only the first 10 rows.

## Your Database

Here are the tables available to you:

| Table | Description |
|-------|-------------|
| \`customers\` | Customer profiles (name, age, location, etc.) |
| \`campaigns\` | Marketing campaigns (name, type, budget, etc.) |
| \`campaign_responses\` | How customers responded to campaigns |
| \`surveys\` | Survey metadata |
| \`survey_responses\` | Individual survey answers |
| \`products\` | Product catalog |

## Try It Yourself

Before moving to the practice questions, try these queries in the SQL editor:

\`\`\`sql
-- See all customers (limited to 5)
SELECT * FROM customers LIMIT 5;

-- See all campaigns
SELECT * FROM campaigns LIMIT 5;

-- See the products table
SELECT * FROM products LIMIT 5;
\`\`\`

> **Tip:** You can run a query by pressing **Ctrl+Enter** or clicking the **Run Query** button.

Ready to practice? Click **Start Practice** below!
`,
    questions: [
        {
            id: 'q1-select-all-customers',
            prompt: 'Write a query to select all columns from the customers table. Limit the results to 10 rows.',
            hints: [
                'Use SELECT * to get all columns',
                'The table name is "customers"',
                'Add LIMIT 10 at the end of your query',
            ],
            expectedQuery: 'SELECT * FROM customers LIMIT 10',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-select-all-campaigns',
            prompt: 'Write a query to select all columns from the campaigns table. Show only the first 5 campaigns.',
            hints: [
                'Use SELECT * to get all columns',
                'The table name is "campaigns"',
                'Use LIMIT 5 to restrict results',
            ],
            expectedQuery: 'SELECT * FROM campaigns LIMIT 5',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q3-select-all-products',
            prompt: 'View the first 10 rows of the products table.',
            hints: [
                'Start with SELECT *',
                'Use FROM products',
                'End with LIMIT 10',
            ],
            expectedQuery: 'SELECT * FROM products LIMIT 10',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
    ],
};
