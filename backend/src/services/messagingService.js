import dotenv from 'dotenv';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { findUserIdById } from '../repositories/sheetDataRepositories.js';
import { findEmailById } from '../repositories/userRepositories.js';
import { emailFormatter } from '../utils/emailFormatter.js';

dotenv.config();

// Initialize services
//const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 75000
});

export async function sendMessage(message, sheetDataInfo) {
    try {

        const userId = await findUserIdById(sheetDataInfo.id);

        const userEmail = await findEmailById(userId);

        const formattedEmail = await emailFormatter(message, sheetDataInfo.sheet_name);

        /*
        // Send via SMS
        await twilioClient.messages.create({
            body: `Daily Budget Summary:\n\n${message.text}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.YOUR_PHONE_NUMBER
        });
        */

        // Send email
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `${message.messageType} - ${new Date().toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })}`,
            text: message.text,
            html: formattedEmail.html
        });

        return { success: true };
    }
    catch (error) {
        console.error('Error sending messages:', error.message);
        throw error;
    }
}