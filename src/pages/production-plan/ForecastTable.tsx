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
import { useState } from "react";

type ForecastData = {
  product: string;
  values: number[];
}[];

export default function ForecastTable() {
  const defaultForecast: ForecastData = [
    { product: "P1 Children Bike", values: [0, 0, 0, 0] },
    { product: "P2 Women Bike", values: [0, 0, 0, 0] },
    { product: "P3 Men Bike", values: [0, 0, 0, 0] },
  ];

  const [forecastData, setForecastData] =
    useState<ForecastData>(defaultForecast);

  const handleChange = (
    rowIndex: number,
    valueIndex: number,
    newValue: string
  ) => {
    const updatedData = [...forecastData];
    updatedData[rowIndex].values[valueIndex] = Number(newValue) || 0;
    setForecastData(updatedData);
  };

  const sumValues = forecastData[0].values.map((_, i) =>
    forecastData.reduce((sum, row) => sum + row.values[i], 0)
  );

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Prognosen
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 1000,
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell />
              {Array.from({ length: 4 }, (_, i) => (
                <TableCell key={i} align="center" sx={{ fontWeight: "bold" }}>
                  Periode {`n+${i}`}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {forecastData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell component="th" scope="row">
                  {row.product}
                </TableCell>
                {row.values.map((value, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <TextField
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleChange(rowIndex, colIndex, e.target.value)
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
                          border: "1px solid #ccc",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Summe</strong>
              </TableCell>
              {sumValues.map((val, i) => (
                <TableCell key={i} align="center">
                  <strong>{val}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
