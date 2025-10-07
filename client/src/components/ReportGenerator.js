import React, { useState } from 'react';

const ReportGenerator = ({ scenarioData, results }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [reportUrl, setReportUrl] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          scenarioData: {
            ...scenarioData,
            results: results
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReportUrl(`/api/report/download/${data.filename}`);
        setMessage({ 
          type: 'success', 
          text: 'Report generated successfully! Your download will start automatically.' 
        });
        
        // Trigger download
        const link = document.createElement('a');
        link.href = `/api/report/download/${data.filename}`;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate report' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="report-generator">
      <h2>📄 Generate ROI Report</h2>
      
      <div className="report-preview">
        <h3>Report Preview</h3>
        <div className="preview-card">
          <div className="preview-header">
            <h4>🧮 Invoicing ROI Analysis Report</h4>
            <p><strong>Scenario:</strong> {scenarioData?.scenario_name || 'Custom Simulation'}</p>
          </div>
          
          <div className="preview-highlights">
            <h5>🎯 Key Benefits of Automation</h5>
            <ul>
              <li><strong>Monthly Savings:</strong> {formatCurrency(results.monthly_savings)}</li>
              <li><strong>Payback Period:</strong> {results.payback_months} months</li>
              <li><strong>ROI over {scenarioData?.time_horizon_months} months:</strong> {results.roi_percentage}%</li>
              <li><strong>Hours Saved Monthly:</strong> {results.hours_saved_per_month} hours</li>
            </ul>
          </div>

          <div className="preview-metrics">
            <div className="metric-row">
              <span>Monthly Savings:</span>
              <strong>{formatCurrency(results.monthly_savings)}</strong>
            </div>
            <div className="metric-row">
              <span>Annual Savings:</span>
              <strong>{formatCurrency(results.annual_savings)}</strong>
            </div>
            <div className="metric-row">
              <span>Payback Period:</span>
              <strong>{results.payback_months} months</strong>
            </div>
            <div className="metric-row">
              <span>ROI Percentage:</span>
              <strong>{results.roi_percentage}%</strong>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="report-form">
        <h3>📧 Generate PDF Report</h3>
        <p>Enter your email address to receive a detailed PDF report of this ROI analysis.</p>
        
        <form onSubmit={handleGenerateReport}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
              className="email-input"
            />
            <small>We'll use this email for lead capture and to associate with your report.</small>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn btn-primary generate-btn"
          >
            {loading ? '⏳ Generating Report...' : '📄 Generate PDF Report'}
          </button>
        </form>

        {reportUrl && (
          <div className="download-section">
            <p>✅ Report generated successfully!</p>
            <a 
              href={reportUrl}
              className="btn btn-secondary"
              download
            >
              📥 Download Report Again
            </a>
          </div>
        )}
      </div>

      <div className="report-info">
        <h4>What's included in the report?</h4>
        <ul>
          <li>Complete ROI analysis with all input parameters</li>
          <li>Detailed cost breakdown and savings calculations</li>
          <li>Professional formatting suitable for presentations</li>
          <li>Key benefits and automation advantages</li>
          <li>Implementation recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportGenerator;