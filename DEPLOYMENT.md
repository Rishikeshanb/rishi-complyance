# 🚀 ROI Simulator - Complete Hosting Guide

This guide will walk you through deploying your Invoicing ROI Simulator to various hosting platforms.

## 🎯 Recommended: Railway Deployment (Easiest)

Railway is the most beginner-friendly option with automatic deployments.

### Step 1: Prepare Your Code

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/roi-simulator.git
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. **Visit [railway.app](https://railway.app)**
2. **Sign up** using your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your roi-simulator repository**
6. **Railway will automatically:**
   - Detect it's a Node.js project
   - Install dependencies
   - Build the frontend
   - Start the server
   - Provide a public URL

### Step 3: Configure (if needed)

Railway usually works out of the box, but you can add environment variables:
- Go to your project dashboard
- Click "Variables"
- Add: `PORT=3001`

**Your app will be live at:** `https://your-app-name.up.railway.app`

---

## 🌊 Alternative: Render Deployment

### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository

### Step 3: Configure
```
Name: roi-simulator
Environment: Node
Region: Choose closest to your users
Branch: main
Build Command: npm install && cd client && npm install && npm run build
Start Command: npm start
```

### Step 4: Environment Variables
- `NODE_ENV`: `production`

---

## ⚡ Quick Deploy Scripts

I've included helpful scripts in your project:

### Build Everything
```bash
npm run setup:full
```

### Start Production Server
```bash
npm run start:production
```

---

## 🌐 Custom Domain Setup

After deploying, you can use your own domain:

### For Railway:
1. Go to your project dashboard
2. Click "Settings"
3. Under "Domains", click "Custom Domain"
4. Enter your domain (e.g., `roi-calculator.yourcompany.com`)
5. Add the CNAME record to your DNS:
   - Type: `CNAME`
   - Name: `roi-calculator` (or whatever subdomain you want)
   - Value: `your-app-name.up.railway.app`

### For Render:
1. Go to your service dashboard
2. Click "Settings"
3. Under "Custom Domains", add your domain
4. Update your DNS with the provided CNAME

---

## 📱 Testing Your Deployment

### Basic Functionality Test
1. **Visit your deployed URL**
2. **Test the calculator:**
   - Enter sample data
   - Click "Calculate ROI"
   - Verify results appear
3. **Test scenario saving:**
   - Enter a scenario name
   - Click "Save Scenario"
   - Check the Scenarios tab
4. **Test report generation:**
   - Go to Report tab
   - Enter an email
   - Generate PDF report

### API Endpoints Test
Your API should be available at:
- `https://your-app.com/api/health` - Health check
- `https://your-app.com/api/simulate` - ROI calculation
- `https://your-app.com/api/scenarios` - Scenario management

---

## 🔧 Troubleshooting Common Issues

### Build Fails
**Error:** `npm ERR! peer dep missing`
**Solution:** 
```bash
cd client
npm install --legacy-peer-deps
npm run build
```

### Server Won't Start
**Error:** `Cannot find module`
**Solution:** Ensure all dependencies are installed:
```bash
npm install
cd client && npm install
```

### Database Issues
**Error:** `SQLITE_CANTOPEN`
**Solution:** The app will automatically create the database directory. If issues persist, check file permissions.

### Port Already in Use
**Error:** `EADDRINUSE: address already in use`
**Solution:** Change the port in your environment variables or stop the conflicting process.

---

## 📊 Monitoring Your App

### Basic Monitoring
- **Railway:** Built-in metrics and logs
- **Render:** Application logs and metrics
- **Heroku:** Add-ons like New Relic

### Custom Monitoring
Add these to your server.js for better monitoring:

```javascript
// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Add error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## 🚀 Going Live Checklist

- [ ] **Code pushed to GitHub**
- [ ] **App deployed and accessible**
- [ ] **All features tested:**
  - [ ] ROI calculation works
  - [ ] Scenarios can be saved/loaded
  - [ ] PDF reports generate
- [ ] **Custom domain configured (optional)**
- [ ] **SSL certificate active (automatic on most platforms)**
- [ ] **Error monitoring setup**
- [ ] **Backup strategy in place**

---

## 🎉 Success!

Once deployed, your ROI Simulator will be available 24/7 at your custom URL. Share it with your team and customers to demonstrate the value of automation!

### Next Steps:
1. **Share the URL** with stakeholders
2. **Gather feedback** from users
3. **Monitor usage** and performance
4. **Consider adding features** like user authentication, email notifications, or advanced analytics

**Need help?** Check the troubleshooting section or create an issue in your GitHub repository.