import Box from "@mui/material/Box";
import { items } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from "./PurchaseDispositionTable";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";

type WareHouseStockData = {
  itemNr: number;
  amount: number;
}[];

export default function PurchaseDispositionPage() {
  const [wareHouseStockData, setWareHouseStockData] = useState<WareHouseStockData>();
  const [loading, setLoading] = useState(true);

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

    setTimeout(() => setLoading(false), 1000);
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
          maxWidth: "95vw",
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
      </Paper>
    </div>
  );
}