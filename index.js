require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CORS Middleware (Required for SFMC)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Health Check
app.get('/', (req, res) => {
  res.status(200).send('Fax Service Running');
});

// SFMC Configuration Endpoint (Auto-called by SFMC)
app.get('/config.json', (req, res) => {
  res.json({
    "type": "FAX",
    "name": "Send Fax via Retarus",
    "schema": {
      "arguments": {
        "execute": {
          "inArguments": [
            {
              "faxNumber": "{{Contact.Attribute.FaxNumber}}" // Maps to DE field
            }
          ]
        }
      }
    }
  });
});

// Execute Endpoint (Auto-called by SFMC)
app.post('/execute', async (req, res) => {
  try {
    // Extract faxNumber from Journey Data (DE)
    const faxNumber = req.body.inArguments[0].faxNumber;

    // Validate
    if (!faxNumber) {
      return res.status(400).json({ error: "faxNumber is required" });
    }

    // Send Fax via Retarus API
    const response = await axios.post(
      process.env.RETARUS_API_URL,
      {
        recipients: [{ number: faxNumber }],
        documents: [{
          name: "fax.txt",
          data: Buffer.from("Fax content from journey").toString('base64')
        }]
      },
      {
        auth: {
          username: process.env.RETARUS_USERNAME,
          password: process.env.RETARUS_PASSWORD
        }
      }
    );

    res.status(200).json({
      status: "success",
      jobId: response.data.jobId
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));