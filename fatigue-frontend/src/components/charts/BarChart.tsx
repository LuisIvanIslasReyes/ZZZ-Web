/**
 * Bar Chart Component
 * Gráfico de barras reutilizable
 */

import { Bar } from 'react-chartjs-2';
import { chartColors, defaultChartOptions } from '../../config/chartConfig';

interface BarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
  title?: string;
  height?: number;
  horizontal?: boolean;
}

export function BarChart({
  labels,
  datasets,
  title,
  height = 300,
  horizontal = false,
}: BarChartProps) {
  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || Object.values(chartColors)[index % 6],
      borderColor: dataset.borderColor || Object.values(chartColors)[index % 6],
      borderWidth: 1,
    })),
  };

  const options = {
    ...defaultChartOptions,
    indexAxis: horizontal ? ('y' as const) : ('x' as const),
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
      <Bar data={data} options={options} />
    </div>
  );
}
