import { useState, useEffect } from "react";
import ForecastTable, { ForecastData } from "./ForecastTable.tsx";
import ProductionPlanTable, {
  ProductionPlanData,
} from "./ProductionPlanTable.tsx";
import SalesForecastTable, {
  SalesForecastData,
} from "./SalesForecastTable.tsx";
import StockAndQueueTable, { StockData } from "./StockAndQueueTable.tsx";
import DirectSalesTable, { DirectSalesData } from "./DirectSalesTable.tsx";
import parts from "../../data/base-data/parts.json";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";

export default function ProductionPlanPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // — Forecast, ProductionPlan, SalesForecast & DirectSales wie gehabt
  const [forecastData, setForecastData] = useState<ForecastData>(() => {
    const saved = localStorage.getItem("forecastdata");
    return saved
      ? JSON.parse(saved)
      : [
          { product: "p1ChildrenBike", values: [0, 0, 0, 0] },
          { product: "p2WomenBike", values: [0, 0, 0, 0] },
          { product: "p3MenBike", values: [0, 0, 0, 0] },
        ];
  });

  const [productionData, setProductionData] = useState<ProductionPlanData>(
    () => {
      const saved = localStorage.getItem("productionPlanData");
      return saved
        ? JSON.parse(saved)
        : [
            { product: "p1ChildrenBike", values: [0, 0, 0, 0] },
            { product: "p2WomenBike", values: [0, 0, 0, 0] },
            { product: "p3MenBike", values: [0, 0, 0, 0] },
          ];
    }
  );

  const [salesData, setSalesData] = useState<SalesForecastData>(() => {
    const saved = localStorage.getItem("sellwish");
    return saved
      ? JSON.parse(saved)
      : [
          { product: "p1ChildrenBike", current: 0 },
          { product: "p2WomenBike", current: 0 },
          { product: "p3MenBike", current: 0 },
        ];
  });

  const [directData] = useState<DirectSalesData>(() => {
    const saved = localStorage.getItem("selldirect");
    return saved
      ? JSON.parse(saved)
      : [
          { product: "p1ChildrenBike", quantity: 0, price: 0, penalty: 0 },
          { product: "p2WomenBike", quantity: 0, price: 0, penalty: 0 },
          { product: "p3MenBike", quantity: 0, price: 0, penalty: 0 },
        ];
  });

  // — StockData initial im State-Initializer
  const [stockData, setStockData] = useState<StockData>(() => {
    // 1) LocalStorage, wenn nicht leer
    const saved = localStorage.getItem("plannedStockAtTheEndOfThePeriod");
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length > 0) {
          return arr as StockData;
        }
      } catch {
        /* ignore */
      }
    }

    // 2) direkt aus importData parsen
    const raw = localStorage.getItem("importData");
    console.log(raw);
    if (raw) {
      try {
        const parsed: any = JSON.parse(raw);

        // a) Lagerbestand
        const art = parsed.results?.warehousestock?.article;
        const list = Array.isArray(art) ? art : art ? [art] : [];

        // b) Warteschlangen
        const wl = parsed.results?.waitinglistworkstations?.workplace;
        const wlArr = Array.isArray(wl) ? wl : wl ? [wl] : [];
        const waitingMap: Record<number, number> = {};
        wlArr.forEach((wp: any) => {
          const items = Array.isArray(wp.waitinglist)
            ? wp.waitinglist
            : wp.waitinglist
            ? [wp.waitinglist]
            : [];
          items.forEach((e: any) => {
            if (e?.item && e?.amount) {
              const id = Number(e.item);
              waitingMap[id] = (waitingMap[id] || 0) + Number(e.amount);
            }
          });
        });

        // c) inProduction
        const ow = parsed.results?.ordersinwork?.workplace;
        const owArr = Array.isArray(ow) ? ow : ow ? [ow] : [];
        const inWorkMap: Record<number, number> = {};
        owArr.forEach((o: any) => {
          if (o?.item && o?.amount) {
            const id = Number(o.item);
            inWorkMap[id] = (inWorkMap[id] || 0) + Number(o.amount);
          }
        });

        // d) rows bauen
        const rows: StockData = list
          .filter((a: any) => {
            const id = Number(a.id);
            const part = parts.artikel.find(
              (p) => parseInt(p.artikelnummer, 10) === id
            );
            return part?.produktart === "E" || part?.produktart === "P";
          })
          .map((a: any) => {
            const id = Number(a.id);
            const part = parts.artikel.find(
              (p) => parseInt(p.artikelnummer, 10) === id
            );
            return {
              product: part ? `${a.id} ${part.bezeichnung}` : `Artikel ${a.id}`,
              stock: Number(a.amount) || 0,
              endStock: 0,
              waitingList: waitingMap[id] || 0,
              inProduction: inWorkMap[id] || 0,
            };
          });

        if (rows.length > 0) return rows;
      } catch {
        /* ignore parse error */
      }
    }

    // 3) Fallback aus parts.json
    return parts.artikel
      .filter((p) => p.produktart === "E" || p.produktart === "P")
      .map((p) => ({
        product: `${p.artikelnummer} ${p.bezeichnung}`,
        stock: 0,
        endStock: 0,
        waitingList: 0,
        inProduction: 0,
      }));
  });

  // — Persistenz
  useEffect(() => {
    localStorage.setItem("forecastdata", JSON.stringify(forecastData));
  }, [forecastData]);
  useEffect(() => {
    localStorage.setItem("productionPlanData", JSON.stringify(productionData));
  }, [productionData]);
  useEffect(() => {
    localStorage.setItem("sellwish", JSON.stringify(salesData));
  }, [salesData]);
  useEffect(() => {
    localStorage.setItem(
      "plannedStockAtTheEndOfThePeriod",
      JSON.stringify(stockData)
    );
  }, [stockData]);

  // — Validierung
  const allValid = (): boolean =>
    forecastData.every((r) => r.values.every((v) => v !== 0)) &&
    productionData.every((r) => r.values.every((v) => v !== 0)) &&
    salesData.every((r) => r.current !== 0) &&
    stockData.every((r) => r.endStock !== 0);

  // — Next
  const handleNext = () => {
    const firstInvalid = document.querySelector<HTMLInputElement>(
      'input.table-input[data-valid="false"]'
    );
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.classList.add("highlight");
      setTimeout(() => firstInvalid.classList.remove("highlight"), 1500);
      return;
    }
    localStorage.setItem("visited_/production-plan", "true");
    navigate("/inhouse-disposition");
  };

  return (
    <Paper
      sx={{
        padding: "2rem",
        borderRadius: "16px",
        maxWidth: "95vw",
        m: "auto",
        mt: 4,
        backgroundColor: "#fafafa",
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
      <ForecastTable data={forecastData} onChange={setForecastData} />

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        {t("ProductionPlan")}
      </Typography>
      <ProductionPlanTable data={productionData} onChange={setProductionData} />

      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "3rem",
        }}
      >
        <SalesForecastTable data={salesData} onChange={setSalesData} />
        <DirectSalesTable directSalesData={directData} />
      </div>

      <div style={{ marginTop: "3rem" }}>
        <StockAndQueueTable data={stockData} onChange={setStockData} />
      </div>

      <button
        onClick={handleNext}
        disabled={!allValid()}
        className={
          `mt-4 px-4 py-2 rounded flex items-center gap-2 mx-auto transition ` +
          (allValid()
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-400 cursor-not-allowed")
        }
      >
        {t("next")}
      </button>
    </Paper>
  );
}
