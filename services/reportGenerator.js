const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class ReportGenerator {
  static async generatePDF(scenarioData, userEmail) {
    try {
      // Create reports directory if it doesn't exist
      const reportsDir = path.join(__dirname, '..', 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      // Generate HTML content
      const htmlContent = this.generateHTMLReport(scenarioData, userEmail);
      
      // Launch puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `roi-report-${scenarioData.scenario_name || 'simulation'}-${timestamp}.pdf`;
      const filepath = path.join(reportsDir, filename);
      
      await page.pdf({
        path: filepath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();
      
      return {
        filename,
        filepath,
        success: true
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  static generateHTMLReport(data, userEmail) {
    const { results } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoicing ROI Analysis Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #007acc;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #007acc;
            margin: 0;
            font-size: 28px;
        }
        
        .header p {
            color: #666;
            margin: 10px 0;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        
        .metric-card {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .metric-card h3 {
            margin: 0 0 10px 0;
            color: #007acc;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
        }
        
        .input-section, .breakdown-section {
            background: #fff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .section-title {
            color: #007acc;
            border-bottom: 2px solid #007acc;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .input-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .input-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .input-label {
            font-weight: 500;
            color: #555;
        }
        
        .input-value {
            font-weight: bold;
            color: #333;
        }
        
        .highlights {
            background: linear-gradient(135deg, #007acc, #0056b3);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .highlights h3 {
            margin: 0 0 15px 0;
            font-size: 20px;
        }
        
        .highlights ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .highlights li {
            margin: 8px 0;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
            font-size: 12px;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 10px;
            }
            
            .summary-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            
            .metric-card {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Invoicing ROI Analysis Report</h1>
        <p><strong>Scenario:</strong> ${data.scenario_name || 'Custom Simulation'}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${userEmail}</p>
    </div>

    <div class="highlights">
        <h3>🎯 Key Benefits of Automation</h3>
        <ul>
            <li><strong>Monthly Savings:</strong> $${results.monthly_savings.toLocaleString()}</li>
            <li><strong>Payback Period:</strong> ${results.payback_months} months</li>
            <li><strong>ROI over ${data.time_horizon_months} months:</strong> ${results.roi_percentage}%</li>
            <li><strong>Hours Saved Monthly:</strong> ${results.hours_saved_per_month} hours</li>
        </ul>
    </div>

    <div class="summary-grid">
        <div class="metric-card">
            <h3>Monthly Savings</h3>
            <div class="metric-value">$${results.monthly_savings.toLocaleString()}</div>
        </div>
        <div class="metric-card">
            <h3>Annual Savings</h3>
            <div class="metric-value">$${results.annual_savings.toLocaleString()}</div>
        </div>
        <div class="metric-card">
            <h3>Payback Period</h3>
            <div class="metric-value">${results.payback_months} mo</div>
        </div>
        <div class="metric-card">
            <h3>ROI Percentage</h3>
            <div class="metric-value">${results.roi_percentage}%</div>
        </div>
    </div>

    <div class="input-section">
        <h2 class="section-title">📊 Input Parameters</h2>
        <div class="input-grid">
            <div class="input-item">
                <span class="input-label">Monthly Invoice Volume:</span>
                <span class="input-value">${data.monthly_invoice_volume.toLocaleString()}</span>
            </div>
            <div class="input-item">
                <span class="input-label">AP Staff Count:</span>
                <span class="input-value">${data.num_ap_staff}</span>
            </div>
            <div class="input-item">
                <span class="input-label">Hours per Invoice:</span>
                <span class="input-value">${data.avg_hours_per_invoice}</span>
            </div>
            <div class="input-item">
                <span class="input-label">Hourly Wage:</span>
                <span class="input-value">$${data.hourly_wage}</span>
            </div>
            <div class="input-item">
                <span class="input-label">Manual Error Rate:</span>
                <span class="input-value">${data.error_rate_manual}%</span>
            </div>
            <div class="input-item">
                <span class="input-label">Error Cost:</span>
                <span class="input-value">$${data.error_cost}</span>
            </div>
            <div class="input-item">
                <span class="input-label">Time Horizon:</span>
                <span class="input-value">${data.time_horizon_months} months</span>
            </div>
            <div class="input-item">
                <span class="input-label">Implementation Cost:</span>
                <span class="input-value">$${data.one_time_implementation_cost?.toLocaleString() || '0'}</span>
            </div>
        </div>
    </div>

    <div class="breakdown-section">
        <h2 class="section-title">💡 Cost Breakdown</h2>
        <div class="input-grid">
            <div class="input-item">
                <span class="input-label">Current Manual Labor Cost:</span>
                <span class="input-value">$${results.breakdown.labor_cost_manual.toLocaleString()}/month</span>
            </div>
            <div class="input-item">
                <span class="input-label">Automation Cost:</span>
                <span class="input-value">$${results.breakdown.auto_cost.toLocaleString()}/month</span>
            </div>
            <div class="input-item">
                <span class="input-label">Error Reduction Savings:</span>
                <span class="input-value">$${results.breakdown.error_savings.toLocaleString()}/month</span>
            </div>
            <div class="input-item">
                <span class="input-label">Net Monthly Benefit:</span>
                <span class="input-value">$${results.monthly_savings.toLocaleString()}</span>
            </div>
        </div>
    </div>

    <div class="highlights">
        <h3>🚀 Why Automate Now?</h3>
        <ul>
            <li>Reduce manual processing time by 80%</li>
            <li>Minimize human errors and associated costs</li>
            <li>Free up staff for higher-value activities</li>
            <li>Improve cash flow with faster processing</li>
            <li>Scale operations without proportional headcount increases</li>
        </ul>
    </div>

    <div class="footer">
        <p>This analysis is based on your provided inputs and industry-standard automation benefits.</p>
        <p>Generated by Invoicing ROI Simulator | ${new Date().getFullYear()}</p>
    </div>
</body>
</html>`;
  }
}

module.exports = ReportGenerator;