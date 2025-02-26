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

app.get('/config.json', (req, res) => {
    res.json({
      "type": "FAX",
      "name": "Send Fax via Retarus",
      "schema": {
        "arguments": {
          "execute": {
            "inArguments": [
              {
                "faxNumber": {
                  "dataType": "Text",
                  "isRequired": true,
                  "direction": "in",
                  "access": "visible",
                  "description": "The fax number to send the fax to."
                },
                "documentName": {
                  "dataType": "Text",
                  "isRequired": true,
                  "direction": "in",
                  "access": "visible",
                  "description": "The name of the document to send."
                },
                "documentData": {
                  "dataType": "Text",
                  "isRequired": true,
                  "direction": "in",
                  "access": "visible",
                  "description": "The base64-encoded content of the document."
                }
              }
            ]
          }
        }
      }
    });
  });

  app.post('/execute', async (req, res) => {
    try {
      // Extract configuration from the request
      const { faxNumber, documentName, documentData } = req.body.inArguments[0];
  
      // Validate input
      if (!faxNumber || !documentName || !documentData) {
        return res.status(400).json({ error: "faxNumber, documentName, and documentData are required" });
      }
  
      // Send fax via Retarus API
      const response = await axios.post(
        process.env.RETARUS_API_URL,
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
      res.status(500).json({
        status: "error",
        message: error.response?.data || error.message
      });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));