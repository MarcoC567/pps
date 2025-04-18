import { useEffect, useState } from "react";
import ForecastTable from "./ForecastTable.tsx";
import SalesForecastTable from "./SalesForecastTable.tsx";
import StockAndQueueTable, { StockData } from "./StockAndQueueTable.tsx";
import parts from "../../data/base-data/parts.json";

// Typdefinitionen
type SalesForecastRow = {
  product: string;
  current: number;
  next: number;
};

type ArtikelXML = {
  id: string;
  amount: string;
  startamount: string;
};

export default function ProductionPlanPage() {
  const [salesForecastData, setSalesForecastData] = useState<
    SalesForecastRow[]
  >([]);
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("importData");
    if (!raw) return;
    console.log("Local Storage Data:" + raw);
    try {
      const parsed = JSON.parse(raw);
      console.log("parsed XML:", parsed);

      const articles = parsed.results.warehousestock.article;
      console.log("parsed Artikel:", articles);
      const articleList = Array.isArray(articles) ? articles : [articles];

      const waitingList =
        parsed.results.waitinglistworkstations?.workplace || [];
      console.log("parsed WaitingList:", waitingList);
      const ordersInWork = parsed.results.ordersinwork?.workplace || [];
      console.log("parsed ordersInWork:", ordersInWork);
      // === SALES FORECAST TABLE ===
      const sales: SalesForecastRow[] = [
        { product: "P1 Children Bike", current: 0, next: 0 },
        { product: "P2 Women Bike", current: 0, next: 0 },
        { product: "P3 Men Bike", current: 0, next: 0 },
      ];
      setSalesForecastData(sales);

      // === STOCK TABLE ===
      const waitingListMap: Record<number, number> = {};
      const inProductionMap: Record<number, number> = {};

      for (const wp of Array.isArray(waitingList)
        ? waitingList
        : [waitingList]) {
        const items = wp.waitinglist;
        if (!items) continue;
        const list = Array.isArray(items) ? items : [items];
        for (const entry of list) {
          const id = Number(entry.item);
          waitingListMap[id] = (waitingListMap[id] || 0) + Number(entry.amount);
        }
      }

      for (const order of Array.isArray(ordersInWork)
        ? ordersInWork
        : [ordersInWork]) {
        const id = Number(order.item);
        inProductionMap[id] = (inProductionMap[id] || 0) + Number(order.amount);
      }

      const warehouseStockData: StockData[] = articleList.map(
        (a: ArtikelXML) => {
          const id = a.id;
          const part = parts.artikel.find((p) =>
            p.artikelnummer.startsWith(id)
          );
          return {
            product: part ? `${id} ${part.bezeichnung}` : `Artikel ${id}`,
            stock: Number(a.amount),
            endStock: Number(a.startamount),
            waitingList: waitingListMap[Number(id)] || 0,
            inProduction: inProductionMap[Number(id)] || 0,
          };
        }
      );

      console.log("Generiertes Stock-Data:", warehouseStockData);
      setStockData(warehouseStockData);
    } catch (err) {
      console.error("Fehler beim Parsen der gespeicherten XML-Daten:", err);
    }
  }, []);

  return (
    <div>
      <ForecastTable />
      <SalesForecastTable salesForecastData={salesForecastData} />
      <StockAndQueueTable stockData={stockData} />
    </div>
  );
}
