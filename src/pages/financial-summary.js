import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function FinancialSummaryPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summaryData, setSummaryData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonMode, setComparisonMode] = useState('none'); // none, previous_year, budget

  // Financiële ratio's
  const [financialRatios, setFinancialRatios] = useState({
    gross_margin: { value: 0, trend: 'stable' },
    net_margin: { value: 0, trend: 'up' },
    current_ratio: { value: 0, trend: 'down' },
    debt_to_equity: { value: 0, trend: 'stable' },
    roi: { value: 0, trend: 'up' }
  });

  useEffect(() => {
    fetchFinancialData();
  }, [selectedYear, selectedPeriod, comparisonMode]);

  const fetchFinancialData = async () => {
    setIsLoading(true);
    try {
      // In echte implementatie: haal data op uit Supabase
      // const { data, error } = await supabase
      //  .rpc('get_financial_summary', {
      //    year: selectedYear,
      //    period: selectedPeriod,
      //    comparison: comparisonMode
      //  });
      
      // Mock data voor demonstratie
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const generateMonthlyData = () => {
        return months.map((month, index) => {
          const baseRevenue = 50000 + (index * 2000) + (Math.random() * 5000);
          const baseCosts = 35000 + (index * 1000) + (Math.random() * 4000);
          
          return {
            month,
            revenue: Math.round(baseRevenue),
            costs: Math.round(baseCosts),
            profit: Math.round(baseRevenue - baseCosts),
            margin: Math.round(((baseRevenue - baseCosts) / baseRevenue) * 100)
          };
        });
      };
      
      const currentYearData = generateMonthlyData();
      
      // Aangepaste data voor het genereren van vergelijkingen
      let comparisonData = null;
      if (comparisonMode === 'previous_year') {
        comparisonData = months.map((month, index) => {
          const baseRevenue = 45000 + (index * 1800) + (Math.random() * 4000);
          const baseCosts = 33000 + (index * 900) + (Math.random() * 3000);
          
          return {
            month,
            revenue: Math.round(baseRevenue),
            costs: Math.round(baseCosts),
            profit: Math.round(baseRevenue - baseCosts),
            margin: Math.round(((baseRevenue - baseCosts) / baseRevenue) * 100)
          };
        });
      } else if (comparisonMode === 'budget') {
        comparisonData = months.map((month, index) => {
          const baseRevenue = 52000 + (index * 2200);
          const baseCosts = 36000 + (index * 1100);
          
          return {
            month,
            revenue: Math.round(baseRevenue),
            costs: Math.round(baseCosts),
            profit: Math.round(baseRevenue - baseCosts),
            margin: Math.round(((baseRevenue - baseCosts) / baseRevenue) * 100)
          };
        });
      }
      
      // Bereken totalen
      const totalRevenue = currentYearData.reduce((sum, item) => sum + item.revenue, 0);
      const totalCosts = currentYearData.reduce((sum, item) => sum + item.costs, 0);
      const totalProfit = totalRevenue - totalCosts;
      const averageMargin = Math.round((totalProfit / totalRevenue) * 100);
      
      // Bereken vergelijkende totalen
      let comparisonTotals = null;
      if (comparisonData) {
        const compRevenue = comparisonData.reduce((sum, item) => sum + item.revenue, 0);
        const compCosts = comparisonData.reduce((sum, item) => sum + item.costs, 0);
        const compProfit = compRevenue - compCosts;
        const compMargin = Math.round((compProfit / compRevenue) * 100);
        
        comparisonTotals = {
          revenue: compRevenue,
          costs: compCosts,
          profit: compProfit,
          margin: compMargin
        };
      }
      
      // Bereken financiële ratio's
      setFinancialRatios({
        gross_margin: { 
          value: averageMargin, 
          trend: averageMargin > (comparisonTotals?.margin || averageMargin - 2) ? 'up' : 'down' 
        },
        net_margin: { 
          value: Math.round((totalProfit * 0.75) / totalRevenue * 100), 
          trend: 'up' 
        },
        current_ratio: { 
          value: 1.8, 
          trend: 'stable' 
        },
        debt_to_equity: { 
          value: 0.4, 
          trend: 'down' 
        },
        roi: { 
          value: Math.round((totalProfit / (totalCosts * 1.2)) * 100), 
          trend: 'up' 
        }
      });
      
      setSummaryData({
        monthly: currentYearData,
        totals: {
          revenue: totalRevenue,
          costs: totalCosts,
          profit: totalProfit,
          margin: averageMargin
        },
        comparison: comparisonMode !== 'none' ? {
          mode: comparisonMode,
          data: comparisonData,
          totals: comparisonTotals
        } : null
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart opties en data
  const getChartData = (type) => {
    if (!summaryData) return null;
    
    const labels = summaryData.monthly.map(item => item.month);
    
    if (type === 'revenue_cost') {
      return {
        labels,
        datasets: [
          {
            label: 'Omzet',
            data: summaryData.monthly.map(item => item.revenue),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1
          },
          {
            label: 'Kosten',
            data: summaryData.monthly.map(item => item.costs),
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1
          },
          ...(summaryData.comparison ? [
            {
              label: `Omzet (${summaryData.comparison.mode === 'previous_year' ? 'Vorig jaar' : 'Budget'})`,
              data: summaryData.comparison.data.map(item => item.revenue),
              type: 'line',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.1
            },
            {
              label: `Kosten (${summaryData.comparison.mode === 'previous_year' ? 'Vorig jaar' : 'Budget'})`,
              data: summaryData.comparison.data.map(item => item.costs),
              type: 'line',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.1
            }
          ] : [])
        ]
      };
    } else if (type === 'profit') {
      return {
        labels,
        datasets: [
          {
            label: 'Winst',
            data: summaryData.monthly.map(item => item.profit),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1
          },
          ...(summaryData.comparison ? [
            {
              label: `Winst (${summaryData.comparison.mode === 'previous_year' ? 'Vorig jaar' : 'Budget'})`,
              data: summaryData.comparison.data.map(item => item.profit),
              type: 'line',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.1
            }
          ] : [])
        ]
      };
    } else if (type === 'margin') {
      return {
        labels,
        datasets: [
          {
            label: 'Marge (%)',
            data: summaryData.monthly.map(item => item.margin),
            backgroundColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 1,
            type: 'line',
            tension: 0.3,
            fill: true
          },
          ...(summaryData.comparison ? [
            {
              label: `Marge (${summaryData.comparison.mode === 'previous_year' ? 'Vorig jaar' : 'Budget'}) (%)`,
              data: summaryData.comparison.data.map(item => item.margin),
              type: 'line',
              borderColor: 'rgb(139, 92, 246)',
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.3,
              fill: false
            }
          ] : [])
        ]
      };
    }
    
    return null;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.label.includes('Marge')) {
                label += context.parsed.y + '%';
              } else {
                label += '€' + context.parsed.y.toLocaleString();
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (this.chart.config._config.type === 'line' && 
                this.chart.config._config.data.datasets[0].label.includes('Marge')) {
              return value + '%';
            }
            return '€' + value.toLocaleString();
          }
        }
      }
    }
  };

  // Helper functie voor trendindicatoren
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-600">↑</span>;
      case 'down':
        return <span className="text-red-600">↓</span>;
      default:
        return <span className="text-gray-600">→</span>;
    }
  };

  // Helper functie voor veranderingspercentage
  const getChangePercentage = (current, previous) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financieel Overzicht</h1>
        <div className="flex items-center space-x-3">
          <select
            className="border rounded-md px-3 py-2"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[2022, 2023, 2024].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <select
            className="border rounded-md px-3 py-2"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="year">Jaar</option>
            <option value="q1">Q1</option>
            <option value="q2">Q2</option>
            <option value="q3">Q3</option>
            <option value="q4">Q4</option>
          </select>
          
          <select
            className="border rounded-md px-3 py-2"
            value={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.value)}
          >
            <option value="none">Geen vergelijking</option>
            <option value="previous_year">Vergelijk met vorig jaar</option>
            <option value="budget">Vergelijk met budget</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`pb-3 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overzicht
          </button>
          <button
            className={`pb-3 px-4 ${activeTab === 'ratios' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('ratios')}
          >
            Financiële Ratio's
          </button>
          <button
            className={`pb-3 px-4 ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}
            onClick={() => setActiveTab('reports')}
          >
            Rapportages
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Laden...</p>
        </div>
      ) : (
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && summaryData && (
            <div>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500">Totale Omzet</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">€{summaryData.totals.revenue.toLocaleString()}</p>
                  {summaryData.comparison && (
                    <p className="text-sm mt-2">
                      <span className={`${
                        summaryData.totals.revenue > summaryData.comparison.totals.revenue
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {getChangePercentage(summaryData.totals.revenue, summaryData.comparison.totals.revenue)}%
                        {summaryData.totals.revenue > summaryData.comparison.totals.revenue ? ' ↑' : ' ↓'}
                      </span>
                      {' '}
                      vs {summaryData.comparison.mode === 'previous_year' ? 'vorig jaar' : 'budget'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500">Totale Kosten</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">€{summaryData.totals.costs.toLocaleString()}</p>
                  {summaryData.comparison && (
                    <p className="text-sm mt-2">
                      <span className={`${
                        summaryData.totals.costs < summaryData.comparison.totals.costs
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {getChangePercentage(summaryData.totals.costs, summaryData.comparison.totals.costs)}%
                        {summaryData.totals.costs < summaryData.comparison.totals.costs ? ' ↓' : ' ↑'}
                      </span>
                      {' '}
                      vs {summaryData.comparison.mode === 'previous_year' ? 'vorig jaar' : 'budget'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500">Totale Winst</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">€{summaryData.totals.profit.toLocaleString()}</p>
                  {summaryData.comparison && (
                    <p className="text-sm mt-2">
                      <span className={`${
                        summaryData.totals.profit > summaryData.comparison.totals.profit
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {getChangePercentage(summaryData.totals.profit, summaryData.comparison.totals.profit)}%
                        {summaryData.totals.profit > summaryData.comparison.totals.profit ? ' ↑' : ' ↓'}
                      </span>
                      {' '}
                      vs {summaryData.comparison.mode === 'previous_year' ? 'vorig jaar' : 'budget'}
                    </p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-sm font-medium text-gray-500">Gemiddelde Marge</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{summaryData.totals.margin}%</p>
                  {summaryData.comparison && (
                    <p className="text-sm mt-2">
                      <span className={`${
                        summaryData.totals.margin > summaryData.comparison.totals.margin
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {(summaryData.totals.margin - summaryData.comparison.totals.margin).toFixed(1)}%
                        {summaryData.totals.margin > summaryData.comparison.totals.margin ? ' ↑' : ' ↓'}
                      </span>
                      {' '}
                      vs {summaryData.comparison.mode === 'previous_year' ? 'vorig jaar' : 'budget'}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">Omzet & Kosten</h3>
                  <div className="h-72">
                    {getChartData('revenue_cost') && (
                      <Bar data={getChartData('revenue_cost')} options={chartOptions} />
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold mb-4">Winst</h3>
                  <div className="h-72">
                    {getChartData('profit') && (
                      <Bar data={getChartData('profit')} options={chartOptions} />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Winstmarge Trend</h3>
                <div className="h-72">
                  {getChartData('margin') && (
                    <Line data={getChartData('margin')} options={chartOptions} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Financial Ratios Tab */}
          {activeTab === 'ratios' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Financiële Ratio's</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Bruto winstmarge</h3>
                  <p className="text-3xl font-bold mt-2">{financialRatios.gross_margin.value}% {getTrendIcon(financialRatios.gross_margin.trend)}</p>
                  <p className="text-sm text-gray-500 mt-1">Verhouding tussen bruto winst en omzet</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Netto winstmarge</h3>
                  <p className="text-3xl font-bold mt-2">{financialRatios.net_margin.value}% {getTrendIcon(financialRatios.net_margin.trend)}</p>
                  <p className="text-sm text-gray-500 mt-1">Verhouding tussen netto winst en omzet</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Current ratio</h3>
                  <p className="text-3xl font-bold mt-2">{financialRatios.current_ratio.value} {getTrendIcon(financialRatios.current_ratio.trend)}</p>
                  <p className="text-sm text-gray-500 mt-1">Verhouding tussen vlottende activa en schulden</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Schuld-eigen vermogen ratio</h3>
                  <p className="text-3xl font-bold mt-2">{financialRatios.debt_to_equity.value} {getTrendIcon(financialRatios.debt_to_equity.trend)}</p>
                  <p className="text-sm text-gray-500 mt-1">Verhouding tussen totale schuld en eigen vermogen</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium">Return on Investment</h3>
                  <p className="text-3xl font-bold mt-2">{financialRatios.roi.value}% {getTrendIcon(financialRatios.roi.trend)}</p>
                  <p className="text-sm text-gray-500 mt-1">Rendement op investeringen</p>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Beschikbare Rapportages</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">Winst & Verliesrekening</h3>
                  <p className="text-sm text-gray-500 mt-1">Gedetailleerd overzicht van inkomsten en uitgaven</p>
                  <button className="mt-3 text-blue-600 hover:underline">Genereren</button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">Balans</h3>
                  <p className="text-sm text-gray-500 mt-1">Overzicht van activa, passiva en eigen vermogen</p>
                  <button className="mt-3 text-blue-600 hover:underline">Genereren</button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">Kasstroomoverzicht</h3>
                  <p className="text-sm text-gray-500 mt-1">Analyse van kasstromen uit operationele, investerings- en financieringsactiviteiten</p>
                  <button className="mt-3 text-blue-600 hover:underline">Genereren</button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">BTW-aangifte</h3>
                  <p className="text-sm text-gray-500 mt-1">Gegevens voor BTW-aangifte per kwartaal</p>
                  <button className="mt-3 text-blue-600 hover:underline">Genereren</button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">Debiteuren overzicht</h3>
                  <p className="text-sm text-gray-500 mt-1">Overzicht van openstaande facturen per klant</p>
                  <button className="mt-3 text-blue-600 hover:underline">Genereren</button>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <h3 className="font-medium">Crediteuren overzicht</h3>
                  <p className="text-sm text-gray-500 mt-1">Overzicht van te betalen facturen per leverancier</p>
                  <button className="mt-3 text-blue-600 hover:underline">Genereren</button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Export opties</h3>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">PDF</button>
                  <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Excel</button>
                  <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">CSV</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Voeg getLayout functie toe voor consistente layout
FinancialSummaryPage.getLayout = (page) => Layout.getLayout(page); 