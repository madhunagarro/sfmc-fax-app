require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

// SFMC Config
const AUTH_URL = process.env.AUTH_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const RETARUS_API_USER = process.env.RETARUS_API_USER;
const RETARUS_API_PASSWORD = process.env.RETARUS_API_PASSWORD;
const RETARUS_API_ENDPOINT = process.env.RETARUS_API_ENDPOINT;

// Validate Custom Activity
router.post('/validate', (req, res) => {
    console.log('Validation request received:', req.body);
    res.status(200).json({ success: true });
});

// Publish Custom Activity
router.post('/publish', (req, res) => {
    console.log('Publish request received:', req.body);
    res.status(200).json({ success: true });
});

// Execute Custom Activity (Send Fax)
router.post('/execute', async (req, res) => {
    try {
        console.log('Execute request received:', req.body);
        const inArguments = req.body.inArguments[0];

        const faxNumber = inArguments.faxNumber;
        const documentUrl = inArguments.documentUrl;

        const faxRequest = {
            recipients: [{ number: faxNumber }],
            documents: [{ name: 'Document', reference: documentUrl }]
        };

        const response = await axios.post(RETARUS_API_ENDPOINT, faxRequest, {
            auth: {
                username: RETARUS_API_USER,
                password: RETARUS_API_PASSWORD
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Fax Sent:', response.data);
        res.status(200).json({ success: true, response: response.data });
    } catch (error) {
        console.error('Error sending fax:', error);
        res.status(500).json({ error: 'Failed to send fax' });
    }
});

module.exports = router;
