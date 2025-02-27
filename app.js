require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const journeyRoutes = require('./routes/journey');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve `config.json` correctly
app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'config.json'));
});

// Ensure images load properly
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Serve JS files correctly
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Serve `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Routes
app.use('/journey', journeyRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
