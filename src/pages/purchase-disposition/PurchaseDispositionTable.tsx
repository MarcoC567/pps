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
} from "@mui/material";

import { basicData } from "./const";

type InitialInventory = {
  itemNr: number;
  ammount: number;
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

  const fixedHeaders = [
    "ArtikelNr.",
    "Lieferzeit",
    "Abweichung",
    "Max Lieferzeit in Tagen",
    "P1",
    "P2",
    "P3",
    "Diskontmenge",
    "Anfangsbestand in Periode n",
    "n",
    "n+1",
    "n+2",
    "n+3",
  ];
  const dynamicHeaders = ["Menge", "Modus"];

  const rows = initialInventoryData.map((item, index) => {
    const discountAmount: number = basicData[index].discountQuantity;
    const deliveryTime: number | undefined | null =
      basicData[index].deliveryTime;
    const deviation: number | undefined | null =
      basicData[index].deliveryTimeDeviation;
    const maxDeliveryTime: number | undefined | null =
      (deliveryTime! + deviation!) * 5;

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
      ammount: item.ammount,
      discountAmmount: discountAmount,
      deliveryTime: deliveryTime,
      deviation: deviation,
      maxDeliveryTime: maxDeliveryTime,
      usageRatioP1: usageRatioP1,
      usageRatioP2: usageRatioP2,
      usageRatioP3: usageRatioP3,
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
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>{row.itemNr}</TableCell>
                <TableCell>{row.deliveryTime}</TableCell>
                <TableCell>{row.deviation}</TableCell>
                <TableCell>{row.maxDeliveryTime}</TableCell>
                <TableCell>{row.usageRatioP1}</TableCell>
                <TableCell>{row.usageRatioP2}</TableCell>
                <TableCell>{row.usageRatioP3}</TableCell>
                <TableCell>{row.discountAmmount}</TableCell>
                <TableCell>{row.ammount}</TableCell>
                <TableCell>{row.grossRequirementN}</TableCell>
                <TableCell>{row.grossRequirementN1}</TableCell>
                <TableCell>{row.grossRequirementN2}</TableCell>
                <TableCell>{row.grossRequirementN3}</TableCell>

                {dynamicHeaders.map((_, index) => (
                  <TableCell key={index}>
                    <TextField variant="standard" size="small" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
