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

export type SalesForecastData = {
  product: string;
  current: number;
}[];

export default function SalesForecastTable(props: {
  salesForecastData: SalesForecastData;
}) {
  const [salesForecastData, setSalesForecastData] = useState<SalesForecastData>(
    []
  );

  useEffect(() => {
    const savedSellWish = localStorage.getItem("sellwish");
    if (savedSellWish) {
      setSalesForecastData(JSON.parse(savedSellWish));
    } else {
      setSalesForecastData(props.salesForecastData);
    }
  }, [props.salesForecastData]);

  const handleChange = (index: number, key: "current", value: string) => {
    const updated = [...salesForecastData];
    updated[index][key] = Number(value) || 0;
    setSalesForecastData(updated);

    localStorage.setItem("sellwish", JSON.stringify(updated));
  };

  const salesSum = salesForecastData.reduce(
    (acc, row) => ({
      current: acc.current + row.current,
    }),
    { current: 0 }
  );
  const { t } = useLanguage();

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("salesForecast")}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 400,
          margin: "0 auto",
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell sx={{ fontWeight: "bold" }}>{t("product")}</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("salesForecast")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesForecastData.map((row, idx) => (
              <TableRow
                key={idx}
                hover
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{t(row.product)}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={row.current}
                    onChange={(e) =>
                      handleChange(idx, "current", e.target.value)
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
                        border: `1px solid ${
                          row.current === 0 ? "red" : "green"
                        }`,
                      },
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>{t("sum")}:</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{salesSum.current}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
