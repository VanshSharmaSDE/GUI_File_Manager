const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const fileRoutes = require('./routes/fileRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'File Management API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/files', fileRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`📁 Workspace root: ${config.workspaceRoot}`);
  console.log(`📂 All folders in workspace will be scanned dynamically`);
});

module.exports = app;
