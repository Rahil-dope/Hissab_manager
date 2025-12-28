const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: 'student-expense-tracker-secret-key', // Change this in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Routes Placeholder
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/expenses', expenseRoutes);

const reportRoutes = require('./src/routes/reportRoutes');
const incomeRoutes = require('./src/routes/incomeRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');
const userRoutes = require('./src/routes/userRoutes');
app.use('/reports', reportRoutes);
app.use('/incomes', incomeRoutes);
app.use('/budgets', budgetRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
