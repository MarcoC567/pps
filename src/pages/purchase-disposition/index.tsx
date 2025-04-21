import Box from "@mui/material/Box";
import { items } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from "./PurchaseDispositionTable";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

type WareHouseStockData = {
  itemNr: number;
  amount: number;
}[];

export default function PurchaseDispositionPage() {
  const [wareHouseStockData, setWareHouseStockData] = useState<WareHouseStockData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const importData: object = JSON.parse(localStorage.getItem('importData') || '{}');
    console.log(importData)
    setWareHouseStockData(items.map((itemNumber) => {
      const amount: string = importData["results"]["warehousestock"]["article"][(itemNumber - 1).toString()]?.amount ?? "0";
      return {
        itemNr: itemNumber,
        amount: Number(amount),
      };
    }));

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
    <div>
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
    </div>
  );
}