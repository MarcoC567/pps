import Box from "@mui/material/Box";
import { basicData, items, modusOptions } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from "./PurchaseDispositionTable";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import FutureInwardStockTable from "./FutureInwardStockTable";
import { ProductionPlanData } from "../production-plan/ProductionPlanTable";
import { useCurrentPeriod } from "../../context/CurrentPeriodContext";

type WareHouseStockData = {
  itemNr: number;
  amount: number;
}[];

export type FutureStockEntry = {
  orderPeriod: number,
  mode: string,
  article: number,
  amount: number,
  inwardStockMovement: {
    period: number,
    day: number
  }
}

export default function PurchaseDispositionPage() {
  const [futureInwardStockData, setFutureInwardStockData] = useState<FutureStockEntry[]>([]);
  const [wareHouseStockData, setWareHouseStockData] = useState<WareHouseStockData>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleNextClick = () => {
    navigate("/xmlExport");
  };
  const { t } = useLanguage();

  const { currentPeriod } = useCurrentPeriod();

  // calculate future inward stock movement
  useEffect(() => {
    const importData = JSON.parse(localStorage.getItem('importData') || '{}') as {
      results?: {
        period: string
        futureinwardstockmovement?: {
          order?: Array<{ orderperiod: string, article: string, mode: string, amount: string }>;
        };
      };
    };

    console.log(importData.results?.futureinwardstockmovement?.order);

    if (!importData.results?.futureinwardstockmovement?.order) setFutureInwardStockData([])
    else {
      setFutureInwardStockData(
        importData.results?.futureinwardstockmovement?.order?.map(
          (order) => {
            const factors = modusOptions.find(option => option.modus == Number(order.mode));
            const articleBasicData = basicData.find(item => item.itemNr == Number(order.article))
            let eta = factors && articleBasicData && currentPeriod ? Math.ceil((articleBasicData.deliveryTime! * factors.deliveryDeadlineFactor + articleBasicData.deliveryTimeDeviation! * factors.deliveryDeviationExtra) * 5 ) : 0;
            eta = eta - (currentPeriod! + 1 - Number(order.orderperiod)) * 5
            const period = currentPeriod! + 1 + Math.floor(eta / 5);
            const day = (Math.ceil(eta) % 5) + 1;
            const newFutureStockEntry: FutureStockEntry = {
              orderPeriod: Number(order.orderperiod),
              amount: Number(order.amount),
              mode: factors ? factors.key : "NaN",
              article: Number(order.article),
              inwardStockMovement: {
                period, day
              }
            }
            return newFutureStockEntry
          }
        )
      )
    }
  }, [currentPeriod]);


  // set warehouse stock data
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
        <FutureInwardStockTable futureInwardStockData={futureInwardStockData} />
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
              futureInwardStockData={futureInwardStockData}
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