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
  Box, Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLanguage } from "../../context/LanguageContext.tsx";
import { useCurrentPeriod } from "../../context/CurrentPeriodContext.tsx";
import { ExpectedEndStocks } from "./productionPlanPage.tsx";

export type ProductionPlanData = {
  product: string;
  values: number[];
}[];

interface ProductionPlanTableProps {
  data: ProductionPlanData;
  onChange: (newData: ProductionPlanData) => void;
  expectedEndStocks: ExpectedEndStocks;  // ← newly added prop
}

export default function ProductionPlanTable({
                                              data,
                                              onChange,
                                              expectedEndStocks
                                            }: ProductionPlanTableProps) {
  const {t} = useLanguage();
  const {currentPeriod} = useCurrentPeriod();
  
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
    <div style={{marginTop: "3rem", padding: "1rem"}}>
      <Typography
        variant="h5"
        align="center"
        sx={{fontWeight: "bold", marginBottom: "1rem"}}
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
            <TableRow sx={{backgroundColor: "#f0f0f0"}}>
              <TableCell/>
              {Array.from({length: 4}, (_, i) => (
                <TableCell key={i} align="center" sx={{fontWeight: "bold"}}>
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
                sx={{"&:hover": {backgroundColor: "#f9f9f9"}}}
              >
                <TableCell component="th" scope="row">
                  {t(row.product)}
                </TableCell>
                {row.values.map((value, colIndex) => {
                  const isValid = value >= 0;
                  return (
                    <TableCell key={colIndex} padding="none">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          p: 1,
                          gap: 0.5,
                        }}
                      >
                        <TextField
                          type="number"
                          value={value}
                          onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            width: "5rem",
                            "& .MuiOutlinedInput-input": {
                              textAlign: "center",
                            },
                          }}
                          inputRef={(el) => {
                            if (el) {
                              el.dataset.valid = isValid.toString();
                              el.classList.add("table-input");
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            
            {/* 
              Optionally, show a "Sum" row for total production. 
              Keep if you prefer or remove it if not needed.
            */}
            {data.length > 0 && (
              <TableRow sx={{backgroundColor: "#f5f5f5"}}>
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
            
            {/* 
              5) Show the expectedEndStocks row (one row per product). 
              You can style or label it as you see fit.
            */}
            <TableRow>
              <TableCell>
                <strong>{t("production_plan_table_forecast")}</strong>
                <Tooltip title={t("production_plan_table_forecast_tooltip")} placement="top" arrow>
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 16,
                      verticalAlign: "middle",
                      color: "gray",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </TableCell>
              {expectedEndStocks.length > 0 &&
                expectedEndStocks[0].values.map((_, colIndex) => (
                  <TableCell key={colIndex} align="center">
                    {/* We'll display a dash if there's no data, but in theory
                        each product row has an entry. */}
                  </TableCell>
                ))}
            </TableRow>
            
            {/* 
              One approach: for each product, display its 4 endStock values
              in a separate row. 
            */}
            {expectedEndStocks.map((expected, idx) => (
              <TableRow key={idx} sx={{backgroundColor: "#fafafa"}}>
                <TableCell>{t(expected.product)}</TableCell>
                {expected.values.map((val, i) => (
                  <TableCell key={i} align="center">
                    {val}
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