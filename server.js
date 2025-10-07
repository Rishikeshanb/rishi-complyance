const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./models/database');
const ROICalculator = require('./services/roiCalculator');
const ReportGenerator = require('./services/reportGenerator');

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'client/build')));

// Request logging for production
if (isProduction) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
    next();
  });
}

// Rate limiting for production (simple implementation)
const requestCounts = new Map();
const RATE_LIMIT = 100; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

app.use((req, res, next) => {
  if (!isProduction) return next();
  
  const ip = req.ip;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }
  
  const ipData = requestCounts.get(ip);
  
  if (now > ipData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }
  
  if (ipData.count >= RATE_LIMIT) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  ipData.count++;
  next();
});

// Initialize database on startup
async function initializeServer() {
  try {
    await db.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// POST /simulate - Run simulation and return JSON results
app.post('/api/simulate', async (req, res) => {
  try {
    const {
      scenario_name,
      monthly_invoice_volume,
      num_ap_staff,
      avg_hours_per_invoice,
      hourly_wage,
      error_rate_manual,
      error_cost,
      time_horizon_months,
      one_time_implementation_cost
    } = req.body;

    // Validate inputs
    const validationErrors = ROICalculator.validate(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    // Calculate ROI
    const results = ROICalculator.calculate(req.body);

    // Return results
    res.json({
      success: true,
      inputs: req.body,
      results
    });
  } catch (error) {
    console.error('Error in /simulate:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error.message
    });
  }
});

// POST /scenarios - Save a scenario
app.post('/api/scenarios', async (req, res) => {
  try {
    const {
      scenario_name,
      monthly_invoice_volume,
      num_ap_staff,
      avg_hours_per_invoice,
      hourly_wage,
      error_rate_manual,
      error_cost,
      time_horizon_months,
      one_time_implementation_cost
    } = req.body;

    // Validate inputs
    const validationErrors = ROICalculator.validate(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    if (!scenario_name || scenario_name.trim() === '') {
      return res.status(400).json({
        error: 'Scenario name is required'
      });
    }

    // Calculate results
    const results = ROICalculator.calculate(req.body);

    // Save to database
    const savedScenario = await db.saveScenario({
      ...req.body,
      results
    });

    res.json({
      success: true,
      scenario: savedScenario,
      results
    });
  } catch (error) {
    console.error('Error saving scenario:', error);
    res.status(500).json({
      error: 'Failed to save scenario',
      message: error.message
    });
  }
});

// GET /scenarios - List all scenarios
app.get('/api/scenarios', async (req, res) => {
  try {
    const scenarios = await db.getAllScenarios();
    res.json({
      success: true,
      scenarios
    });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({
      error: 'Failed to fetch scenarios',
      message: error.message
    });
  }
});

// GET /scenarios/:id - Retrieve scenario details
app.get('/api/scenarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scenario = await db.getScenarioById(id);
    
    if (!scenario) {
      return res.status(404).json({
        error: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      scenario
    });
  } catch (error) {
    console.error('Error fetching scenario:', error);
    res.status(500).json({
      error: 'Failed to fetch scenario',
      message: error.message
    });
  }
});

// DELETE /scenarios/:id - Delete a scenario
app.delete('/api/scenarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.deleteScenario(id);
    
    if (result.deletedRows === 0) {
      return res.status(404).json({
        error: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting scenario:', error);
    res.status(500).json({
      error: 'Failed to delete scenario',
      message: error.message
    });
  }
});

// POST /report/generate - Generate a PDF report (email required)
app.post('/api/report/generate', async (req, res) => {
  try {
    const { email, scenarioData } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Valid email address is required'
      });
    }

    if (!scenarioData) {
      return res.status(400).json({
        error: 'Scenario data is required'
      });
    }

    // Generate PDF report
    const reportResult = await ReportGenerator.generatePDF(scenarioData, email);

    res.json({
      success: true,
      message: 'Report generated successfully',
      filename: reportResult.filename
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      error: 'Failed to generate report',
      message: error.message
    });
  }
});

// Serve static files for PDF reports
app.get('/api/report/download/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, 'reports', filename);
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        error: 'Report not found'
      });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({
          error: 'Failed to download report'
        });
      }
    });
  } catch (error) {
    console.error('Error serving report:', error);
    res.status(500).json({
      error: 'Failed to serve report',
      message: error.message
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong' : error.message
  });
});

// Health check for hosting platforms
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  db.close();
  process.exit(0);
});

// Start server
initializeServer().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 ROI Simulator server running on port ${port}`);
    console.log(`📊 API available at http://localhost:${port}/api`);
    console.log(`🌐 Frontend available at http://localhost:${port}`);
    console.log(`🏭 Environment: ${isProduction ? 'production' : 'development'}`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});