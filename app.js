require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const journeyRoutes = require('./routes/journey');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// API Routes
app.use('/journey', journeyRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('SFMC Custom Journey Activity - Retarus Fax Integration');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
