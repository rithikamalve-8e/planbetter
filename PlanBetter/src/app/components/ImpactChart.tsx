import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown, Zap } from 'lucide-react';

interface ImpactChartProps {
  energySavings: string;
  co2Reduction: string;
}

export function ImpactChart({ energySavings, co2Reduction }: ImpactChartProps) {
  // Parse values for chart visualization
  const parseValue = (value: string): number => {
    const match = value.match(/[\d,]+/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  };

  const energyValue = parseValue(energySavings);
  const co2Value = parseValue(co2Reduction);

  const data = [
    {
      name: 'Before',
      energy: energyValue * 2,
      co2: co2Value * 2,
    },
    {
      name: 'After',
      energy: energyValue,
      co2: co2Value,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-600" />
          Projected Impact
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '14px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar 
              dataKey="energy" 
              fill="#16a34a" 
              name="Energy (kWh)" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="co2" 
              fill="#0ea5e9" 
              name="CO₂ (kg)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Zap className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Energy Saved</p>
              <p className="text-green-700">{energySavings}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <TrendingDown className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">CO₂ Reduced</p>
              <p className="text-blue-700">{co2Reduction}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
