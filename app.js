require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Default route should serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Journey routes
const journeyRoutes = require('./routes/journey');
app.use('/journey', journeyRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
