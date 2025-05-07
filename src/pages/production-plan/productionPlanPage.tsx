//TODO geplantes Produktionsplan wie Prognose -> für Kaufteildispo

//TODO Weiter nur wenn alles grün ist
//TODO Sinnvolle Validation z.b. min 20 bei jedem Teil
import { useEffect, useState } from "react";
import ForecastTable from "./ForecastTable.tsx";
import ProductionPlanTable from "./ProductionPlanTable.tsx";
import SalesForecastTable from "./SalesForecastTable.tsx";
import DirectSalesTable from "./DirectSalesTable.tsx";
import StockAndQueueTable, { StockData } from "./StockAndQueueTable.tsx";
import parts from "../../data/base-data/parts.json";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";

type SalesForecastRow = {
  product: string;
  current: number;
};

type ArtikelXML = {
  id: string;
  amount: string;
  startamount: string;
};

type DirectSalesRow = {
  product: string;
  quantity: number;
  price: number;
  penalty: number;
};

export default function Forecast() {
  const [salesForecastData, setSalesForecastData] = useState<
    SalesForecastRow[]
  >([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [directSalesData /*,setDirectSalesData*/] = useState<DirectSalesRow[]>([
    { product: "p1ChildrenBike", quantity: 0, price: 0.0, penalty: 0.0 },
    { product: "p2WomenBike", quantity: 0, price: 0.0, penalty: 0.0 },
    { product: "p3MenBike", quantity: 0, price: 0.0, penalty: 0.0 },
  ]);

  const navigate = useNavigate();
  const handleNextClick = () => {
    navigate("/inhouse-disposition");
  };

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
      // SALES FORECAST TABLE
      const sales: SalesForecastRow[] = [
        { product: "p1ChildrenBike", current: 0 },
        { product: "p2WomenBike", current: 0 },
        { product: "p3MenBike", current: 0 },
      ];
      setSalesForecastData(sales);

      // STOCK TABLE
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
      // Funktion um nur die Eigenerzeugnisse im Prognose Tab anzuzeigen KEINE Kaufteile
      const warehouseStockData: StockData[] = articleList
        .filter((a: ArtikelXML) => {
          const id = a.id;
          const part = parts.artikel.find((p) => {
            const partNum = parseInt(p.artikelnummer);
            return partNum === Number(id);
          });
          return part?.produktart === "E"; // nur Eigenfertigung
        })
        .map((a: ArtikelXML) => {
          const id = a.id;
          const part = parts.artikel.find((p) => {
            const partNum = parseInt(p.artikelnummer);
            return partNum === Number(id);
          });

          return {
            product: part ? `${id} ${part.bezeichnung}` : `Artikel ${id}`,
            stock: Number(a.amount),
            endStock: 0,
            waitingList: waitingListMap[Number(id)] || 0,
            inProduction: inProductionMap[Number(id)] || 0,
          };
        });

      console.log("Generiertes Stock-Data:", warehouseStockData);
      setStockData(warehouseStockData);
    } catch (err) {
      console.error("Fehler beim Parsen der gespeicherten XML-Daten:", err);
    }
  }, []);

  const { t } = useLanguage();

  return (
    <div style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "95vw",
          backgroundColor: "#fafafa",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          {t("forecast")}
        </Typography>

        <ForecastTable />
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          {t("ProductionPlan")}
        </Typography>
        <ProductionPlanTable />
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "3rem",
          }}
        >
          <SalesForecastTable
            salesForecastData={salesForecastData}
            // onChange={checkFormValidity}
          />
          <DirectSalesTable directSalesData={directSalesData} />
        </div>

        <div style={{ marginTop: "3rem" }}>
          <StockAndQueueTable
            stockData={stockData}
            // onChange={checkFormValidity}
          />
        </div>
        <button
          onClick={handleNextClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto "
        >
          {t("next")}
        </button>
      </Paper>
    </div>
  );
}
