import type { Lesson } from '../../types/curriculum';

export const lesson15: Lesson = {
    id: 'string-functions',
    title: 'String Functions & LIKE',
    module: 'sql',
    order: 15,
    prerequisites: ['window-functions'],
    content: `# String Functions & LIKE

SQL provides functions to search, transform, and manipulate text data.

## LIKE Pattern Matching

\`LIKE\` lets you search for patterns in text:
- \`%\` matches any number of characters
- \`_\` matches exactly one character

\`\`\`sql
-- Customers with first name starting with 'J'
SELECT first_name, last_name
FROM customers
WHERE first_name LIKE 'J%'
LIMIT 10;
\`\`\`

\`\`\`sql
-- Email addresses from gmail
SELECT first_name, email
FROM customers
WHERE email LIKE '%gmail%'
LIMIT 10;
\`\`\`

## Common String Functions

### UPPER and LOWER
\`\`\`sql
SELECT
  UPPER(first_name) AS upper_name,
  LOWER(email) AS lower_email
FROM customers
LIMIT 5;
\`\`\`

### LENGTH
\`\`\`sql
SELECT
  campaign_name,
  LENGTH(campaign_name) AS name_length
FROM campaigns
ORDER BY name_length DESC
LIMIT 10;
\`\`\`

### SUBSTR (Substring)
\`\`\`sql
-- Extract year from signup_date (stored as 'YYYY-MM-DD')
SELECT
  first_name,
  signup_date,
  SUBSTR(signup_date, 1, 4) AS signup_year
FROM customers
LIMIT 10;
\`\`\`

### REPLACE
\`\`\`sql
SELECT
  email,
  REPLACE(email, '@', ' [at] ') AS masked_email
FROM customers
LIMIT 5;
\`\`\`

### || (Concatenation)
\`\`\`sql
SELECT first_name || ' ' || last_name AS full_name
FROM customers
LIMIT 10;
\`\`\`

## Combining String Functions

\`\`\`sql
SELECT
  UPPER(first_name || ' ' || last_name) AS full_name,
  LENGTH(email) AS email_length,
  SUBSTR(signup_date, 1, 7) AS signup_month
FROM customers
WHERE first_name LIKE 'A%'
LIMIT 15;
\`\`\`

## Key Takeaways

- \`LIKE\` with \`%\` and \`_\` for pattern matching
- \`UPPER()\` / \`LOWER()\` for case conversion
- \`LENGTH()\` for string length
- \`SUBSTR(text, start, length)\` to extract parts
- \`REPLACE(text, old, new)\` for substitution
- \`||\` to concatenate strings
`,
    questions: [
        {
            id: 'q1-like-pattern',
            prompt: 'Find all customers whose email contains \'gmail\'. Show first_name, last_name, and email.',
            hints: [
                'Use WHERE email LIKE \'%gmail%\'',
                'SELECT first_name, last_name, email FROM customers WHERE email LIKE \'%gmail%\'',
                'SELECT first_name, last_name, email FROM customers WHERE email LIKE \'%gmail%\'',
            ],
            expectedQuery: "SELECT first_name, last_name, email FROM customers WHERE email LIKE '%gmail%'",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: false, floatPrecision: 2 },
        },
        {
            id: 'q2-concat-fullname',
            prompt: 'Create a full_name column by concatenating first_name and last_name (with a space between). Also show email. Limit to 20 rows.',
            hints: [
                'Use first_name || \' \' || last_name AS full_name',
                'SELECT first_name || \' \' || last_name AS full_name, email FROM customers LIMIT 20',
                'SELECT first_name || \' \' || last_name AS full_name, email FROM customers LIMIT 20',
            ],
            expectedQuery: "SELECT first_name || ' ' || last_name AS full_name, email FROM customers LIMIT 20",
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
        {
            id: 'q3-string-functions',
            prompt: 'Show campaign_name in uppercase and its character length. Sort by length descending.',
            hints: [
                'Use UPPER(campaign_name) and LENGTH(campaign_name)',
                'Don\'t forget ORDER BY LENGTH(campaign_name) DESC',
                'SELECT UPPER(campaign_name), LENGTH(campaign_name) FROM campaigns ORDER BY LENGTH(campaign_name) DESC',
            ],
            expectedQuery: 'SELECT UPPER(campaign_name), LENGTH(campaign_name) FROM campaigns ORDER BY LENGTH(campaign_name) DESC',
            grading: { checkColumnOrder: false, checkColumnNames: false, checkRowOrder: true, floatPrecision: 2 },
        },
    ],
};
