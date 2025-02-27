require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from public folder

// Import routes
const journeyRoutes = require('./routes/journey');
app.use('/journey', journeyRoutes);

// Default route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Config file endpoint (Required for SFMC)
app.get('/config.json', (req, res) => {
    res.json(require('./config.json'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
