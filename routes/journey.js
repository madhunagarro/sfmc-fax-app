const express = require('express');
const router = express.Router();

// ✅ Validate API (Called when saving the activity in SFMC)
router.post('/validate', (req, res) => {
    console.log('Validation request received:', req.body);
    res.status(200).json({ success: true, message: "Journey activity validated successfully" });
});

// ✅ Publish API (Called when publishing the journey in SFMC)
router.post('/publish', (req, res) => {
    console.log('Publish request received:', req.body);
    res.status(200).json({ success: true, message: "Journey activity published successfully" });
});

// ✅ Stop API (Called when stopping the journey)
router.post('/stop', (req, res) => {
    console.log('Stop request received:', req.body);
    res.status(200).json({ success: true, message: "Journey activity stopped successfully" });
});

// ✅ Execute API (Called when the journey activity runs - Sends Fax)
router.post('/execute', (req, res) => {
    console.log('Execute request received:', req.body);

    const inArguments = req.body.inArguments ? req.body.inArguments[0] : null;

    if (!inArguments || !inArguments.faxNumber || !inArguments.documentUrl) {
        return res.status(400).json({ success: false, error: "Missing required parameters: faxNumber or documentUrl" });
    }

    // Simulate API response (Replace with actual Retarus Fax API integration)
    res.status(200).json({
        success: true,
        message: "Fax execution simulated successfully",
        sentData: inArguments
    });
});

module.exports = router;
