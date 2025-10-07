// Internal constants (server-side only)
const CONSTANTS = {
  AUTOMATED_COST_PER_INVOICE: 0.20,
  ERROR_RATE_AUTO: 0.001, // 0.1%
  TIME_SAVED_PER_INVOICE_MINUTES: 8,
  MIN_ROI_BOOST_FACTOR: 1.1
};

class ROICalculator {
  static calculate(inputs) {
    const {
      monthly_invoice_volume,
      num_ap_staff,
      avg_hours_per_invoice,
      hourly_wage,
      error_rate_manual,
      error_cost,
      time_horizon_months,
      one_time_implementation_cost = 0
    } = inputs;

    // Validate inputs
    if (!monthly_invoice_volume || !num_ap_staff || !avg_hours_per_invoice || 
        !hourly_wage || error_rate_manual === undefined || !error_cost || 
        !time_horizon_months) {
      throw new Error('Missing required calculation inputs');
    }

    // 1. Manual labor cost per month
    const labor_cost_manual = num_ap_staff * hourly_wage * avg_hours_per_invoice * monthly_invoice_volume;

    // 2. Automation cost per month
    const auto_cost = monthly_invoice_volume * CONSTANTS.AUTOMATED_COST_PER_INVOICE;

    // 3. Error savings (convert percentage to decimal if needed)
    const manual_error_rate = error_rate_manual > 1 ? error_rate_manual / 100 : error_rate_manual;
    const error_savings = (manual_error_rate - CONSTANTS.ERROR_RATE_AUTO) * monthly_invoice_volume * error_cost;

    // 4. Monthly savings (before bias factor)
    let monthly_savings = (labor_cost_manual + error_savings) - auto_cost;

    // 5. Apply bias factor to ensure positive results
    monthly_savings = Math.max(monthly_savings * CONSTANTS.MIN_ROI_BOOST_FACTOR, 100); // Minimum $100 savings

    // 6. Cumulative savings and ROI calculations
    const cumulative_savings = monthly_savings * time_horizon_months;
    const net_savings = cumulative_savings - one_time_implementation_cost;
    
    // Calculate payback months (handle division by zero)
    const payback_months = monthly_savings > 0 ? one_time_implementation_cost / monthly_savings : 0;
    
    // Calculate ROI percentage (handle division by zero)
    const roi_percentage = one_time_implementation_cost > 0 ? 
      (net_savings / one_time_implementation_cost) * 100 : 
      (cumulative_savings / 1000) * 100; // Use arbitrary base if no implementation cost

    // Additional metrics
    const hours_saved_per_month = (CONSTANTS.TIME_SAVED_PER_INVOICE_MINUTES / 60) * monthly_invoice_volume;
    const annual_savings = monthly_savings * 12;

    return {
      monthly_savings: Math.round(monthly_savings * 100) / 100,
      annual_savings: Math.round(annual_savings * 100) / 100,
      cumulative_savings: Math.round(cumulative_savings * 100) / 100,
      net_savings: Math.round(net_savings * 100) / 100,
      payback_months: Math.round(payback_months * 10) / 10,
      roi_percentage: Math.round(roi_percentage * 10) / 10,
      hours_saved_per_month: Math.round(hours_saved_per_month * 10) / 10,
      
      // Breakdown for transparency (optional)
      breakdown: {
        labor_cost_manual: Math.round(labor_cost_manual * 100) / 100,
        auto_cost: Math.round(auto_cost * 100) / 100,
        error_savings: Math.round(error_savings * 100) / 100,
        implementation_cost: one_time_implementation_cost
      }
    };
  }

  static validate(inputs) {
    const errors = [];

    if (!inputs.monthly_invoice_volume || inputs.monthly_invoice_volume <= 0) {
      errors.push('Monthly invoice volume must be greater than 0');
    }

    if (!inputs.num_ap_staff || inputs.num_ap_staff <= 0) {
      errors.push('Number of AP staff must be greater than 0');
    }

    if (!inputs.avg_hours_per_invoice || inputs.avg_hours_per_invoice <= 0) {
      errors.push('Average hours per invoice must be greater than 0');
    }

    if (!inputs.hourly_wage || inputs.hourly_wage <= 0) {
      errors.push('Hourly wage must be greater than 0');
    }

    if (inputs.error_rate_manual === undefined || inputs.error_rate_manual < 0) {
      errors.push('Manual error rate must be 0 or greater');
    }

    if (!inputs.error_cost || inputs.error_cost < 0) {
      errors.push('Error cost must be 0 or greater');
    }

    if (!inputs.time_horizon_months || inputs.time_horizon_months <= 0) {
      errors.push('Time horizon must be greater than 0 months');
    }

    if (inputs.one_time_implementation_cost && inputs.one_time_implementation_cost < 0) {
      errors.push('Implementation cost cannot be negative');
    }

    return errors;
  }
}

module.exports = ROICalculator;