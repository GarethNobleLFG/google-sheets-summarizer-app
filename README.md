# Google Sheets Summarizer App

A full-stack web application that automatically analyzes Google Drive created files such as sheets or docs and generates AI-powered summaries delivered via email and SMS. Users can register Google Sheets for automated analysis on custom schedules.

## System Overview

**Frontend**: React TypeScript application with modern UI components
**Backend**: Node.js Express API with PostgreSQL database
**AI Integration**: OpenAI GPT-4 for intelligent financial analysis
**External APIs**: Google Sheets, Twilio SMS, Email delivery

## Features

### User Experience
- User registration and JWT-based authentication
- Dashboard for managing Google Sheets
- Schedule customization (daily, weekly, monthly)
- Real-time analysis triggering
- Multi-format summary delivery (email + SMS)

### Automated Processing
- Cron-based scheduling system
- Parallel processing for performance
- Google Sheets API data extraction
- AI-powered financial insights
- Comprehensive error handling and reporting

### Intelligence & Delivery
- OpenAI GPT-4 budget analysis
- Actionable financial recommendations
- HTML and text summary formats
- Email delivery via Nodemailer
- SMS notifications via Twilio

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and context
- **HTTP Client**: Fetch API for backend communication

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Processing**: CSV parsing and data formatting
- **Scheduling**: node-cron for automated tasks

### External Services
- **AI Analysis**: OpenAI GPT-4 API
- **Data Source**: Google Sheets API v4
- **Messaging**: Twilio SMS API
- **Email**: Nodemailer SMTP
- **Infrastructure**: Docker containerization

## API Endpoints

### Authentication
- POST /users/register - Create user account
- POST /users/login - Authenticate and receive JWT

### User Management
- GET /users - List all users (protected)
- GET /users/:id - Get user details (protected)
- PUT /users/:id - Update user profile (protected)
- DELETE /users/:id - Delete user account (protected)
- GET /users/email/:email - Find user by email (protected)

### Sheet Management
- POST /sheet-data - Register Google Sheet
- GET /sheet-data/:id - Get sheet configuration
- GET /sheet-data/user/:userId/all - Get user's sheets
- PUT /sheet-data/:id - Update sheet settings
- DELETE /sheet-data/:id - Remove sheet
- DELETE /sheet-data/user/:userId/all - Remove all user sheets
- POST /sheet-data/user/:userId/trigger - Manual analysis trigger
