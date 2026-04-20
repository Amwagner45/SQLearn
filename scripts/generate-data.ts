import { faker } from '@faker-js/faker';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Fixed seed for reproducible data
faker.seed(42);

const DB_PATH = path.join(__dirname, '..', 'resources', 'sqlearn.db');

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
];

const CITIES: Record<string, string[]> = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'Illinois': ['Chicago', 'Springfield', 'Aurora', 'Naperville', 'Peoria'],
};

const CHANNELS = ['email', 'social_media', 'search_engine', 'referral', 'direct', 'paid_ads'];
const CAMPAIGN_TYPES = ['email', 'social', 'search', 'display', 'influencer', 'content'];
const CAMPAIGN_CHANNELS = ['facebook', 'instagram', 'google_ads', 'email', 'twitter', 'linkedin', 'youtube', 'tiktok'];
const TARGET_AUDIENCES = ['millennials', 'gen_z', 'professionals', 'parents', 'seniors', 'students', 'small_business'];
const RESPONSE_TYPES = ['click', 'open', 'purchase', 'ignore', 'unsubscribe', 'share'];
const DEVICE_TYPES = ['desktop', 'mobile', 'tablet'];
const SURVEY_TOPICS = ['customer_satisfaction', 'product_feedback', 'brand_awareness', 'market_research', 'employee_engagement', 'user_experience'];
const PRODUCT_CATEGORIES = ['Software', 'Services', 'Training', 'Consulting', 'Analytics', 'Automation'];
const PRODUCT_SUBCATEGORIES: Record<string, string[]> = {
    'Software': ['CRM', 'Email Platform', 'Analytics Dashboard', 'Social Media Tool', 'SEO Tool'],
    'Services': ['Campaign Management', 'Content Creation', 'Design', 'Strategy', 'Support'],
    'Training': ['SQL Bootcamp', 'Excel Masterclass', 'Data Viz Workshop', 'Analytics Course', 'Marketing Cert'],
    'Consulting': ['Brand Strategy', 'Digital Transformation', 'Market Analysis', 'Growth Hacking', 'SEO Audit'],
    'Analytics': ['Web Analytics', 'Social Listening', 'Survey Platform', 'A/B Testing', 'Attribution'],
    'Automation': ['Email Automation', 'Ad Automation', 'Chatbot', 'Workflow Engine', 'Lead Scoring'],
};

