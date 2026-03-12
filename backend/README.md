# Google Sheets Summarizer Backend

A Node.js API that automatically analyzes Google Sheets and generates AI-powered financial summaries delivered via email and SMS.

## Features

- JWT user authentication with bcrypt password hashing
- Google Sheets API integration for data extraction
- OpenAI GPT-4 financial analysis and insights
- Automated cron scheduling (daily, weekly, monthly)
- Multi-channel delivery (email via Nodemailer, SMS via Twilio)
- PostgreSQL database with Sequelize ORM

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize
- **APIs**: Google Sheets, OpenAI GPT-4, Twilio
- **Infrastructure**: Docker, cron scheduling

## API Endpoints

### User Management
- POST /users/register - Create new user account
- POST /users/login - Authenticate and get JWT token
- GET /users - Get all users (protected)
- GET /users/:id - Get user by ID (protected)
- GET /users/email/:email - Get user by email (protected)
- PUT /users/:id - Update user details (protected)
- DELETE /users/:id - Delete user account (protected)

### Sheet Data Management
- POST /sheet-data - Add Google Sheet for analysis
- GET /sheet-data/:id - Get specific sheet data entry
- GET /sheet-data/user/:userId/all - Get all sheets for a user
- PUT /sheet-data/:id - Update sheet configuration
- DELETE /sheet-data/:id - Remove sheet from analysis
- DELETE /sheet-data/user/:userId/all - Remove all user sheets
- POST /sheet-data/user/:userId/trigger - Manually trigger analysis