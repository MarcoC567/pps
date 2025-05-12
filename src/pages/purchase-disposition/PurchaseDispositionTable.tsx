import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { basicData, modusOptions } from "./const";
import { useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLanguage } from "../../context/LanguageContext";
import { ProductionPlanData } from "../production-plan/ProductionPlanTable";
import { useCurrentPeriod } from "../../context/CurrentPeriodContext";
import { FutureStockEntry, OrderEntry } from ".";

type InitialInventory = { itemNr: number; amount: number }[];


export default function PurchaseDispositionTable(props: {
  initialInventoryData: InitialInventory;
  productionData: ProductionPlanData;
  futureInwardStockData: FutureStockEntry[];
  orderList: OrderEntry[],
  setOrderList: (newOrderList: OrderEntry[]) => void;
}) {
  const orderList = props.orderList;
  const setOrderList = props.setOrderList;
  const { t } = useLanguage();
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
    `${t("period")} ${currentPeriod! + 1}`,
    `${t("period")} ${currentPeriod! + 2}`,
    `${t("period")} ${currentPeriod! + 3}`,
    `${t("period")} ${currentPeriod! + 4}`,
  ];
  const dynamicHeaders = [t("quantity"), t("mode")];
  const initialInventoryData = props.initialInventoryData;
  const productionData = props.productionData;

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
      const calculateGrossRequirement = (
        u1: number,
        u2: number,
        u3: number,
        idx: number
      ) =>
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
        grossRequirementN: calculateGrossRequirement(
          data.usageRatioP1,
          data.usageRatioP2,
          data.usageRatioP3,
          0
        ),
        grossRequirementN1: calculateGrossRequirement(
          data.usageRatioP1,
          data.usageRatioP2,
          data.usageRatioP3,
          1
        ),
        grossRequirementN2: calculateGrossRequirement(
          data.usageRatioP1,
          data.usageRatioP2,
          data.usageRatioP3,
          2
        ),
        grossRequirementN3: calculateGrossRequirement(
          data.usageRatioP1,
          data.usageRatioP2,
          data.usageRatioP3,
          3
        ),
      };
    });
  }, [initialInventoryData, productionData]);

  const getIncomingForPeriod = (article: number, period: number) => {
    return props.futureInwardStockData.filter(
      (stock) =>
        stock.article === article && stock.inwardStockMovement.period === period
    );
  };

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
        sx={{
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          borderRadius: 3,
          boxShadow: 3,
          overflow: "contain",
        }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              {[
                ...fixedHeaders,
                ...dynamicHeaders,
                t("eta"),
                t("orderCost"),
                t("totalCost"),
              ].map((header, i) => (
                <TableCell align="center" key={i} sx={{ fontWeight: "bold" }}>
                  {header.includes(t("eta")) ? (
                    <>
                      {header}
                      <Tooltip title={t("tooltip_eta")} placement="top" arrow>
                        <InfoOutlinedIcon
                          sx={{
                            fontSize: 16,
                            verticalAlign: "middle",
                            color: "gray",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : header.includes(t("totalCost")) ? (
                    <>
                      {header}
                      <Tooltip
                        title={t("tooltip_totalCost")}
                        placement="top"
                        arrow
                      >
                        <InfoOutlinedIcon
                          sx={{
                            fontSize: 16,
                            verticalAlign: "middle",
                            color: "gray",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </>
                  ) : (
                    header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const entry = orderList[rowIndex];
              const selectedModus = entry.modus;
              const orderQuantity = entry.quantity;
              const factors = modusOptions.find(
                (option) => option.key == selectedModus
              );
              const eta = factors
                ? (row.deliveryTime! * factors.deliveryDeadlineFactor +
                  row.deviation! * factors.deliveryDeviationExtra) *
                5
                : 0;
              const unitCost =
                orderQuantity >= row.discountAmount &&
                  selectedModus === "normal"
                  ? 0.9 * row.startPrice!
                  : row.startPrice!;
              const materialCost = factors
                ? factors.priceFactor * unitCost * orderQuantity
                : 0;
              const orderCost =
                orderQuantity > 0
                  ? factors
                    ? row.deliveryCost! * factors.orderCostFactor
                    : 0
                  : 0;
              const totalCost = materialCost + orderCost;

              return (
                <TableRow
                  key={rowIndex}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell align="center">{row.itemNr}</TableCell>
                  <TableCell align="center">{row.deliveryTime}</TableCell>
                  <TableCell align="center">{row.deviation}</TableCell>
                  <TableCell align="center">{row.usageRatioP1}</TableCell>
                  <TableCell align="center">{row.usageRatioP2}</TableCell>
                  <TableCell align="center">{row.usageRatioP3}</TableCell>
                  <TableCell align="center">{row.discountAmount}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>

                  <TableCell align="center">
                    {row.grossRequirementN}
                    {getIncomingForPeriod(row.itemNr, currentPeriod! + 1).length >
                      0 && (
                        <Tooltip
                          title={
                            <div>
                              {getIncomingForPeriod(
                                row.itemNr,
                                currentPeriod! + 1
                              ).map((stock, i) => (
                                <div key={i}>
                                  {t("incomingAmount")}: {stock.amount},{" "}
                                  {t("day")}: {stock.inwardStockMovement.day}
                                </div>
                              ))}
                            </div>
                          }
                          placement="top"
                          arrow
                        >
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: 16,
                              verticalAlign: "middle",
                              color: "gray",
                              ml: 0.5,
                            }}
                          />
                        </Tooltip>
                      )}
                  </TableCell>

                  <TableCell align="center">
                    {row.grossRequirementN1}
                    {getIncomingForPeriod(row.itemNr, currentPeriod! + 2)
                      .length > 0 && (
                        <Tooltip
                          title={
                            <div>
                              {getIncomingForPeriod(
                                row.itemNr,
                                currentPeriod! + 2
                              ).map((stock, i) => (
                                <div key={i}>
                                  {t("incomingAmount")}: {stock.amount},{" "}
                                  {t("day")}: {stock.inwardStockMovement.day}
                                </div>
                              ))}
                            </div>
                          }
                          placement="top"
                          arrow
                        >
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: 16,
                              verticalAlign: "middle",
                              color: "gray",
                              ml: 0.5,
                            }}
                          />
                        </Tooltip>
                      )}
                  </TableCell>

                  <TableCell align="center">
                    {row.grossRequirementN2}
                    {getIncomingForPeriod(row.itemNr, currentPeriod! + 3)
                      .length > 0 && (
                        <Tooltip
                          title={
                            <div>
                              {getIncomingForPeriod(
                                row.itemNr,
                                currentPeriod! + 3
                              ).map((stock, i) => (
                                <div key={i}>
                                  {t("incomingAmount")}: {stock.amount},{" "}
                                  {t("day")}: {stock.inwardStockMovement.day}
                                </div>
                              ))}
                            </div>
                          }
                          placement="top"
                          arrow
                        >
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: 16,
                              verticalAlign: "middle",
                              color: "gray",
                              ml: 0.5,
                            }}
                          />
                        </Tooltip>
                      )}
                  </TableCell>

                  <TableCell align="center">
                    {row.grossRequirementN3}
                    {getIncomingForPeriod(row.itemNr, currentPeriod! + 4)
                      .length > 0 && (
                        <Tooltip
                          title={
                            <div>
                              {getIncomingForPeriod(
                                row.itemNr,
                                currentPeriod! + 4
                              ).map((stock, i) => (
                                <div key={i}>
                                  {t("incomingAmount")}: {stock.amount},{" "}
                                  {t("day")}: {stock.inwardStockMovement.day}
                                </div>
                              ))}
                            </div>
                          }
                          placement="top"
                          arrow
                        >
                          <InfoOutlinedIcon
                            sx={{
                              fontSize: 16,
                              verticalAlign: "middle",
                              color: "gray",
                              ml: 0.5,
                            }}
                          />
                        </Tooltip>
                      )}
                  </TableCell>

                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={entry.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          rowIndex,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        width: "4rem",
                        input: {
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "8px",
                          backgroundColor: "#fdfdfd",
                          border: `1px solid ${entry.quantity < 0 || (entry.quantity == 0 && entry.modus !== "")? "red" : "green"}`
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      variant="outlined"
                      size="small"
                      value={entry.modus || ""}
                      onChange={(e) =>
                        handleModusChange(rowIndex, e.target.value)
                      }
                      displayEmpty
                      sx={{
                        width: "7rem",
                        border: `1px solid ${entry.quantity > 0 && entry.modus == "" ? "red" : "green"}`
                      }}
                    >
                      <MenuItem value="" disabled>
                        {t("selectMode")}
                      </MenuItem>
                      {modusOptions.map((option) => (
                        <MenuItem key={option.key} value={option.key}>
                          {t(option.key)}
                        </MenuItem>
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
              <TableCell sx={{ fontWeight: "bold" }}>
                {t("sum_of_the_total_costs")}
              </TableCell>
              {Array(15)
                .fill(null)
                .map((_, i) => (
                  <TableCell key={i} />
                ))}
              <TableCell align="center">
                <strong>
                  {rows
                    .reduce((sum, _, rowIndex) => {
                      const { modus, quantity } = orderList[rowIndex];
                      const factors = modusOptions.find(
                        (option) => option.key == modus
                      );
                      const unitCost =
                        quantity >= rows[rowIndex].discountAmount &&
                          modus === "normal"
                          ? 0.9 * rows[rowIndex].startPrice!
                          : rows[rowIndex].startPrice!;
                      const materialCost = factors
                        ? factors.priceFactor * unitCost * quantity
                        : 0;
                      const orderCost =
                        quantity > 0
                          ? factors
                            ? rows[rowIndex].deliveryCost! *
                            factors.orderCostFactor
                            : 0
                          : 0;
                      return sum + materialCost + orderCost;
                    }, 0)
                    .toFixed(2)}
                </strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
