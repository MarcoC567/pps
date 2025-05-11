import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Typography, Select, MenuItem, Tooltip
} from "@mui/material";
import { basicData, modusOptions } from "./const";
import { useEffect, useMemo, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLanguage } from "../../context/LanguageContext";
import { ProductionPlanData } from "../production-plan/ProductionPlanTable";
import { useCurrentPeriod } from "../../context/CurrentPeriodContext";

type InitialInventory = { itemNr: number; amount: number; }[];
export type OrderEntry = { article: number, quantity: number; modus: string };

export default function PurchaseDispositionTable(props: {
  initialInventoryData: InitialInventory;
  productionData: ProductionPlanData;
}) {
  const { t } = useLanguage()
  const { currentPeriod } = useCurrentPeriod();
  const fixedHeaders = [
    t("article"),
    t("delieveryTime"),
    t("deviation"),
    "P1",
    "P2",
    "P3",
    t("discountedAmount"),
    t("initial_stock_in_period_n"),
    `${t('period')} ${currentPeriod!}`,
    `${t('period')} ${currentPeriod! + 1}`,
    `${t('period')} ${currentPeriod! + 2}`,
    `${t('period')} ${currentPeriod! + 3}`,
  ];
  const dynamicHeaders = [t("quantity"), t("mode")];
  const initialInventoryData = props.initialInventoryData;
  const productionData = props.productionData;

  const [orderList, setOrderList] = useState<OrderEntry[]>(() => {
    const saved = localStorage.getItem("orderList");
    return saved ? JSON.parse(saved) : initialInventoryData.map((item) => {
      return {
        article: item.itemNr,
        quantity: 0,
        modus: "",
      }
    });
  });

  useEffect(() => {
    localStorage.setItem("orderList", JSON.stringify(orderList));
  }, [orderList]);

  const handleQuantityChange = (index: number, value: number) => {
    const updated = [...orderList];
    updated[index].quantity = value;
    setOrderList(updated);
  };

  const handleModusChange = (index: number, value: string) => {
    const updated = [...orderList];
    updated[index].modus = value;
    setOrderList(updated);
  };

  const rows = useMemo(() => {
    return initialInventoryData.map((item, index) => {
      const data = basicData[index];
      const calculateGrossRequirement = (u1: number, u2: number, u3: number, idx: number) =>
        u1 * productionData[0].values[idx] +
        u2 * productionData[1].values[idx] +
        u3 * productionData[2].values[idx];

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
        grossRequirementN: calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 0),
        grossRequirementN1: calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 1),
        grossRequirementN2: calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 2),
        grossRequirementN3: calculateGrossRequirement(data.usageRatioP1, data.usageRatioP2, data.usageRatioP3, 3),
      };
    });
  }, [initialInventoryData, productionData]);

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("purchasePartsDisposition")}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: 1400, width: "100%", margin: "0 auto", borderRadius: 3, boxShadow: 3, overflow: "contain" }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              {[...fixedHeaders, ...dynamicHeaders, t("eta"), t("orderCost"), t("totalCost")].map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {header.includes(t("eta")) ? (
                    <>
                      {header}
                      <Tooltip title={t("tooltip_eta")} placement="top" arrow>
                        <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", color: "gray", cursor: "pointer" }} />
                      </Tooltip>
                    </>
                  ) : header.includes(t("totalCost")) ? (
                    <>
                      {header}
                      <Tooltip title={t("tooltip_totalCost")} placement="top" arrow>
                        <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", color: "gray", cursor: "pointer" }} />
                      </Tooltip>
                    </>
                  ) : (header)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const entry = orderList[rowIndex];
              const selectedModus = entry.modus;
              const orderQuantity = entry.quantity;
              const factors = modusOptions.find(option => option.key == selectedModus);
              const eta = factors ? (row.deliveryTime! * factors.deliveryDeadlineFactor + row.deviation! * factors.deliveryDeviationExtra) * 5 : 0;
              const unitCost = (orderQuantity >= row.discountAmount && selectedModus === "normal")
                ? 0.9 * row.startPrice!
                : row.startPrice!;
              const materialCost = factors ? factors.priceFactor * unitCost * orderQuantity : 0;
              const orderCost = orderQuantity > 0 ? (factors ? row.deliveryCost! * factors.orderCostFactor : 0) : 0;
              const totalCost = materialCost + orderCost;

              return (
                <TableRow
                  key={rowIndex}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell>{row.itemNr}</TableCell>
                  <TableCell>{row.deliveryTime}</TableCell>
                  <TableCell>{row.deviation}</TableCell>
                  <TableCell>{row.usageRatioP1}</TableCell>
                  <TableCell>{row.usageRatioP2}</TableCell>
                  <TableCell>{row.usageRatioP3}</TableCell>
                  <TableCell>{row.discountAmount}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.grossRequirementN}</TableCell>
                  <TableCell>{row.grossRequirementN1}</TableCell>
                  <TableCell>{row.grossRequirementN2}</TableCell>
                  <TableCell>{row.grossRequirementN3}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={entry.quantity}
                      onChange={(e) => handleQuantityChange(rowIndex, parseFloat(e.target.value) || 0)}
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "4rem",
                        input: {
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "8px",
                          backgroundColor: "#fdfdfd",
                          border: "1px solid #ccc",
                        },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      variant="outlined"
                      size="small"
                      value={entry.modus || ""}
                      onChange={(e) => handleModusChange(rowIndex, e.target.value)}
                      displayEmpty
                      sx={{
                        width: "7rem",
                        "& .MuiOutlinedInput-notchedOutline": { borderRadius: "8px" }
                      }}
                    >
                      <MenuItem value="" disabled>{t("selectMode")}</MenuItem>
                      {modusOptions.map((option) => (
                        <MenuItem key={option.key} value={option.key}>{t(option.key)}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell align="center">{eta.toFixed(2)}</TableCell>
                  <TableCell align="center">{orderCost.toFixed(2)}</TableCell>
                  <TableCell align="center">{totalCost.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}>
              <TableCell sx={{ fontWeight: "bold" }}>{t("sum_of_the_total_costs")}</TableCell>
              {Array(15).fill(null).map((_, i) => <TableCell key={i} />)}
              <TableCell align="center">
                <strong>
                  {rows.reduce((sum, _, rowIndex) => {
                    const { modus, quantity } = orderList[rowIndex];
                    const factors = modusOptions.find(option => option.key == modus);
                    const unitCost = (quantity >= rows[rowIndex].discountAmount && modus === "normal")
                      ? 0.9 * rows[rowIndex].startPrice!
                      : rows[rowIndex].startPrice!;
                    const materialCost = factors ? factors.priceFactor * unitCost * quantity : 0;
                    const orderCost = quantity > 0 ? (factors ? rows[rowIndex].deliveryCost! * factors.orderCostFactor : 0) : 0;
                    return sum + materialCost + orderCost;
                  }, 0).toFixed(2)}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
