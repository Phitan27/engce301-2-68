const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
const booksRouter = require('./routes/books.route');
const membersRouter = require('./routes/members.route');
const borrowingsRouter = require('./routes/borrowings.route');

app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/borrowings', borrowingsRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Library Management System API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            members: '/api/members',
            borrowings: '/api/borrowings'
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('📚 Library Management System API');
    console.log('='.repeat(60));
    console.log(`Server: http://localhost:${PORT}`);
    console.log('='.repeat(60));
});