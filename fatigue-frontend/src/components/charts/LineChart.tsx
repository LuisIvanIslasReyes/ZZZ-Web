/**
 * Line Chart Component
 * Gráfico de líneas reutilizable
 */

import { Line } from 'react-chartjs-2';
import { chartColors, defaultChartOptions } from '../../config/chartConfig';

interface LineChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  title?: string;
  height?: number;
}

export function LineChart({ labels, datasets, title, height = 300 }: LineChartProps) {
  const data = {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || Object.values(chartColors)[index % 6],
      backgroundColor: dataset.backgroundColor || `${Object.values(chartColors)[index % 6]}33`,
      tension: 0.4,
      fill: dataset.fill !== undefined ? dataset.fill : true,
    })),
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
      <Line data={data} options={options} />
    </div>
  );
}
