import React, { useState, useEffect } from 'react';
import './App.css';
import ROICalculator from './components/ROICalculator';
import ScenarioManager from './components/ScenarioManager';
import ResultsDisplay from './components/ResultsDisplay';
import ReportGenerator from './components/ReportGenerator';

function App() {
  const [currentResults, setCurrentResults] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [activeTab, setActiveTab] = useState('calculator');
  const [loading, setLoading] = useState(false);

  // Load saved scenarios on component mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const response = await fetch('/api/scenarios');
      const data = await response.json();
      if (data.success) {
        setSavedScenarios(data.scenarios);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
    }
  };

  const handleCalculation = (results, inputs) => {
    setCurrentResults(results);
    setCurrentScenario(inputs);
  };

  const handleScenarioSaved = () => {
    loadScenarios();
  };

  const handleScenarioLoaded = (scenario) => {
    setCurrentScenario(scenario);
    setCurrentResults(scenario.results);
    setActiveTab('calculator');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🧮 Invoicing ROI Simulator</h1>
        <p>Calculate the ROI of switching from manual to automated invoicing</p>
      </header>

      <nav className="tab-navigation">
        <button 
          className={activeTab === 'calculator' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('calculator')}
        >
          📊 Calculator
        </button>
        <button 
          className={activeTab === 'scenarios' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('scenarios')}
        >
          💾 Scenarios
        </button>
        {currentResults && (
          <button 
            className={activeTab === 'report' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('report')}
          >
            📄 Report
          </button>
        )}
      </nav>

      <main className="app-main">
        {activeTab === 'calculator' && (
          <div className="calculator-section">
            <ROICalculator 
              onCalculation={handleCalculation}
              initialData={currentScenario}
              onScenarioSaved={handleScenarioSaved}
            />
            {currentResults && (
              <ResultsDisplay results={currentResults} />
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <ScenarioManager 
            scenarios={savedScenarios}
            onScenarioLoaded={handleScenarioLoaded}
            onScenariosChanged={loadScenarios}
          />
        )}

        {activeTab === 'report' && currentResults && (
          <ReportGenerator 
            scenarioData={currentScenario}
            results={currentResults}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Invoicing ROI Simulator | Built for automation success</p>
      </footer>
    </div>
  );
}

export default App;