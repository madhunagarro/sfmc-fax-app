require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// JWT Validation Middleware
const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // Verify JWT using SFMC's secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.sfmcContext = decoded;
    next();
  } catch (error) {
    console.error('JWT validation failed:', error.message);
    res.status(401).json({ error: 'Invalid JWT token' });
  }
};

// Add CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  
  // Configuration Endpoint
  app.get('/config.json', (req, res) => {
    res.json({
      "type": "FAX",
      "name": "Send Fax via Retarus",
      "schema": {
        "arguments": {
          "execute": {
            "inArguments": [
              {
                "faxNumber": "{{Contact.Attribute.FaxNumber}}",
                "message": "{{Contact.Attribute.Message}}"
              }
            ]
          }
        }
      }
    });
  });

// Execute Endpoint (Protected by JWT)
app.post('/execute', validateJWT, async (req, res) => {
  try {
    const { faxNumber, message } = req.body.inArguments[0];
    
    // Send fax via Retarus API
    const response = await axios.post(
      process.env.RETARUS_API_URL,
      {
        recipients: [{ number: faxNumber }],
        documents: [{
          name: "faxdocument.txt",
          data: Buffer.from(message).toString('base64')
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
    console.error('Error sending fax:', error.message);
    res.status(500).json({
      status: "error",
      message: error.response?.data || error.message
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));