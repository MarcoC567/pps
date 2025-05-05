import Box from "@mui/material/Box";
import { items } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from "./PurchaseDispositionTable";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

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

  const productionData = [
    {
      product: "P1 Children Bike",
      values: [150, 150, 150, 150],
    },
    {
      product: "P2 Women Bike",
      values: [150, 150, 150, 100],
    },
    {
      product: "P3 Men Bike",
      values: [150, 150, 150, 100],
    },
  ];

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
        <ProductionProgramTable productionData={productionData} />
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
              productionData={productionData}
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