async function main() {
    // Ensure resources directory exists
    const resourcesDir = path.dirname(DB_PATH);
    if (!fs.existsSync(resourcesDir)) {
        fs.mkdirSync(resourcesDir, { recursive: true });
    }

    // Remove existing database
    if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
    }

    const db = new Database(DB_PATH);
    console.log('Creating database...');

    // Create tables
    db.exec(`
    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      country TEXT DEFAULT 'United States',
      signup_date TEXT NOT NULL,
      acquisition_channel TEXT NOT NULL
    )
  `);

    db.exec(`
    CREATE TABLE campaigns (
      campaign_id INTEGER PRIMARY KEY,
      campaign_name TEXT NOT NULL,
      campaign_type TEXT NOT NULL,
      channel TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      budget REAL NOT NULL,
      target_audience TEXT NOT NULL
    )
  `);

    db.exec(`
    CREATE TABLE campaign_responses (
      response_id INTEGER PRIMARY KEY,
      campaign_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      response_date TEXT NOT NULL,
      response_type TEXT NOT NULL,
      revenue_generated REAL DEFAULT 0,
      device_type TEXT NOT NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `);

    db.exec(`
    CREATE TABLE surveys (
      survey_id INTEGER PRIMARY KEY,
      survey_name TEXT NOT NULL,
      topic TEXT NOT NULL,
      created_date TEXT NOT NULL,
      total_questions INTEGER NOT NULL
    )
  `);

    db.exec(`
    CREATE TABLE survey_responses (
      survey_response_id INTEGER PRIMARY KEY,
      survey_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      response_date TEXT NOT NULL,
      response_text TEXT,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      nps_score INTEGER CHECK (nps_score BETWEEN 0 AND 10),
      FOREIGN KEY (survey_id) REFERENCES surveys(survey_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `);

    db.exec(`
    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT NOT NULL,
      category TEXT NOT NULL,
      subcategory TEXT NOT NULL,
      price REAL NOT NULL,
      launch_date TEXT NOT NULL
    )
  `);

    // Generate customers
    console.log('Generating 1000 customers...');
    const customers = [];
    for (let i = 1; i <= 1000; i++) {
        const state = faker.helpers.arrayElement(US_STATES);
        const citiesForState = CITIES[state] || [faker.location.city()];
        const city = faker.helpers.arrayElement(citiesForState);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        customers.push({
            customer_id: i,
            first_name: firstName,
            last_name: lastName,
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            age: faker.number.int({ min: 18, max: 72 }),
            gender: faker.helpers.arrayElement(['Male', 'Female', 'Non-binary']),
            city,
            state,
            signup_date: faker.date.between({ from: '2020-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
            acquisition_channel: faker.helpers.arrayElement(CHANNELS),
        });
    }

    // Insert customers in batches
    const insertCustomer = db.prepare(
        `INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'United States', ?, ?)`
    );
    const insertCustomers = db.transaction(() => {
        for (const c of customers) {
            insertCustomer.run(c.customer_id, c.first_name, c.last_name, c.email, c.age, c.gender, c.city, c.state, c.signup_date, c.acquisition_channel);
        }
    });
    insertCustomers();

    // Generate campaigns
    console.log('Generating 50 campaigns...');
    db.exec('BEGIN');
    const campaignStmt = db.prepare(
        `INSERT INTO campaigns VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const campaignNames = [
        'Spring Sale Blast', 'Summer Social Push', 'Back to School', 'Holiday Gift Guide',
        'New Year New You', 'Product Launch Alert', 'Customer Appreciation', 'Flash Sale Friday',
        'Brand Awareness Drive', 'Referral Rewards', 'Content Marketing Series', 'Webinar Promotion',
        'Free Trial Campaign', 'Loyalty Program Launch', 'Re-engagement Wave', 'Seasonal Discount',
        'Influencer Collab', 'Email Newsletter Boost', 'Social Proof Campaign', 'Exit Intent Offer',
        'Welcome Series', 'Win-Back Campaign', 'Cross-Sell Push', 'Upsell Opportunity',
        'Survey Invite', 'Feedback Request', 'Beta Tester Recruit', 'Partnership Promo',
        'Thought Leadership', 'Case Study Showcase', 'Demo Request Drive', 'Whitepaper Download',
        'Podcast Sponsorship', 'Event Registration', 'Early Bird Special', 'VIP Access',
        'Clearance Sale', 'Bundle Deal', 'Anniversary Celebration', 'Community Building',
        'Product Update Announce', 'Testimonial Collection', 'How-To Series', 'Industry Report',
        'Trend Alert', 'Quick Tips Campaign', 'Success Stories', 'ROI Calculator Promo',
        'Comparison Guide', 'Year in Review'
    ];

    for (let i = 1; i <= 50; i++) {
        const startDate = faker.date.between({ from: '2022-01-01', to: '2025-06-01' });
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + faker.number.int({ min: 7, max: 90 }));

        campaignStmt.run(
            i,
            campaignNames[i - 1],
            faker.helpers.arrayElement(CAMPAIGN_TYPES),
            faker.helpers.arrayElement(CAMPAIGN_CHANNELS),
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0],
            faker.number.float({ min: 500, max: 50000, fractionDigits: 2 }),
            faker.helpers.arrayElement(TARGET_AUDIENCES)
        );
    }

    // Generate campaign responses
    console.log('Generating 10000 campaign responses...');
    const respStmt = db.prepare(
        `INSERT INTO campaign_responses VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    for (let i = 1; i <= 10000; i++) {
        const responseType = faker.helpers.weightedArrayElement([
            { weight: 30, value: 'open' },
            { weight: 25, value: 'click' },
            { weight: 15, value: 'purchase' },
            { weight: 20, value: 'ignore' },
            { weight: 5, value: 'unsubscribe' },
            { weight: 5, value: 'share' },
        ]);

        const revenue = responseType === 'purchase'
            ? faker.number.float({ min: 10, max: 500, fractionDigits: 2 })
            : 0;

        respStmt.run(
            i,
            faker.number.int({ min: 1, max: 50 }),
            faker.number.int({ min: 1, max: 1000 }),
            faker.date.between({ from: '2022-01-01', to: '2025-12-31' }).toISOString().split('T')[0],
            responseType,
            revenue,
            faker.helpers.weightedArrayElement([
                { weight: 45, value: 'mobile' },
                { weight: 40, value: 'desktop' },
                { weight: 15, value: 'tablet' },
            ])
        );
    }

    // Generate surveys
    console.log('Generating 20 surveys...');
    const surveyStmt = db.prepare(
        `INSERT INTO surveys VALUES (?, ?, ?, ?, ?)`
    );
    const surveyNames = [
        'Q1 2023 Customer Satisfaction', 'Product Feature Feedback', 'Website Usability Study',
        'Brand Perception Survey', 'NPS Quarterly Check', 'Onboarding Experience Review',
        'Content Preference Survey', 'Pricing Feedback', 'Support Quality Assessment',
        'Annual Customer Survey 2023', 'Mobile App Feedback', 'Email Preference Center',
        'Market Segmentation Study', 'Competitor Analysis Survey', 'Event Feedback Form',
        'Beta Feature Evaluation', 'Churn Risk Assessment', 'Loyalty Program Feedback',
        'Annual Customer Survey 2024', 'Q1 2025 Satisfaction Check'
    ];

    for (let i = 1; i <= 20; i++) {
        surveyStmt.run(
            i,
            surveyNames[i - 1],
            faker.helpers.arrayElement(SURVEY_TOPICS),
            faker.date.between({ from: '2022-06-01', to: '2025-06-01' }).toISOString().split('T')[0],
            faker.number.int({ min: 5, max: 20 })
        );
    }

    // Generate survey responses
    console.log('Generating 5000 survey responses...');
    const survRespStmt = db.prepare(
        `INSERT INTO survey_responses VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const responseTexts = [
        'Very satisfied with the product', 'Could be improved', 'Excellent service',
        'Average experience', 'Would recommend to others', 'Not what I expected',
        'Great value for money', 'Needs more features', 'Love the interface',
        'Too complicated', 'Fast and reliable', 'Good but expensive',
        'Very helpful support team', 'Easy to use', 'Disappointed with quality',
        null, null, null, // Some null responses for realistic data
    ];

    for (let i = 1; i <= 5000; i++) {
        const surveyId = faker.number.int({ min: 1, max: 20 });
        survRespStmt.run(
            i,
            surveyId,
            faker.number.int({ min: 1, max: 1000 }),
            faker.number.int({ min: 1, max: 15 }),
            faker.date.between({ from: '2022-06-01', to: '2025-12-31' }).toISOString().split('T')[0],
            faker.helpers.arrayElement(responseTexts),
            faker.number.int({ min: 1, max: 5 }),
            faker.number.int({ min: 0, max: 10 })
        );
    }

    // Generate products
    console.log('Generating 100 products...');
    const prodStmt = db.prepare(
        `INSERT INTO products VALUES (?, ?, ?, ?, ?, ?)`
    );
    let prodId = 1;
    for (const category of PRODUCT_CATEGORIES) {
        const subs = PRODUCT_SUBCATEGORIES[category];
        for (const sub of subs) {
            // Generate a few products per subcategory
            const count = faker.number.int({ min: 2, max: 4 });
            for (let j = 0; j < count && prodId <= 100; j++) {
                const tier = faker.helpers.arrayElement(['Basic', 'Pro', 'Enterprise', 'Starter', 'Premium']);
                prodStmt.run(
                    prodId,
                    `${sub} ${tier}`,
                    category,
                    sub,
                    faker.number.float({ min: 29, max: 999, fractionDigits: 2 }),
                    faker.date.between({ from: '2020-01-01', to: '2025-06-01' }).toISOString().split('T')[0]
                );
                prodId++;
            }
        }
    }

    db.exec('COMMIT');

    // Verify data
    console.log('\n--- Data Summary ---');
    const tables = ['customers', 'campaigns', 'campaign_responses', 'surveys', 'survey_responses', 'products'];
    for (const table of tables) {
        const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
        console.log(`${table}: ${result.count} rows`);
    }

    db.close();
    console.log(`\nDatabase created at: ${DB_PATH}`);
}

main().catch(console.error);
