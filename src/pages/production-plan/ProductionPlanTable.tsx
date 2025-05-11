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

export type ProductionPlanData = {
  product: string;
  values: number[];
}[];

export default function ProductionPlanTable() {
  const { t } = useLanguage();

  const defaultProductionPlan: ProductionPlanData = [
    { product: "p1ChildrenBike", values: [0, 0, 0, 0] },
    { product: "p2WomenBike", values: [0, 0, 0, 0] },
    { product: "p3MenBike", values: [0, 0, 0, 0] },
  ];

  const [ProductionPlanData, setProductionPlanData] =
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

  const handleChange = (
    rowIndex: number,
    valueIndex: number,
    newValue: string
  ) => {
    const updatedData = [...ProductionPlanData];
    updatedData[rowIndex].values[valueIndex] = Number(newValue) || 0;
    setProductionPlanData(updatedData);

    localStorage.setItem("productionPlanData", JSON.stringify(updatedData));
  };

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("ProductionPlan")}
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
            {ProductionPlanData.map((row, rowIndex) => (
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
            {ProductionPlanData.length > 0 && ProductionPlanData[0]?.values && (
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>{t("sum")}</strong>
                </TableCell>
                {ProductionPlanData[0].values.map((_, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    <strong>
                      {ProductionPlanData.reduce(
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
