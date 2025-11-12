/**
 * Doughnut Chart Component
 * Gráfico de dona reutilizable
 */

import { Doughnut } from 'react-chartjs-2';
import { chartColors, defaultChartOptions } from '../../config/chartConfig';

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  title?: string;
  height?: number;
  colors?: string[];
}

export function DoughnutChart({
  labels,
  data,
  title,
  height = 300,
  colors,
}: DoughnutChartProps) {
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
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
