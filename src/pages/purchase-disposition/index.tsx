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
  orderPeriod: number;
  mode: string;
  article: number;
  amount: number;
  inwardStockMovement: {
    period: number;
    day: number;
  };
};

export type OrderEntry = { article: number; quantity: number; modus: string };

export default function PurchaseDispositionPage() {
  const [futureInwardStockData, setFutureInwardStockData] = useState<
    FutureStockEntry[]
  >([]);
  const [wareHouseStockData, setWareHouseStockData] =
    useState<WareHouseStockData>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleNextClick = () => {
    localStorage.setItem("visited_/purchase-disposition", "true");
    localStorage.setItem("visited_/xmlExport", "true");
    navigate("/xmlExport");
  };
  const { t } = useLanguage();

  const { currentPeriod } = useCurrentPeriod();

  // calculate future inward stock movement
  useEffect(() => {
    const importData = JSON.parse(
      localStorage.getItem("importData") || "{}"
    ) as {
      results?: {
        period: string;
        futureinwardstockmovement?: {
          order?: Array<{
            orderperiod: string;
            article: string;
            mode: string;
            amount: string;
          }>;
        };
      };
    };

    console.log(importData.results?.futureinwardstockmovement?.order);

    if (!importData.results?.futureinwardstockmovement?.order)
      setFutureInwardStockData([]);
    else {
      setFutureInwardStockData(
        importData.results?.futureinwardstockmovement?.order?.map((order) => {
          const factors = modusOptions.find(
            (option) => option.modus == Number(order.mode)
          );
          const articleBasicData = basicData.find(
            (item) => item.itemNr == Number(order.article)
          );
          let eta =
            factors && articleBasicData && currentPeriod
              ? Math.floor(
                (articleBasicData.deliveryTime! *
                  factors.deliveryDeadlineFactor +
                  articleBasicData.deliveryTimeDeviation! *
                  factors.deliveryDeviationExtra) *
                5
              )
              : 0;
          eta = eta - (currentPeriod! + 1 - Number(order.orderperiod)) * 5 + 1;
          const period = currentPeriod! + 1 + Math.floor(eta / 5);
          const day = (Math.ceil(eta) % 5) + 1;
          const newFutureStockEntry: FutureStockEntry = {
            orderPeriod: Number(order.orderperiod),
            amount: Number(order.amount),
            mode: factors ? factors.key : "NaN",
            article: Number(order.article),
            inwardStockMovement: {
              period,
              day,
            },
          };
          return newFutureStockEntry;
        })
      );
    }
  }, [currentPeriod]);

  // set warehouse stock data
  useEffect(() => {
    const importData = JSON.parse(
      localStorage.getItem("importData") || "{}"
    ) as {
      results?: {
        warehousestock?: {
          article?: Record<string, { amount?: string }>;
        };
      };
    };

    console.log(importData);

    setWareHouseStockData(
      items.map((itemNumber) => {
        const amount: string =
          importData.results?.warehousestock?.article?.[`${itemNumber - 1}`]
            ?.amount ?? "0";
        return {
          itemNr: itemNumber,
          amount: Number(amount),
        };
      })
    );
  }, []);

  const defaultProductionPlan: ProductionPlanData = [
    { product: "p1ChildrenBike", values: [0, 0, 0, 0] },
    { product: "p2WomenBike", values: [0, 0, 0, 0] },
    { product: "p3MenBike", values: [0, 0, 0, 0] },
  ];

  const [productionPlanData, setProductionPlanData] =
    useState<ProductionPlanData>(defaultProductionPlan);

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

  const [orderList, setOrderList] = useState<OrderEntry[]>();

  useEffect(() => {
    const saved = localStorage.getItem("orderList");
    if (saved && saved != "undefined") {
      try {
        setOrderList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved orderList:", e);
      }
    } else if (wareHouseStockData) {
      setOrderList(
        wareHouseStockData.map((item) => ({
          article: item.itemNr,
          quantity: 0,
          modus: "",
        }))
      );
    }

    setTimeout(() => setLoading(false), 100);
  }, [wareHouseStockData]);

  // Persistenz
  useEffect(() => {
    localStorage.setItem("orderList", JSON.stringify(orderList));
  }, [orderList]);

  // Validierung
  const allValid = (): boolean =>
    Array.isArray(orderList) &&
    orderList.every(
      (order) =>
        (order.quantity === 0 && order.modus === "") ||
        (order.quantity > 0 && order.modus !== "")
    );

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
            <Box sx={{ display: "flex", marginLeft: 40 }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          orderList && wareHouseStockData && (
            <PurchaseDispositionTable
              initialInventoryData={wareHouseStockData}
              productionData={productionPlanData}
              futureInwardStockData={futureInwardStockData}
              orderList={orderList}
              setOrderList={setOrderList}
            />
          )
        )}

        <button onClick={handleNextClick} disabled={!allValid()} className={`mt-4 mx-auto my-btn`}>
          {t("next")}
        </button>
      </Paper>
    </div>
  );
}
