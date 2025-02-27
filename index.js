require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Configuration Endpoint (Auto-called by SFMC)
app.get('/config.json', (req, res) => {
  res.json({
    "type": "FAX",
    "name": "Send Fax via Retarus",
    "schema": {
      "arguments": {
        "execute": {
          "inArguments": [
            {
              "faxNumber": "{{Contact.Attribute.FaxNumber}}" // Direct DE mapping
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
    // Extract faxNumber from Journey Data Extension
    const faxNumber = req.body.inArguments[0].faxNumber;

    // Static values from your Apex code
    const documentName = "faxdocument.pdf";
    const documentData = "JVBERi0xLjcKCjQgMCBvYmoKKElkZW50aXR5KQplbmRvYmoKNSAwIG9iagooQWRvYmUpCmVuZG9iago4IDAgb2JqCjw8Ci9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9MZW5ndGggMzc4OTYKL0xlbmd0aDEgODc3MzIKL1R5cGUgL1N0cmVhbQo"; // Your base64 dummy data

    // Send fax via Retarus API
    const response = await axios.post(
      "https://faxws-ha.de.retarus.com/rest/v1/19345/fax",
      {
        recipients: [{ number: faxNumber }],
        documents: [{
          name: documentName,
          data: documentData
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
    console.error("Fax error:", error.response?.data || error.message);
    res.status(500).json({
      status: "error",
      message: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));