import React, { useState } from 'react';

const ScenarioManager = ({ scenarios, onScenarioLoaded, onScenariosChanged }) => {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleLoadScenario = (scenario) => {
    onScenarioLoaded(scenario);
    setMessage({ type: 'success', text: `Scenario "${scenario.scenario_name}" loaded successfully!` });
  };

  const handleDeleteScenario = async (scenarioId, scenarioName) => {
    if (!window.confirm(`Are you sure you want to delete "${scenarioName}"?`)) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/scenarios/${scenarioId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onScenariosChanged();
        setMessage({ type: 'success', text: `Scenario "${scenarioName}" deleted successfully!` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete scenario' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scenario-manager">
      <h2>💾 Saved Scenarios</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {scenarios.length === 0 ? (
        <div className="empty-state">
          <p>No saved scenarios yet. Create and save your first scenario in the Calculator tab!</p>
        </div>
      ) : (
        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="scenario-card">
              <div className="scenario-header">
                <h3>{scenario.scenario_name}</h3>
                <div className="scenario-actions">
                  <button
                    onClick={() => handleLoadScenario(scenario)}
                    className="btn btn-sm btn-primary"
                    title="Load this scenario"
                  >
                    📂 Load
                  </button>
                  <button
                    onClick={() => handleDeleteScenario(scenario.id, scenario.scenario_name)}
                    disabled={loading}
                    className="btn btn-sm btn-danger"
                    title="Delete this scenario"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="scenario-summary">
                <div className="summary-item">
                  <span className="summary-label">Monthly Volume:</span>
                  <span className="summary-value">{scenario.monthly_invoice_volume.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">AP Staff:</span>
                  <span className="summary-value">{scenario.num_ap_staff}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time Horizon:</span>
                  <span className="summary-value">{scenario.time_horizon_months} months</span>
                </div>
              </div>

              <div className="scenario-results">
                <div className="result-highlight">
                  <div className="result-main">
                    <span className="result-amount">{formatCurrency(scenario.results.monthly_savings)}</span>
                    <span className="result-label">Monthly Savings</span>
                  </div>
                  <div className="result-secondary">
                    <span>ROI: {scenario.results.roi_percentage.toFixed(1)}%</span>
                    <span>Payback: {scenario.results.payback_months} mo</span>
                  </div>
                </div>
              </div>

              <div className="scenario-footer">
                <small>
                  Created: {new Date(scenario.created_at).toLocaleDateString()}
                  {scenario.updated_at !== scenario.created_at && (
                    <> | Updated: {new Date(scenario.updated_at).toLocaleDateString()}</>
                  )}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;