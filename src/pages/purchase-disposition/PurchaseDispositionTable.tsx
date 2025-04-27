import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Typography, Select, MenuItem, Tooltip
} from "@mui/material";
import { basicData, dynamicHeaders, fixedHeaders, modusDictionary, modusOptions } from "./const";
import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type InitialInventory = { itemNr: number; amount: number; }[];
type ProductionData = { product: string; values: number[]; }[];

export default function PurchaseDispositionTable(props: {
  initialInventoryData: InitialInventory;
  productionData: ProductionData;
}) {
  const initialInventoryData = props.initialInventoryData;
  const productionData = props.productionData;
  const [modusSelections, setModusSelections] = useState<string[]>(Array(initialInventoryData.length).fill(""));
  const [orderQuantities, setOrderQuantities] = useState<number[]>(Array(initialInventoryData.length).fill(0));

  const handleQuantityChange = (index: number, value: number) => {
    const updated = [...orderQuantities];
    updated[index] = value;
    setOrderQuantities(updated);
  };

  const handleModusChange = (rowIndex: number, value: string) => {
    const updatedSelections = [...modusSelections];
    updatedSelections[rowIndex] = value;
    setModusSelections(updatedSelections);
  };

  const rows = initialInventoryData.map((item, index) => {
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

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        Kaufteildisposition
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: 1000, borderRadius: 3, boxShadow: 3, overflow: "contain" }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              {[...fixedHeaders, ...dynamicHeaders, "ETA (Tagen)", "Bestellkosten (€)", "Gesamtkosten (€)"].map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {header.includes("ETA") ? (
                    <>
                      {header}
                      <Tooltip title="ETA = (Lieferzeit + Abweichung) * 5. Mit einer Wahrscheinlichkeit von 93 % entspricht dieser Wert der zu erwartenden maximalen Lieferzeit. Mit einer Wahrscheinlichkeit von 7 % ist eine um 1 bis 3 Tage längere Lieferzeit als der ETA zu erwarten" placement="top" arrow>
                        <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", color: "gray", cursor: "pointer" }} />
                      </Tooltip>
                    </>
                  ) : header.includes("Gesamtkosten") ? (
                    <>
                      {header}
                      <Tooltip title="Gesamtkosten = Materialkosten + Bestellkosten" placement="top" arrow>
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
              const selectedModus = modusSelections[rowIndex];
              const factors = modusDictionary[selectedModus];
              const orderQuantity = orderQuantities[rowIndex] || 0;
              const eta = factors ? (row.deliveryTime! * factors.deliveryDeadlineFactor + row.deviation! * factors.deliveryDeviationExtra) * 5 : 0;
              const unitCost = (orderQuantity >= row.discountAmount && selectedModus === "Normal")
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
                      value={orderQuantities[rowIndex]}
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
                      value={modusSelections[rowIndex] || ""}
                      onChange={(e) => handleModusChange(rowIndex, e.target.value)}
                      displayEmpty
                      sx={{
                        width: "7rem",
                        "& .MuiOutlinedInput-notchedOutline": { borderRadius: "8px" }
                      }}
                    >
                      <MenuItem value="" disabled>Modus wählen</MenuItem>
                      {modusOptions.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
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
              <TableCell sx={{ fontWeight: "bold" }}>Summe der Gesamtkosten</TableCell>
              {/* Empty cells to align correctly */}
              {Array(15).fill(null).map((_, i) => (
                <TableCell key={i} />
              ))}

              {/* Total Sum */}
              <TableCell align="center">
                <strong>
                  {rows.reduce((sum, _, rowIndex) => {
                    const selectedModus = modusSelections[rowIndex];
                    const factors = modusDictionary[selectedModus];
                    const orderQuantity = orderQuantities[rowIndex] || 0;
                    const unitCost = (orderQuantity >= rows[rowIndex].discountAmount && selectedModus === "Normal")
                      ? 0.9 * rows[rowIndex].startPrice!
                      : rows[rowIndex].startPrice!;
                    const materialCost = factors ? factors.priceFactor * unitCost * orderQuantity : 0;
                    const orderCost = orderQuantity > 0 ? (factors ? rows[rowIndex].deliveryCost! * factors.orderCostFactor : 0) : 0;
                    const totalCost = materialCost + orderCost;
                    return sum + totalCost;
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