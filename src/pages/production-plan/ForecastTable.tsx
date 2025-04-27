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
import { useLanguage } from "../../context/LanguageContext.tsx";

type ForecastData = {
  product: string;
  values: number[];
}[];

export default function ForecastTable() {
  const { t } = useLanguage();

  const defaultForecast: ForecastData = [
    { product: "p1ChildrenBike", values: [0, 0, 0, 0] },
    { product: "p2WomenBike", values: [0, 0, 0, 0] },
    { product: "p3MenBike", values: [0, 0, 0, 0] },
  ];

  const [forecastData, setForecastData] =
    useState<ForecastData>(defaultForecast);

  // Forecast beim ersten Laden aus localStorage holen
  useEffect(() => {
    const savedForecast = localStorage.getItem("forecastdata");
    if (savedForecast) {
      try {
        setForecastData(JSON.parse(savedForecast));
      } catch (error) {
        console.error("Fehler beim Parsen der Forecast-Daten:", error);
        setForecastData(defaultForecast);
      }
    }
  }, []);

  const handleChange = (
    rowIndex: number,
    valueIndex: number,
    newValue: string
  ) => {
    const updatedData = [...forecastData];
    updatedData[rowIndex].values[valueIndex] = Number(newValue) || 0;
    setForecastData(updatedData);

    localStorage.setItem("forecastdata", JSON.stringify(updatedData));
  };

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("forecastonly")}
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
                  {t("period")} {`n+${i}`}
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
                  {t(row.product)}
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
                          border: `1px solid ${value === 0 ? "red" : "green"}`,
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
            {forecastData.length > 0 && forecastData[0]?.values && (
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>{t("sum")}</strong>
                </TableCell>
                {forecastData[0].values.map((_, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <strong>
                      {forecastData.reduce(
                        (sum, row) => sum + (row.values?.[colIndex] || 0),
                        0
                      )}
                    </strong>
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
