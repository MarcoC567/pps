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

//
// 1) Define a new type for expected end stocks
//
export type ExpectedEndStocks = {
  product: string;
  values: number[];
}[];

function computeExpectedEndStocks(
  productionData: ProductionPlanData,
  forecastData: ForecastData,
  stockData: StockData,
  salesData: SalesForecastData
): ExpectedEndStocks {
  const result = productionData.map((prodRow, productIndex) => {
    const forecastRow = forecastData[productIndex];
    const s = stockData[productIndex];
    const sales = salesData[productIndex];
    const result = [0, 0, 0, 0];

    const first =
      s.stock +
      s.inProduction +
      s.waitingList -
      sales.current +
      prodRow.values[0];
    result[0] = first;

    for (let i = 1; i < 4; i++) {
      result[i] = result[i - 1] - forecastRow.values[i] + prodRow.values[i];
    }

    return {
      product: prodRow.product,
      values: result,
    };
  });
  for (let i = 0; i < 3; i++) {
    if (stockData[i]) {
      stockData[i].endStock = result[i]?.values?.[0] ?? 0;
    }
  }
  return result;
}

export default function ProductionPlanPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const importData = JSON.parse(localStorage.getItem("importData") || "{}") as {
    results: {
      forecast: {
        p1: string;
        p2: string;
        p3: string;
      };
    };
  };

  const [forecastData, setForecastData] = useState<ForecastData>(() => {
    const saved = localStorage.getItem("forecastdata");
    return saved
      ? JSON.parse(saved)
      : [
          {
            product: "p1ChildrenBike",
            values: [Number(importData.results.forecast.p1), 0, 0, 0],
          },
          {
            product: "p2WomenBike",
            values: [Number(importData.results.forecast.p2), 0, 0, 0],
          },
          {
            product: "p3MenBike",
            values: [Number(importData.results.forecast.p3), 0, 0, 0],
          },
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
          {
            product: "p1ChildrenBike",
            current: Number(importData.results.forecast.p1),
          },
          {
            product: "p2WomenBike",
            current: Number(importData.results.forecast.p2),
          },
          {
            product: "p3MenBike",
            current: Number(importData.results.forecast.p3),
          },
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

  const [stockData, setStockData] = useState<StockData>(() => {
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

    const raw = localStorage.getItem("importData");
    console.log(raw);
    if (raw) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed: any = JSON.parse(raw);

        const art = parsed.results?.warehousestock?.article;
        const list = Array.isArray(art) ? art : art ? [art] : [];

        const wl = parsed.results?.waitinglistworkstations?.workplace;
        const wlArr = Array.isArray(wl) ? wl : wl ? [wl] : [];
        const waitingMap: Record<number, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wlArr.forEach((wp: any) => {
          const items = Array.isArray(wp.waitinglist)
            ? wp.waitinglist
            : wp.waitinglist
            ? [wp.waitinglist]
            : [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.forEach((e: any) => {
            if (e?.item && e?.amount) {
              const id = Number(e.item);
              waitingMap[id] = (waitingMap[id] || 0) + Number(e.amount);
            }
          });
        });

        const ow = parsed.results?.ordersinwork?.workplace;
        const owArr = Array.isArray(ow) ? ow : ow ? [ow] : [];
        const inWorkMap: Record<number, number> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owArr.forEach((o: any) => {
          if (o?.item && o?.amount) {
            const id = Number(o.item);
            inWorkMap[id] = (inWorkMap[id] || 0) + Number(o.amount);
          }
        });

        const rows: StockData = list
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((a: any) => {
            const id = Number(a.id);
            const part = parts.artikel.find(
              (p) => parseInt(p.artikelnummer, 10) === id
            );
            return part?.produktart === "E" || part?.produktart === "P";
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((a: any) => {
            const id = Number(a.id);
            const part = parts.artikel.find(
              (p) => parseInt(p.artikelnummer, 10) === id
            );
            return {
              product: part ? `${a.id} ${part.bezeichnung}` : `Artikel ${a.id}`,
              stock: Number(a.amount) || 0,
              endStock: 50,
              waitingList: waitingMap[id] || 0,
              inProduction: inWorkMap[id] || 0,
            };
          });

        if (rows.length > 0) return rows;
      } catch {
        /* ignore parse error */
      }
    }

    return parts.artikel
      .filter((p) => p.produktart === "E" || p.produktart === "P")
      .map((p) => ({
        product: `${p.artikelnummer} ${p.bezeichnung}`,
        stock: 0,
        endStock: 50,
        waitingList: 0,
        inProduction: 0,
      }));
  });

  console.log(directData);
  console.log(forecastData);

  useEffect(() => {
    const updatedStockData = [...stockData];
    updatedStockData[0] = {
      ...updatedStockData[0],
      endStock:
        productionData[0].values[0] -
        salesData[0].current +
        stockData[0].inProduction +
        stockData[0].waitingList +
        stockData[0].stock,
    };
    setStockData(updatedStockData);
  }, [productionData[0].values[0], salesData[0].current]);

  useEffect(() => {
    const updatedStockData = [...stockData];
    updatedStockData[1] = {
      ...updatedStockData[1],
      endStock:
        productionData[1].values[0] -
        salesData[1].current +
        stockData[1].inProduction +
        stockData[1].waitingList +
        stockData[1].stock,
    };
    setStockData(updatedStockData);
  }, [productionData[1].values[0], salesData[1].current]);

  useEffect(() => {
    const updatedStockData = [...stockData];
    updatedStockData[2] = {
      ...updatedStockData[2],
      endStock:
        productionData[2].values[0] -
        salesData[2].current +
        stockData[2].inProduction +
        stockData[2].waitingList +
        stockData[2].stock,
    };
    setStockData(updatedStockData);
  }, [productionData[2].values[0], salesData[2].current]);

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

  const allValid = (): boolean =>
    forecastData.every((r) => r.values.every((v) => v >= 0)) &&
    productionData.every((r) => r.values.every((v) => v >= 0)) &&
    salesData.every((r) => r.current >= 0) &&
    stockData.every((r) => r.endStock >= 0);

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
    localStorage.setItem("visited_/forecast", "true");
    navigate("/inhouse-disposition");
  };

  const expectedEndStocks = computeExpectedEndStocks(
    productionData,
    forecastData,
    stockData,
    salesData
  );

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
      <ProductionPlanTable
        data={productionData}
        expectedEndStocks={expectedEndStocks}
        onChange={setProductionData}
      />

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
        className={`mt-4 mx-auto my-btn`}
      >
        {t("next")}
      </button>
    </Paper>
  );
}
