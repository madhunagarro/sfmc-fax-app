require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Execute Endpoint
app.post('/execute', async (req, res) => {
  try {
    const { faxNumber } = req.body.inArguments[0];
    const documentData = "JVBERi0xLjcKCjQgMCBvYmoKKElkZW50aXR5KQplbmRvYmoKNSAwIG9iagooQWRvYmUpCmVuZG9iago4IDAgb2JqCjw8Ci9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9MZW5ndGggMzc4OTYKL0xlbmd0aDEgODc3MzIKL1R5cGUgL1N0cmVhbQo"; // Dummy base64 data

    // Send fax via Retarus API
    const response = await axios.post(
      process.env.RETARUS_API_URL,
      {
        recipients: [{ number: faxNumber }],
        documents: [{
          name: "samplefax.pdf",
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

    res.status(200).json({ status: "success", jobId: response.data.jobId });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));