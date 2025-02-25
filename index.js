const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Fax Service Running');
});

// SFMC Configuration
app.get('/config.json', (req, res) => {
  res.json({
    "type": "FAX",
    "name": "Send Fax",
    "schema": {
      "arguments": {
        "execute": {
          "inArguments": [{
            "faxNumber": "{{Contact.Default.Phone}}",
            "message": "Hello {{Contact.Attribute.FirstName}}"
          }]
        }
      }
    }
  });
});

// Fax Sending Endpoint
app.post('/execute', async (req, res) => {
  try {
    const { faxNumber, message } = req.body.inArguments[0];
    
    // Send fax via Retarus
    const response = await axios.post('https://api.retarus.com/fax/v4/jobs', {
      number: faxNumber,
      documents: [{
        content: Buffer.from(message).toString('base64'),
        name: "fax.txt"
      }]
    }, {
      auth: {
        username: process.env.RETARUS_USERNAME,
        password: process.env.RETARUS_PASSWORD
      }
    });

    res.json({ success: true, jobId: response.data.jobId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));