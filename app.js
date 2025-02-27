const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ✅ Serve static files (index.html, config.json, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Register journey activity routes
const journeyRoutes = require('./routes/journey');
app.use('/journey', journeyRoutes);

// ✅ Default route (Serves index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Serve config.json properly
app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'config.json'));
});

// ✅ Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
