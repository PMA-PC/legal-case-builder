import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { CareerEvent, PeerComparisonData } from '../types';

const defaultCareerData: CareerEvent[] = [
  { year: 2016, event: "Hired", responsibilities: 2, recognition: 3 },
  { year: 2018, event: "Promotion", responsibilities: 4, recognition: 4 },
  { year: 2020, event: "Expanded Role", responsibilities: 7, recognition: 5 },
  { year: 2022, event: "Added 2 more teams", responsibilities: 9, recognition: 5 },
  { year: 2024, event: "Scope Reduced", responsibilities: 5, recognition: 3 },
];

const defaultComparisonData: PeerComparisonData[] = [
  { metric: 'Team Size', you: 12, peer: 8 },
  { metric: 'Managed Depts', you: 4, peer: 2 },
  { metric: 'Pay Level (est.)', you: 7, peer: 7 },
  { metric: 'Support Staff', you: 1, peer: 3 },
];

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-gray-700 text-white rounded-md border border-gray-600 shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        <p className="text-sm text-blue-300">{`Responsibilities: ${data.responsibilities}`}</p>
        <p className="text-sm text-green-300">{`Recognition: ${data.recognition}`}</p>
        <p className="text-sm font-semibold mt-1">{`Event: ${data.event}`}</p>
      </div>
    );
  }
  return null;
};

interface InfographicsProps {
  careerEvents?: CareerEvent[];
  peerComparisons?: PeerComparisonData[];
}

const Infographics: React.FC<InfographicsProps> = ({ careerEvents, peerComparisons }) => {
  const [careerData, setCareerData] = useState<CareerEvent[]>(defaultCareerData);
  const [comparisonData, setComparisonData] = useState<PeerComparisonData[]>(defaultComparisonData);

  useEffect(() => {
    if (careerEvents && careerEvents.length > 0) {
      setCareerData(careerEvents);
    }
    if (peerComparisons && peerComparisons.length > 0) {
      setComparisonData(peerComparisons);
    }
  }, [careerEvents, peerComparisons]);

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Infographic 1: Career Trajectory vs. Responsibilities</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Visualizing your performance history and responsibility growth over time compared to the sudden adverse action.
        </p>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={careerData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="year" stroke="rgb(156 163 175)" />
              <YAxis yAxisId="left" stroke="rgb(156 163 175)" />
              <YAxis yAxisId="right" orientation="right" stroke="rgb(156 163 175)" />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="responsibilities" name="Responsibilities (Scale 1-10)" fill="#3b82f6" />
              <Line yAxisId="right" type="monotone" dataKey="recognition" name="Positive Recognition (Scale 1-5)" stroke="#10b981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Infographic 2: Peer Comparison Breakdown</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Comparing your workload, resources, and treatment against similarly situated employees (Comparators).
        </p>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" stroke="rgb(156 163 175)" />
              <YAxis dataKey="metric" type="category" stroke="rgb(156 163 175)" width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(55 65 81)',
                  borderColor: 'rgb(75 85 99)',
                  color: 'white'
                }}
              />
              <Legend />
              <Bar dataKey="you" name="You" fill="#8b5cf6" />
              <Bar dataKey="peer" name="Peer Average" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Infographics;