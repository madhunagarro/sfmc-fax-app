const express = require('express');
const axios = require('axios');
const router = express.Router();

const RETARUS_API_USER = process.env.RETARUS_API_USER || 'salesforce@drausbuettel.de';
const RETARUS_API_PASSWORD = process.env.RETARUS_API_PASSWORD || 'ac5g_AI7M$';
const RETARUS_API_ENDPOINT = process.env.RETARUS_API_ENDPOINT || 'https://faxws.de1.retarus.com/rest/v1/19345/fax';

// ✅ Execute API (Triggered when SFMC runs the journey)
router.post('/execute', async (req, res) => {
    console.log('Execute request received:', JSON.stringify(req.body, null, 2));

    if (!req.body || !req.body.inArguments || req.body.inArguments.length === 0) {
        return res.status(400).json({ success: false, error: "No inArguments provided" });
    }

    const { faxNumber, documentUrl } = req.body.inArguments[0];

    if (!faxNumber || !documentUrl) {
        return res.status(400).json({ success: false, error: "Missing required parameters: faxNumber or documentUrl" });
    }

    try {
        const response = await axios.post(
            RETARUS_API_ENDPOINT,
            {
                recipients: [{ number: faxNumber }],
                documents: [{ name: "retarusfaxservices.pdf", reference: documentUrl }]
            },
            {
                auth: {
                    username: RETARUS_API_USER,
                    password: RETARUS_API_PASSWORD
                },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log('Retarus API Response:', response.data);

        res.status(200).json({
            success: true,
            message: "Fax sent successfully via Retarus",
            retarusResponse: response.data
        });

    } catch (error) {
        console.error("Error sending fax:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: "Failed to send fax via Retarus", details: error.message });
    }
});

router.get('/status/:jobId', async (req, res) => {
    const jobId = req.params.jobId;

    if (!jobId) {
        return res.status(400).json({ success: false, error: "Job ID is required" });
    }

    try {
        const response = await axios.get(`${RETARUS_API_ENDPOINT}/${jobId}/status`, {
            auth: {
                username: RETARUS_API_USER,
                password: RETARUS_API_PASSWORD
            }
        });

        res.status(200).json({
            success: true,
            message: "Fax status retrieved successfully",
            status: response.data
        });

    } catch (error) {
        console.error("Error fetching fax status:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: "Failed to fetch fax status", details: error.message });
    }
});


module.exports = router;
