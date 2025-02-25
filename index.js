require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Health Check
app.get('/', (req, res) => {
  res.status(200).send('Fax Service Running');
});

// SFMC Configuration Endpoint
app.get('/config.json', (req, res) => {
  res.json({
    "type": "FAX",
    "name": "Send Fax via Retarus",
    "schema": {
      "arguments": {
        "execute": {
          "inArguments": [
            {
              "faxNumber": "{{Contact.Attribute.FaxNumber}}", // Map to SFMC Contact attribute
              "message": "{{Contact.Attribute.Message}}",     // Dynamic message from SFMC
              "templateName": "DefaultTemplate"               // Optional template identifier
            }
          ]
        }
      }
    }
  });
});

// Execute Endpoint
app.post('/execute', async (req, res) => {
  try {
    // Extract data from SFMC Contact
    const { faxNumber, message, templateName } = req.body.inArguments[0];

    // Validate input
    if (!faxNumber || !message) {
      return res.status(400).json({ error: "faxNumber and message are required" });
    }

    // Build Retarus API payload
    const payload = {
      reference: {
        customerDefinedId: `SFMC_${Date.now()}`, // Unique identifier for tracking
        billingCode: "SFMC_CAMPAIGN",            // Optional billing code
      },
      recipients: [{
        number: faxNumber,
        properties: [
          { key: "message", value: message }
        ]
      }],
      renderingOptions: {
        coverpageTemplate: {
          template: "BASE64_ENCODED_TEMPLATE" // Replace with your Retarus template
        }
      }
    };

    // Send fax via Retarus API
    const response = await axios.post(
      process.env.RETARUS_API_URL,
      payload,
      {
        auth: {
          username: process.env.RETARUS_USERNAME,
          password: process.env.RETARUS_PASSWORD
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(`${process.env.RETARUS_USERNAME}:${process.env.RETARUS_PASSWORD}`).toString('base64')}`
        }
      }
    );

    res.status(200).json({
      status: "success",
      jobId: response.data.JobId // Retarus Job ID for tracking
    });

  } catch (error) {
    console.error("Error sending fax:", error.message);
    res.status(500).json({
      status: "error",
      message: error.response?.data || error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));