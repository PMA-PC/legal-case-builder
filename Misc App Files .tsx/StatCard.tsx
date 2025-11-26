import React from 'react';

interface StatCardProps {
  icon: string;
  number: number | string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label }) => (
  <div className="bg-bg-card rounded-xl p-4 text-center border border-border-light flex flex-col items-center justify-center shadow-card-light">
    <div className="text-3xl mb-2 text-primary-brand">{icon}</div>
    <div className="text-3xl font-bold text-text-primary mb-1">{number}</div>
    <div className="text-xs text-text-secondary uppercase tracking-wider">{label}</div>
  </div>
);

export default StatCard;