const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
const RETARUS_API_URL = process.env.RETARUS_API_ENDPOINT;
const RETARUS_USERNAME = process.env.RETARUS_API_USER;
const RETARUS_PASSWORD = process.env.RETARUS_API_PASSWORD;

// Encode credentials for Basic Auth
const encodedCredentials = Buffer.from(`${RETARUS_USERNAME}:${RETARUS_PASSWORD}`).toString('base64');

// Validate API
router.post('/validate', (req, res) => {
    res.json({ success: true, message: "Journey validated successfully" });
});

// Publish API
router.post('/publish', (req, res) => {
    res.json({ success: true, message: "Journey published successfully" });
});

// Execute API (Send Fax)
router.post('/execute', async (req, res) => {
    try {
        const inArguments = req.body.inArguments;
        if (!inArguments || inArguments.length === 0) {
            return res.status(400).json({ success: false, error: "Missing inArguments" });
        }

        const { faxNumber, documentUrl } = inArguments[0];

        if (!faxNumber || !documentUrl) {
            return res.status(400).json({ success: false, error: "Missing required parameters: faxNumber or documentUrl" });
        }

        // Call Retarus API
        const response = await axios.post(RETARUS_API_URL, {
            recipient: faxNumber,
            document: documentUrl
        }, {
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            message: "Fax sent successfully via Retarus",
            retarusResponse: response.data
        });

    } catch (error) {
        console.error("Retarus API Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
