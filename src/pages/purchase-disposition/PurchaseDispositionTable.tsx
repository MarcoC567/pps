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
  Select, MenuItem,
  Tooltip
} from "@mui/material";

import { basicData, dynamicHeaders, fixedHeaders, modusDictionary, modusOptions } from "./const";
import { useState } from "react"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


type InitialInventory = {
  itemNr: number;
  amount: number;
}[];

type ProductionData = {
  product: string;
  values: number[];
}[];

export default function PurchaseDispositionTable(props: {
  initialInventoryData: InitialInventory;
  productionData: ProductionData;
}) {
  const initialInventoryData = props.initialInventoryData;
  const productionData = props.productionData;
  const [modusSelections, setModusSelections] = useState<string[]>(
    Array(initialInventoryData.length).fill("")
  );
  const [orderQuantities, setOrderQuantities] = useState<number[]>(
    Array(initialInventoryData.length).fill(0)
  );

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
    const discountAmount: number = basicData[index].discountQuantity;
    const deliveryTime: number | undefined | null =
      basicData[index].deliveryTime;
    const deviation: number | undefined | null =
      basicData[index].deliveryTimeDeviation;
    const deliveryCost: number | undefined | null =
      basicData[index].deliveryCost;
    const startPrice: number | undefined | null =
      basicData[index].startPrice;

    const usageRatioP1 = basicData[index].usageRatioP1;
    const usageRatioP2 = basicData[index].usageRatioP2;
    const usageRatioP3 = basicData[index].usageRatioP3;

    const prodDataP1 = productionData[0].values;
    const prodDataP2 = productionData[1].values;
    const prodDataP3 = productionData[2].values;

    const calculateGrossRequirement = (
      usageP1: number,
      usageP2: number,
      usageP3: number,
      idx: number
    ) =>
      usageP1 * prodDataP1[idx] +
      usageP2 * prodDataP2[idx] +
      usageP3 * prodDataP3[idx];

    return {
      itemNr: item.itemNr,
      amount: item.amount,
      discountAmount: discountAmount,
      deliveryTime: deliveryTime,
      deviation: deviation,
      usageRatioP1: usageRatioP1,
      usageRatioP2: usageRatioP2,
      usageRatioP3: usageRatioP3,
      deliveryCost: deliveryCost,
      startPrice: startPrice,
      grossRequirementN: calculateGrossRequirement(
        usageRatioP1,
        usageRatioP2,
        usageRatioP3,
        0
      ),
      grossRequirementN1: calculateGrossRequirement(
        usageRatioP1,
        usageRatioP2,
        usageRatioP3,
        1
      ),
      grossRequirementN2: calculateGrossRequirement(
        usageRatioP1,
        usageRatioP2,
        usageRatioP3,
        2
      ),
      grossRequirementN3: calculateGrossRequirement(
        usageRatioP1,
        usageRatioP2,
        usageRatioP3,
        3
      ),
    };
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Kaufteildisposition
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {fixedHeaders.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
              {dynamicHeaders.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
              <TableCell>ETA (Tagen)
                <Tooltip title="ETA = (Lieferzeit + Abweichung) * 5. Mit einer Wahrscheinlichkeit von 93 % entspricht dieser Wert der zu erwartenden maximalen Lieferzeit. Mit einer Wahrscheinlichkeit von 7 % ist eine um 1 bis 3 Tage längere Lieferzeit als der ETA zu erwarten." placement="top" arrow>
                  <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", color: "gray", cursor: "pointer" }} />
                </Tooltip>
              </TableCell>
              <TableCell>Bestellkosten (€)</TableCell>
              <TableCell>
                Gesamtkosten (€)&nbsp;
                <Tooltip title="Gesamtkosten = Materialkosten + Bestellkosten" placement="top" arrow>
                  <InfoOutlinedIcon sx={{ fontSize: 16, verticalAlign: "middle", color: "gray", cursor: "pointer" }} />
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const selectedModus = modusSelections[rowIndex];
              const factors = modusDictionary[selectedModus];
              const orderQuantity = orderQuantities[rowIndex] || 0;
              let unitCost: number = row.startPrice!;
              let orderCost: number = 0;
              const eta: number = factors ? (row.deliveryTime! * factors.deliveryDeadlineFactor + row.deviation! * factors.deliveryDeviationExtra) * 5 : 0;

              if (orderQuantity >= row.discountAmount && selectedModus === "Normal") {
                unitCost = 0.9 * row.startPrice!;
              }

              const materialCost = factors
                ? factors.priceFactor * unitCost * orderQuantity
                : 0;

              if (orderQuantity > 0) {
                orderCost = factors
                  ? row.deliveryCost! * factors.orderCostFactor
                  : 0;
              }


              const totalCost = materialCost + orderCost;

              return (
                <TableRow key={rowIndex}>
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
                      sx={{ width: 100 }}
                      size="small"
                      type="number"
                      defaultValue={0}
                      onChange={(e) =>
                        handleQuantityChange(rowIndex, parseFloat(e.target.value) || 0)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      variant="standard"
                      size="small"
                      value={modusSelections[rowIndex] || ""}
                      onChange={(e) => handleModusChange(rowIndex, e.target.value)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Modus wählen
                      </MenuItem>
                      {modusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {eta.toFixed(2)}
                  </TableCell>
                  <TableCell>{orderCost.toFixed(2)}</TableCell>
                  <TableCell>{totalCost.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
