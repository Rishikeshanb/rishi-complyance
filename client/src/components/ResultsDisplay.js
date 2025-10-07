import React from 'react';

const ResultsDisplay = ({ results }) => {
  if (!results) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <div className="results-display">
      <h2>📈 ROI Analysis Results</h2>
      
      <div className="results-grid">
        <div className="result-card primary">
          <h3>Monthly Savings</h3>
          <div className="result-value">{formatCurrency(results.monthly_savings)}</div>
          <p>Money saved every month with automation</p>
        </div>

        <div className="result-card">
          <h3>Annual Savings</h3>
          <div className="result-value">{formatCurrency(results.annual_savings)}</div>
          <p>Total savings in the first year</p>
        </div>

        <div className="result-card">
          <h3>Payback Period</h3>
          <div className="result-value">{results.payback_months} mo</div>
          <p>Time to recover implementation cost</p>
        </div>

        <div className="result-card success">
          <h3>ROI Percentage</h3>
          <div className="result-value">{formatPercentage(results.roi_percentage)}</div>
          <p>Return on investment over time horizon</p>
        </div>

        <div className="result-card">
          <h3>Hours Saved Monthly</h3>
          <div className="result-value">{results.hours_saved_per_month}h</div>
          <p>Staff time freed up each month</p>
        </div>

        <div className="result-card">
          <h3>Net Savings</h3>
          <div className="result-value">{formatCurrency(results.net_savings)}</div>
          <p>Total benefit after all costs</p>
        </div>
      </div>

      <div className="breakdown-section">
        <h3>💡 Cost Breakdown</h3>
        <div className="breakdown-grid">
          <div className="breakdown-item">
            <span className="breakdown-label">Current Manual Labor Cost:</span>
            <span className="breakdown-value">{formatCurrency(results.breakdown.labor_cost_manual)}/month</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Automation Cost:</span>
            <span className="breakdown-value">{formatCurrency(results.breakdown.auto_cost)}/month</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Error Reduction Savings:</span>
            <span className="breakdown-value">{formatCurrency(results.breakdown.error_savings)}/month</span>
          </div>
          <div className="breakdown-item total">
            <span className="breakdown-label">Net Monthly Benefit:</span>
            <span className="breakdown-value">{formatCurrency(results.monthly_savings)}</span>
          </div>
        </div>
      </div>

      <div className="benefits-section">
        <h3>🚀 Key Benefits of Automation</h3>
        <ul className="benefits-list">
          <li>Reduce manual processing time by 80%</li>
          <li>Minimize human errors and associated costs</li>
          <li>Free up staff for higher-value activities</li>
          <li>Improve cash flow with faster processing</li>
          <li>Scale operations without proportional headcount increases</li>
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay;