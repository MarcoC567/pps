import Box from "@mui/material/Box";
import { items } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from "./PurchaseDispositionTable";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import FutureInwardStockTable from "./FutureInwardStockTable";
import { ProductionPlanData } from "../production-plan/ProductionPlanTable";

type WareHouseStockData = {
  itemNr: number;
  amount: number;
}[];

export default function PurchaseDispositionPage() {
  const [wareHouseStockData, setWareHouseStockData] = useState<WareHouseStockData>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleNextClick = () => {
    navigate("/xmlExport");
  };
  const { t } = useLanguage();

  useEffect(() => {
    const importData = JSON.parse(localStorage.getItem('importData') || '{}') as {
      results?: {
        warehousestock?: {
          article?: Record<string, { amount?: string }>;
        };
      };
    };

    console.log(importData);

    setWareHouseStockData(
      items.map((itemNumber) => {
        const amount: string = importData.results?.warehousestock?.article?.[`${itemNumber - 1}`]?.amount ?? "0";
        return {
          itemNr: itemNumber,
          amount: Number(amount),
        };
      })
    );

    setTimeout(() => setLoading(false), 100);
  }, []);

  const defaultProductionPlan: ProductionPlanData = [
    { product: "p1ChildrenBike", values: [0, 0, 0, 0] },
    { product: "p2WomenBike", values: [0, 0, 0, 0] },
    { product: "p3MenBike", values: [0, 0, 0, 0] },
  ];

  const [productionPlanData, setProductionPlanData] = useState<ProductionPlanData>(defaultProductionPlan);

  // Forecast beim ersten Laden aus localStorage holen
  useEffect(() => {
    const savedProductionPlan = localStorage.getItem("productionPlanData");
    if (savedProductionPlan) {
      try {
        setProductionPlanData(JSON.parse(savedProductionPlan));
      } catch (error) {
        console.error("Fehler beim Parsen der Forecast-Daten:", error);
        setProductionPlanData(defaultProductionPlan);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: 1400,
          backgroundColor: "#fafafa",
          boxSizing: "border-box",
        }}
      >
        <ProductionProgramTable productionData={productionPlanData} />
        <FutureInwardStockTable />
        {loading ? (
          <div>
            <Box sx={{ display: 'flex', marginLeft: 40 }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          wareHouseStockData && (

            <PurchaseDispositionTable
              initialInventoryData={wareHouseStockData}
              productionData={productionPlanData}
            />
          )
        )}

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