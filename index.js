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

// Execute Endpoint (Send Fax)
app.post('/execute', async (req, res) => {
  try {
    // Extract faxNumber and message from the request
    const { faxNumber, message } = req.body.inArguments[0];

    // Validate input
    if (!faxNumber || !message) {
      return res.status(400).json({ error: 'faxNumber and message are required' });
    }

    // Send fax via Retarus API
    const response = await axios.post(
      process.env.RETARUS_API_URL, // Retarus API URL from env
      {
        number: faxNumber,
        documents: [{
          content: Buffer.from(message).toString('base64'),
          name: "fax.txt"
        }]
      },
      {
        auth: {
          username: process.env.RETARUS_USERNAME,
          password: process.env.RETARUS_PASSWORD
        },
        headers: {
          "Authorization": `Basic ${Buffer.from(`${process.env.RETARUS_USERNAME}:${process.env.RETARUS_PASSWORD}`).toString('base64')}`
        }
      }
    );

    console.log('Fax sent successfully:', response.data);
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});