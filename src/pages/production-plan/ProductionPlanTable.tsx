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
import { useCurrentPeriod } from "../../context/CurrentPeriodContext.tsx";

export type ProductionPlanData = {
  product: string;
  values: number[];
}[];

interface ProductionPlanTableProps {
  data: ProductionPlanData;
  onChange: (newData: ProductionPlanData) => void;
}

export default function ProductionPlanTable({
  data,
  onChange,
}: ProductionPlanTableProps) {
  const { t } = useLanguage();
  const { currentPeriod } = useCurrentPeriod();

  const handleChange = (
    rowIndex: number,
    colIndex: number,
    newValue: string
  ) => {
    const updated = data.map((row, ri) =>
      ri === rowIndex
        ? {
            ...row,
            values: row.values.map((v, ci) =>
              ci === colIndex ? Number(newValue) || 0 : v
            ),
          }
        : row
    );
    onChange(updated);
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
                  {t("period")} {currentPeriod! + i + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                hover
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell component="th" scope="row">
                  {t(row.product)}
                </TableCell>
                {row.values.map((value, colIndex) => {
                  const isValid = value >= 0;
                  return (
                    <TableCell key={colIndex} align="center">
                      <TextField
                        type="number"
                        value={value}
                        onChange={(e) =>
                          handleChange(rowIndex, colIndex, e.target.value)
                        }
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
                  );
                })}
              </TableRow>
            ))}
            {data.length > 0 && (
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>{t("sum")}</strong>
                </TableCell>
                {data[0].values.map((_, idx) => (
                  <TableCell key={idx} align="center">
                    <strong>
                      {data.reduce(
                        (sum, row) => sum + (row.values[idx] || 0),
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
