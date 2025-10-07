# Invoicing ROI Simulator

A lightweight ROI calculator that helps users visualize cost savings and payback when switching from manual to automated invoicing.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Local Development Setup

1. **Clone or download the project** to your local machine

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Build the frontend:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Open your browser** and navigate to `http://localhost:3001`

## 🌐 Hosting Options

### Option 1: Railway (Recommended - Free Tier Available)

Railway offers the easiest deployment with automatic database setup.

1. **Sign up at [railway.app](https://railway.app)**

2. **Connect your GitHub repository**

3. **Deploy with one click** - Railway will automatically:
   - Detect Node.js project
   - Install dependencies
   - Build the frontend
   - Start the server
   - Provide a public URL

4. **Environment Variables (if needed):**
   ```
   PORT=3001
   NODE_ENV=production
   ```

### Option 2: Render (Free Tier Available)

1. **Sign up at [render.com](https://render.com)**

2. **Create a new Web Service**

3. **Connect your GitHub repository**

4. **Configure deployment:**
   ```
   Build Command: npm install && cd client && npm install && npm run build
   Start Command: npm start
   ```

5. **Environment Variables:**
   ```
   NODE_ENV=production
   ```

### Option 3: Heroku

1. **Install Heroku CLI**

2. **Login and create app:**
   ```bash
   heroku login
   heroku create your-roi-simulator
   ```

3. **Add buildpack:**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy ROI Simulator"
   git push heroku main
   ```

### Option 4: Vercel (Frontend Only)

For static hosting, you can deploy just the React build:

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   cd build
   vercel
   ```

### Option 5: DigitalOcean App Platform

1. **Sign up at [digitalocean.com](https://digitalocean.com)**

2. **Create new App**

3. **Connect GitHub repository**

4. **Configure app:**
   ```
   Name: roi-simulator
   Source Directory: /
   Build Command: npm install && cd client && npm install && npm run build
   Run Command: npm start
   HTTP Port: 3001
   ```

### Option 6: AWS EC2 (Advanced)

1. **Launch EC2 instance** (Ubuntu 22.04 recommended)

2. **Connect via SSH and setup:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Clone your project
   git clone <your-repo-url>
   cd invoicing-roi-simulator
   
   # Install dependencies and build
   npm install
   cd client && npm install && npm run build && cd ..
   
   # Start with PM2
   pm2 start server.js --name "roi-simulator"
   pm2 startup
   pm2 save
   ```

3. **Configure security group** to allow HTTP traffic on port 3001

### Option 7: Local Network Access

To access your locally running app from other devices on your network:

1. **Find your local IP address:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Update server.js to bind to all interfaces:**
   ```javascript
   app.listen(port, '0.0.0.0', () => {
     console.log(`Server running on port ${port}`);
   });
   ```

3. **Access from other devices:** `http://YOUR_LOCAL_IP:3001`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=production
DATABASE_PATH=./data/roi_simulator.db
```

### Custom Domain

After deploying, you can configure a custom domain:

1. **Purchase domain** from any registrar
2. **Add CNAME record** pointing to your hosting platform's URL
3. **Configure SSL** (most platforms provide this automatically)

## 📊 Database

The app uses SQLite by default, which works well for small to medium applications. The database file is automatically created at `./data/roi_simulator.db`.

For production with higher traffic, consider:
- PostgreSQL (supported by Railway, Render, Heroku)
- MySQL
- MongoDB

## 🔒 Security Considerations

For production deployment:

1. **Enable HTTPS** (most hosting platforms provide this)
2. **Add rate limiting** to prevent abuse
3. **Validate all inputs** server-side
4. **Regular backups** of database
5. **Monitor application** for errors and performance

## 🚀 Performance Optimization

1. **Enable gzip compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add caching headers** for static assets

3. **Use CDN** for global distribution

4. **Monitor with tools** like New Relic or DataDog

## 📈 Analytics & Monitoring

Consider adding:
- Google Analytics for user tracking
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)

## 🏗️ Project Structure

```
invoicing-roi-simulator/
├── server.js              # Express backend server
├── package.json           # Backend dependencies
├── scenarios.db           # SQLite database (auto-created)
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## 🧪 Testing the Application

### 1. Quick Simulation Test
- Open the app at `http://localhost:3000`
- The form should be pre-filled with sample data
- Results should appear automatically showing positive ROI
- Try changing input values to see live calculations

### 2. Scenario Management Test
- Enter a scenario name (e.g., "Test_Scenario")
- Click "Save Scenario"
- Verify the scenario appears in the "Saved Scenarios" section
- Click "Load" to reload the scenario

### 3. Report Generation Test
- Save a scenario first
- Enter your email in the report section
- Click "Download Report"
- A PDF should be generated and downloaded

### 4. API Testing (Optional)
You can test the API endpoints directly:

```bash
# Test simulation endpoint
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "monthly_invoice_volume": 2000,
    "num_ap_staff": 3,
    "avg_hours_per_invoice": 0.17,
    "hourly_wage": 30,
    "error_rate_manual": 0.5,
    "error_cost": 100,
    "time_horizon_months": 36,
    "one_time_implementation_cost": 50000
  }'

# List saved scenarios
curl http://localhost:5000/api/scenarios
```

## 📊 Sample Results

With the default inputs, you should see approximately:
- **Monthly Savings:** $8,000+
- **Payback Period:** ~6 months
- **ROI (36 months):** >400%

## 🔧 Configuration

### Internal Constants (Server-side)
The following constants ensure favorable results and are configured in `server.js`:

- `AUTOMATED_COST_PER_INVOICE`: $0.20
- `ERROR_RATE_AUTO`: 0.1%
- `MIN_ROI_BOOST_FACTOR`: 1.1 (ensures 10% minimum boost to results)

### Database
- Uses SQLite for simplicity (file: `scenarios.db`)
- Automatically created on first run
- Stores scenario inputs and calculated results

## 🚢 Deployment Options

### Local Development
Already configured! Just run `npm start` and `cd client && npm start`

### Production Deployment

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Start production server:**
   ```bash
   NODE_ENV=production npm start
   ```

3. **Deploy to platforms like:**
   - Heroku: Push to Heroku with the provided `package.json` scripts
   - Railway: Connect your Git repository
   - DigitalOcean App Platform: Deploy directly from Git

## 📋 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/simulate` | Run simulation and return JSON results |
| POST | `/api/scenarios` | Save a scenario |
| GET | `/api/scenarios` | List all scenarios |
| GET | `/api/scenarios/:id` | Retrieve scenario details |
| POST | `/api/report/generate` | Generate a PDF report (email required) |

## 🎯 Features Implemented

✅ **Quick Simulation:** Live ROI calculation with instant results  
✅ **Scenario Management:** Save, load, and manage multiple scenarios  
✅ **Report Generation:** PDF reports with email gating  
✅ **Favorable Output Logic:** Built-in bias ensures positive ROI  
✅ **Responsive Design:** Works on desktop and mobile  
✅ **REST API:** Complete backend API for all operations  
✅ **Database Persistence:** SQLite for reliable data storage  

## ⚙️ Input Parameters

| Field | Description | Example |
|-------|-------------|---------|
| Scenario Name | Label for saved scenario | Q4_Pilot |
| Monthly Invoice Volume | Invoices processed per month | 2000 |
| Number of AP Staff | Staff managing invoicing | 3 |
| Average Hours per Invoice | Manual hours per invoice | 0.17 (10 mins) |
| Hourly Wage | Average cost per hour | $30 |
| Manual Error Rate | Estimated manual error rate (%) | 0.5% |
| Cost per Error | Cost to fix each error | $100 |
| Time Horizon | Projection period (months) | 36 |
| Implementation Cost | One-time setup cost | $50,000 |

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts:** 
   - Backend uses port 5000, frontend uses 3000
   - Change ports in package.json if needed

2. **Database errors:**
   - Delete `scenarios.db` file to reset database
   - Ensure write permissions in project directory

3. **PDF generation fails:**
   - Puppeteer requires additional dependencies on some systems
   - Install: `sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`

4. **React build issues:**
   - Delete `client/node_modules` and run `npm install` again
   - Ensure you're using Node.js version 16+

### Development Mode
For development with hot reloading:
```bash
# Terminal 1: Backend with nodemon
npm run dev

# Terminal 2: Frontend with React dev server
cd client
npm start
```

## 📝 License

This project is licensed under the MIT License - see the package.json file for details.

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section above
2. Verify all dependencies are installed correctly
3. Ensure both backend and frontend servers are running
4. Check browser console for any JavaScript errors

---

**Total Development Time:** 3 hours  
**Tech Stack:** Node.js, Express, React, SQLite, Puppeteer  
**Status:** ✅ Ready for demo and production use#   C o m p l y a n c e - t a s k  
 #   C o m p l y a n c e - t a s k  
 