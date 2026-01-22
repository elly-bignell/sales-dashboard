interface MetricCardProps {
  title: string;
  value: string | number;
  variance: number;
  target: number;
  color: 'pink' | 'teal';
}

export default function MetricCard({ title, value, variance, target, color }: MetricCardProps) {
  const bgColor = color === 'pink' ? 'bg-pink-50' : 'bg-teal-50';
  const isPositive = variance >= 0;

  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm`}>
      <h3 className="text-xs font-semibold text-gray-700 mb-2 tracking-wide">{title}</h3>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <span>{isPositive ? '↑' : '↓'}</span>
        <span>{Math.abs(variance)} vs Team Target</span>
      </div>
    </div>
  );
}
