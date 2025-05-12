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
import { useLanguage } from "../../context/LanguageContext.tsx";

export type SalesForecastData = {
  product: string;
  current: number;
}[];

interface SalesForecastTableProps {
  data: SalesForecastData;
  onChange: (newData: SalesForecastData) => void;
}

export default function SalesForecastTable({
  data,
  onChange,
}: SalesForecastTableProps) {
  const { t } = useLanguage();

  const handleChange = (index: number, newValue: string) => {
    const updated = data.map((row, i) =>
      i === index ? { ...row, current: Number(newValue) || 0 } : row
    );
    onChange(updated);
  };

  const sum = data.reduce((acc, row) => acc + row.current, 0);

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
            {data.map((row, idx) => {
              const isValid = row.current !== 0;
              return (
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
                      onChange={(e) => handleChange(idx, e.target.value)}
                      variant="outlined"
                      size="small"
                      inputRef={(el) => {
                        if (el) {
                          el.dataset.valid = isValid.toString();
                          el.classList.add("table-input");
                        }
                      }}
                      sx={{
                        width: "4rem",
                        input: {
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "8px",
                          backgroundColor: "#fdfdfd",
                          border: `1px solid ${isValid ? "green" : "red"}`,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>{t("sum")}:</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{sum}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
