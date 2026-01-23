interface MetricCardProps {
  title: string;
  actual: number;
  target: number;
  variance: {
    diff: number;
    percentage: number;
    daysAheadBehind: number;
  };
  format: 'currency' | 'number';
}

export default function MetricCardV2({ title, actual, target, variance, format }: MetricCardProps) {
  const formatValue = (value: number) => {
    if (format === 'currency') {
      return `$${Math.round(value).toLocaleString()}`;
    }
    return Math.round(value).toString();
  };

  const isPositive = variance.diff >= 0;
  const absPercentage = Math.abs(variance.percentage);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="text-xs font-semibold text-gray-600 mb-2 uppercase">{title}</div>
      
      {/* Target */}
      <div className="text-xs text-gray-500 mb-1">
        Target: {formatValue(target)}
      </div>
      
      {/* Actual */}
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {formatValue(actual)}
      </div>
      
      {/* Variance */}
      <div className={`text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{formatValue(variance.diff)}
        <span className="ml-1">({isPositive ? '+' : ''}{variance.percentage}%)</span>
      </div>
      
      {/* Days Ahead/Behind */}
      <div className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {variance.daysAheadBehind > 0 && '+'}
        {variance.daysAheadBehind.toFixed(1)}d {isPositive ? 'ahead' : 'behind'}
      </div>
    </div>
  );
}
