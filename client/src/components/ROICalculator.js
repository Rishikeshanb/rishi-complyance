import React, { useState, useEffect } from 'react';

const ROICalculator = ({ onCalculation, initialData, onScenarioSaved }) => {
  const [formData, setFormData] = useState({
    scenario_name: '',
    monthly_invoice_volume: 2000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.17,
    hourly_wage: 30,
    error_rate_manual: 0.5,
    error_cost: 100,
    time_horizon_months: 36,
    one_time_implementation_cost: 50000
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Update form when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onCalculation(data.results, formData);
        setMessage({ type: 'success', text: 'Calculation completed successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Calculation failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async (e) => {
    e.preventDefault();
    
    if (!formData.scenario_name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a scenario name' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onCalculation(data.results, formData);
        onScenarioSaved();
        setMessage({ type: 'success', text: 'Scenario saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save scenario' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roi-calculator">
      <h2>💡 ROI Calculator</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="calculator-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="scenario_name">Scenario Name</label>
            <input
              type="text"
              id="scenario_name"
              name="scenario_name"
              value={formData.scenario_name}
              onChange={handleInputChange}
              placeholder="e.g., Q4_Pilot"
            />
          </div>

          <div className="form-group">
            <label htmlFor="monthly_invoice_volume">Monthly Invoice Volume</label>
            <input
              type="number"
              id="monthly_invoice_volume"
              name="monthly_invoice_volume"
              value={formData.monthly_invoice_volume}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="num_ap_staff">Number of AP Staff</label>
            <input
              type="number"
              id="num_ap_staff"
              name="num_ap_staff"
              value={formData.num_ap_staff}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="avg_hours_per_invoice">Average Hours per Invoice</label>
            <input
              type="number"
              id="avg_hours_per_invoice"
              name="avg_hours_per_invoice"
              value={formData.avg_hours_per_invoice}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
            <small>e.g., 0.17 for 10 minutes</small>
          </div>

          <div className="form-group">
            <label htmlFor="hourly_wage">Hourly Wage ($)</label>
            <input
              type="number"
              id="hourly_wage"
              name="hourly_wage"
              value={formData.hourly_wage}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="error_rate_manual">Manual Error Rate (%)</label>
            <input
              type="number"
              id="error_rate_manual"
              name="error_rate_manual"
              value={formData.error_rate_manual}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="error_cost">Cost per Error ($)</label>
            <input
              type="number"
              id="error_cost"
              name="error_cost"
              value={formData.error_cost}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time_horizon_months">Time Horizon (months)</label>
            <input
              type="number"
              id="time_horizon_months"
              name="time_horizon_months"
              value={formData.time_horizon_months}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group span-2">
            <label htmlFor="one_time_implementation_cost">One-time Implementation Cost ($)</label>
            <input
              type="number"
              id="one_time_implementation_cost"
              name="one_time_implementation_cost"
              value={formData.one_time_implementation_cost}
              onChange={handleInputChange}
              min="0"
            />
          </div>
        </div>

        <div className="button-group">
          <button
            type="submit"
            onClick={handleSimulate}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '⏳ Calculating...' : '🧮 Calculate ROI'}
          </button>

          <button
            type="button"
            onClick={handleSaveScenario}
            disabled={loading || !formData.scenario_name.trim()}
            className="btn btn-secondary"
          >
            {loading ? '⏳ Saving...' : '💾 Save Scenario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ROICalculator;