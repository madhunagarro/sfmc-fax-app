require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const journeyRoutes = require('./routes/journey');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serves static files like index.html

// Routes
app.use('/journey', journeyRoutes);

// Ensure `config.json` is accessible
app.get('/config.json', (req, res) => {
    res.sendFile(__dirname + '/config.json');
});

// Ensure images load properly
app.use('/images', express.static(__dirname + '/public/images'));

// Default Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
