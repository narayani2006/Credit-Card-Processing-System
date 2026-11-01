const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from root or backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const connectDB = require('./config/db');
const seedAdminAccount = require('./utils/seedAdmin');

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'PayFlow Credit Card Processing API',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminAccount();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` PayFlow Backend API running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Admin Email: ${process.env.ADMIN_EMAIL || 'admin@example.com'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
  }
};

startServer();
