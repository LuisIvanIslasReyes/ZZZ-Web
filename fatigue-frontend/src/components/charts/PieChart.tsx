/**
 * Pie Chart Component
 * Gráfico circular reutilizable
 */

import { Pie } from 'react-chartjs-2';
import { chartColors, defaultChartOptions } from '../../config/chartConfig';

interface PieChartProps {
  labels: string[];
  data: number[];
  title?: string;
  height?: number;
  colors?: string[];
}

export function PieChart({
  labels,
  data,
  title,
  height = 300,
  colors,
}: PieChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || Object.values(chartColors),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        display: !!title,
        text: title,
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
