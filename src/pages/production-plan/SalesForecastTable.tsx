import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

type SalesForecastData = {
  product: string;
  current: number;
  next: number;
}[];

export default function SalesForecastTable(props: {
  salesForecastData: SalesForecastData;
}) {
  const [salesForecastData, setSalesForecastData] = useState<SalesForecastData>(
    []
  );

  useEffect(() => {
    setSalesForecastData(props.salesForecastData);
  }, [props.salesForecastData]);

  const handleChange = (
    index: number,
    key: "current" | "next",
    value: string
  ) => {
    const updated = [...salesForecastData];
    updated[index][key] = Number(value) || 0;
    setSalesForecastData(updated);
  };

  const salesSum = salesForecastData.reduce(
    (acc, row) => ({
      current: acc.current + row.current,
      next: acc.next + row.next,
    }),
    { current: 0, next: 0 }
  );

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        Verkaufswunsch
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Produkt</TableCell>
              <TableCell>Periode (Aktuell)</TableCell>
              <TableCell>Periode (n+1)</TableCell>
              <TableCell>Periode (n+2)</TableCell>
              <TableCell>Periode (n+3)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesForecastData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{`${row.product}: `}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={row.current}
                    onChange={(e) =>
                      handleChange(idx, "current", e.target.value)
                    }
                    variant="standard"
                    inputProps={{
                      style: { textAlign: "center", width: "3rem" },
                    }}
                  />
                </TableCell>
                {[...Array(3)].map((_, i) => (
                  <TableCell key={i}>
                    <TextField
                      type="number"
                      value={row.next}
                      onChange={(e) =>
                        handleChange(idx, "next", e.target.value)
                      }
                      variant="standard"
                      inputProps={{
                        style: { textAlign: "center", width: "3rem" },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Summe: </strong>
              </TableCell>
              <TableCell>
                <strong>{salesSum.current}</strong>
              </TableCell>
              {[...Array(3)].map((_, i) => (
                <TableCell key={i}>
                  <strong>{salesSum.next}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
