require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).send('Fax Service is running');
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
              "message": "{{Contact.Attribute.Message}}"      // Dynamic message from SFMC
            }
          ]
        }
      }
    }
  });
});

// Execute Endpoint (Send Fax)
app.post('/execute', async (req, res) => {
  try {
    // Extract data from SFMC Contact
    const { faxNumber, message } = req.body.inArguments[0];

    // Validate input
    if (!faxNumber || !message) {
      return res.status(400).json({ error: "faxNumber and message are required" });
    }

    // Build Retarus API payload
    const payload = {
      recipients: [
        {
          number: faxNumber
        }
      ],
      documents: [
        {
          name: "faxdocument.txt",
          data: Buffer.from(message).toString('base64') // Encode message as base64
        }
      ]
    };

    // Send fax via Retarus API
    const response = await axios.post(
      process.env.RETARUS_API_URL, // Retarus API URL from env
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

    console.log('Fax sent successfully:', response.data);
    res.status(200).json({
      status: "success",
      jobId: response.data.jobId // Retarus Job ID for tracking
    });

  } catch (error) {
    console.error("Error sending fax:", error.message);
    console.error("Error details:", error.response?.data || error.stack);
    res.status(500).json({
      status: "error",
      message: error.response?.data || error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));