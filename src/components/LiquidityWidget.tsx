import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface CashflowData {
  month: string;
  inflow: number;
  outflow: number;
  balance: number;
}

const LiquidityWidget: React.FC = () => {
  const [currentBalance, setCurrentBalance] = useState(50000);
  const [cashflowForecast, setCashflowForecast] = useState<CashflowData[]>([]);
  const [forecastMonths, setForecastMonths] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  // Haal cashflow prognose op
  useEffect(() => {
    const fetchLiquidityData = async () => {
      setIsLoading(true);
      try {
        // In een echte implementatie: haal data op uit Supabase
        // const { data, error } = await supabase
        //   .from('liquidity')
        //   .select('*')
        //   .order('date', { ascending: true })
        //   .limit(forecastMonths);
        
        // if (error) throw error;
        
        // Mock data voor demo-doeleinden
        const today = new Date();
        const forecastData: CashflowData[] = [];
        let runningBalance = currentBalance;
        
        for (let i = 0; i < forecastMonths; i++) {
          const forecastDate = new Date(today);
          forecastDate.setMonth(today.getMonth() + i);
          
          // Simuleer inkomsten en uitgaven
          const inflow = 20000 + Math.floor(Math.random() * 5000);
          const outflow = 15000 + Math.floor(Math.random() * 4000);
          
          runningBalance = runningBalance + inflow - outflow;
          
          forecastData.push({
            month: forecastDate.toLocaleString('nl-NL', { month: 'short', year: 'numeric' }),
            inflow,
            outflow,
            balance: runningBalance
          });
        }
        
        setCashflowForecast(forecastData);
      } catch (error) {
        console.error('Error fetching liquidity data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLiquidityData();
  }, [forecastMonths, currentBalance]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Liquide Middelen</h2>
        <select 
          className="border rounded px-2 py-1" 
          value={forecastMonths}
          onChange={(e) => setForecastMonths(Number(e.target.value))}
        >
          <option value={3}>3 maanden</option>
          <option value={6}>6 maanden</option>
          <option value={12}>12 maanden</option>
        </select>
      </div>
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-900">€{currentBalance.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Huidige balans</p>
      </div>
      
      {isLoading ? (
        <p>Laden...</p>
      ) : (
        <div>
          <h3 className="text-md font-semibold mb-2">Prognose komende {forecastMonths} maanden</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left">Maand</th>
                  <th className="py-2 px-3 text-right">Inkomsten</th>
                  <th className="py-2 px-3 text-right">Uitgaven</th>
                  <th className="py-2 px-3 text-right">Balans</th>
                </tr>
              </thead>
              <tbody>
                {cashflowForecast.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-3">{item.month}</td>
                    <td className="py-2 px-3 text-right text-green-600">€{item.inflow.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-red-600">€{item.outflow.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-semibold" style={{ color: item.balance >= 0 ? 'green' : 'red' }}>
                      €{item.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <p className="text-sm">
              {
                cashflowForecast.length > 0 && cashflowForecast[cashflowForecast.length - 1].balance < 0 
                  ? <span className="text-red-600">⚠️ Waarschuwing: Negatieve cashflow verwacht</span>
                  : <span className="text-green-600">✓ Positieve cashflow verwacht</span>
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidityWidget;