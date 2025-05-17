import Box from "@mui/material/Box";
import { basicData, items, modusOptions } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from './PurchaseDispositionTable';
import { useState, useEffect, useMemo } from "react";
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

export type PurchaseDispositionStaticData = {
  itemNr: number;
  amount: number;
  discountAmount: number;
  deliveryTime: number | null | undefined;
  deviation: number | null | undefined;
  usageRatioP1: number;
  usageRatioP2: number;
  usageRatioP3: number;
  deliveryCost: number | null | undefined;
  startPrice: number | undefined;
  grossRequirements: number[];
}[] | undefined

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

  const rows: PurchaseDispositionStaticData = useMemo(() => {
    return wareHouseStockData?.map((item, index) => {
      const data = basicData[index];
      const calculateGrossRequirement = (
        u1: number,
        u2: number,
        u3: number,
        idx: number
      ) =>
        u1 * productionPlanData[0].values[idx] +
        u2 * productionPlanData[1].values[idx] +
        u3 * productionPlanData[2].values[idx];

      return {
        itemNr: item.itemNr,
        amount: item.amount,
        discountAmount: data.discountQuantity,
        deliveryTime: data.deliveryTime,
        deviation: data.deliveryTimeDeviation,
        usageRatioP1: data.usageRatioP1,
        usageRatioP2: data.usageRatioP2,
        usageRatioP3: data.usageRatioP3,
        deliveryCost: data.deliveryCost,
        startPrice: data.startPrice,
        grossRequirements: [
          calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 0),
          calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 1),
          calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 2),
          calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 3),
        ],
      };
    });
  }, [wareHouseStockData, productionPlanData]);

  const [orderList, setOrderList] = useState<OrderEntry[] | undefined>(() => {
    const saved = localStorage.getItem("orderList");
    if (saved && saved !== "undefined") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved orderList:", e);
      }
    }
    return undefined;
  });

  const getIncomingForPeriod = (article: number, period: number) => {
    return futureInwardStockData.filter(
      (stock) =>
        stock.article === article && stock.inwardStockMovement.period === period
    );
  };

  useEffect(() => {
    if (!orderList && rows && futureInwardStockData) {
      setOrderList(
        rows.map((item) => {
          let optimalQuantity = 0;
          let optimalMode = "";
          let initialInventory = item.amount
          const eta = item.deliveryTime! + item.deviation!

          for (let i = 0; i <= 3; i++) {
            initialInventory -= item.grossRequirements[i]
            const inwardStockinThisPeriod = getIncomingForPeriod(
              item.itemNr, i + currentPeriod! + 1
            )
            // Incoming stock
            if (initialInventory < 0) {
              if (eta > i) {
                optimalQuantity = item.discountAmount
                optimalMode = "fast"
              }
              else {
                optimalQuantity = item.discountAmount
                optimalMode = "normal"
              }
              if (initialInventory + optimalQuantity < 0) {
                optimalQuantity = -(initialInventory)
              }
              break;
            }
            initialInventory += inwardStockinThisPeriod.reduce((sum, current) => sum + current.amount, 0)
          }

          return (
            {
              article: item.itemNr,
              quantity: optimalQuantity,
              modus: optimalMode
            })
        }
        )
      );
    }

    setTimeout(() => setLoading(false), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderList, rows, futureInwardStockData,]);

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
          orderList && rows && (
            <PurchaseDispositionTable
              rows={rows}
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
