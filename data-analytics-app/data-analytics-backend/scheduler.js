const cron = require('node-cron');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

// --- Nodemailer Configuration ---
// Use environment variables for security.
// For Gmail, you might need an "App Password".
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your.email@gmail.com
        pass: process.env.EMAIL_PASS, // your gmail app password
    },
});

// --- Function to Fetch Report Data ---
async function fetchMonthlyReport() {
    console.log('Fetching monthly report data...');
    try {
        // Note: In a real app, you'd have a way to get a long-lived API token
        // or use an internal authentication method. This is a simplified example.
        const response = await axios.get('http://localhost:8080/api/data/export?format=csv', {
            headers: { 'x-access-token': process.env.API_ACCESS_TOKEN } // A valid token
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch report:', error.message);
        return null;
    }
}

// --- Function to Email the Report ---
async function emailReport(reportData) {
    if (!reportData) {
        console.log('No report data to email.');
        return;
    }
    console.log('Sending email...');
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'management@example.com', // Recipient's email
        subject: 'Monthly Analytics Report',
        text: 'Please find the attached analytics report for the last month.',
        attachments: [
            {
                filename: `monthly_report_${new Date().toISOString().split('T')[0]}.csv`,
                content: reportData,
                contentType: 'text/csv',
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// --- Cron Job Scheduling ---
// This schedule runs the task at 8:00 AM on the 1st day of every month.
console.log('Scheduler started. Waiting for scheduled tasks.');
cron.schedule('0 8 1 * *', async () => {
    console.log('--- Running Monthly Report Job ---');
    const reportCsvData = await fetchMonthlyReport();
    await emailReport(reportCsvData);
    console.log('--- Monthly Report Job Finished ---');
});