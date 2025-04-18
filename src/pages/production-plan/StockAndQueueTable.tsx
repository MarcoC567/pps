import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export type StockData = {
  product: string;
  stock: number;
  endStock: number;
  waitingList: number;
  inProduction: number;
};

export default function StockAndQueueTable(props: { stockData: StockData[] }) {
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    setStockData(props.stockData);
  }, [props.stockData]);

  const handleChange = (
    index: number,
    key: keyof Omit<StockData, "product">,
    value: string
  ) => {
    const updated = [...stockData];
    updated[index][key] = Number(value) || 0;
    setStockData(updated);
  };

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        Lagerbestand &amp; Warteschlange
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Zugehörigkeit</TableCell>
              <TableCell align="center">Lagerbestand</TableCell>
              <TableCell align="center">Gepl. Lagerbestand am Ende</TableCell>
              <TableCell align="center">Warteschlange</TableCell>
              <TableCell align="center">Aufträge in Bearbeitung</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.product}</TableCell>
                {["stock", "endStock", "waitingList", "inProduction"].map(
                  (field) => (
                    <TableCell key={field} align="center">
                      <TextField
                        type="number"
                        value={row[field as keyof Omit<StockData, "product">]}
                        onChange={(e) =>
                          handleChange(
                            i,
                            field as keyof Omit<StockData, "product">,
                            e.target.value
                          )
                        }
                        variant="standard"
                        inputProps={{
                          style: { textAlign: "center", width: "3rem" },
                        }}
                      />
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
