const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for SFMC
app.use(cors());

// Middleware for JSON parsing
app.use(bodyParser.json());

// ✅ Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve `config.json` explicitly (SFMC requires this)
app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'config.json'));
});

// ✅ Serve `customActivity.js`
app.get('/js/customActivity.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/js/customActivity.js'));
});

// Import routes for Journey activity
const journeyRoutes = require('./routes/journey');
app.use('/journey', journeyRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
