import ForecastTable from './ForecastTable.tsx';
import SalesForecastTable from './SalesForecastTable.tsx';
import StockAndQueueTable, { StockData } from './StockAndQueueTable.tsx';
import parts from '../../data/base-data/parts.json';

export default function ProductionPlanPage() {
  const forecastData = [
    {
      product: "P1 Children Bike",
      values: [150, 150, 150, 150, 200, 250, 250],
    },
    {
      product: "P2 Women Bike",
      values: [150, 150, 150, 100, 150, 150, 150],
    },
    {
      product: "P3 Men Bike",
      values: [150, 150, 150, 100, 150, 100, 100],
    },
  ];

  const salesForecastData = [
    {
      product: "P1 Children Bike",
      current: 200,
      next: 200,
    },
    {
      product: "P2 Women Bike",
      current: 100,
      next: 150,
    },
    {
      product: "P3 Men Bike",
      current: 50,
      next: 50,
    },
  ];

  console.log(parts);

  const stockData: StockData[] = parts.artikel.map(artikel => {
    return {
      product: `${artikel.artikelnummer} ${artikel.bezeichnung}`,
      stock: 0,
      endStock: 0,
      waitingList: 0,
      inProduction: 0,
    } as StockData
  });

  return (
    <div>
      <ForecastTable forecastData={forecastData} />
      <SalesForecastTable salesForecastData={salesForecastData} />
      <StockAndQueueTable stockData={stockData} />
    </div>
  );
}
