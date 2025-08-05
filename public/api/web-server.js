const express = require('express');
const path = require('path');
const app = express();

// Serve static files từ public directory
app.use(express.static(path.join(__dirname, '../')));

// Route cho trang chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Route cho các trang
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/contact.html'));
});

app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, '../debug-contact.html'));
});

app.get('/simple-test', (req, res) => {
    res.sendFile(path.join(__dirname, '../simple-contact-test.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🌐 SHRIMPTECH Web Server running on http://localhost:${PORT}`);
    console.log(`📧 Email API Server should be running on http://localhost:3001`);
    console.log('');
    console.log('Available pages:');
    console.log(`  🏠 Home: http://localhost:${PORT}`);
    console.log(`  📞 Contact: http://localhost:${PORT}/contact`);
    console.log(`  🔍 Debug: http://localhost:${PORT}/debug`);
    console.log(`  🧪 Simple Test: http://localhost:${PORT}/simple-test`);
});
