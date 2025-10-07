const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '..', 'data', 'roi_simulator.db');
      
      // Create data directory if it doesn't exist
      const fs = require('fs');
      const dataDir = path.dirname(dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const createScenariosTable = `
        CREATE TABLE IF NOT EXISTS scenarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          scenario_name TEXT UNIQUE NOT NULL,
          monthly_invoice_volume INTEGER NOT NULL,
          num_ap_staff INTEGER NOT NULL,
          avg_hours_per_invoice REAL NOT NULL,
          hourly_wage REAL NOT NULL,
          error_rate_manual REAL NOT NULL,
          error_cost REAL NOT NULL,
          time_horizon_months INTEGER NOT NULL,
          one_time_implementation_cost REAL DEFAULT 0,
          results TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(createScenariosTable, (err) => {
        if (err) {
          console.error('Error creating scenarios table:', err);
          reject(err);
        } else {
          console.log('Scenarios table created successfully');
          resolve();
        }
      });
    });
  }

  async saveScenario(data) {
    return new Promise((resolve, reject) => {
      const {
        scenario_name,
        monthly_invoice_volume,
        num_ap_staff,
        avg_hours_per_invoice,
        hourly_wage,
        error_rate_manual,
        error_cost,
        time_horizon_months,
        one_time_implementation_cost,
        results
      } = data;

      const sql = `
        INSERT OR REPLACE INTO scenarios 
        (scenario_name, monthly_invoice_volume, num_ap_staff, avg_hours_per_invoice, 
         hourly_wage, error_rate_manual, error_cost, time_horizon_months, 
         one_time_implementation_cost, results, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      this.db.run(sql, [
        scenario_name,
        monthly_invoice_volume,
        num_ap_staff,
        avg_hours_per_invoice,
        hourly_wage,
        error_rate_manual,
        error_cost,
        time_horizon_months,
        one_time_implementation_cost || 0,
        JSON.stringify(results)
      ], function(err) {
        if (err) {
          console.error('Error saving scenario:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, scenario_name });
        }
      });
    });
  }

  async getAllScenarios() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM scenarios ORDER BY updated_at DESC';
      
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Error fetching scenarios:', err);
          reject(err);
        } else {
          const scenarios = rows.map(row => ({
            ...row,
            results: JSON.parse(row.results)
          }));
          resolve(scenarios);
        }
      });
    });
  }

  async getScenarioById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM scenarios WHERE id = ?';
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('Error fetching scenario:', err);
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            ...row,
            results: JSON.parse(row.results)
          });
        }
      });
    });
  }

  async deleteScenario(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM scenarios WHERE id = ?';
      
      this.db.run(sql, [id], function(err) {
        if (err) {
          console.error('Error deleting scenario:', err);
          reject(err);
        } else {
          resolve({ deletedRows: this.changes });
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = Database;