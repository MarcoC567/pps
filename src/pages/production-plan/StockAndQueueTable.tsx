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
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLanguage } from "../../context/LanguageContext.tsx";

export type StockData = {
  product: string;
  stock: number;
  endStock: number;
  waitingList: number;
  inProduction: number;
};

export default function StockAndQueueTable(props: { stockData: StockData[] }) {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const { t } = useLanguage();

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
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("stockAndQueue")}
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
              <TableCell sx={{ fontWeight: "bold" }}>
                {t("article")}
                <Tooltip title={t("tooltip_article")} placement="top" arrow>
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("stock")}
                <Tooltip title={t("tooltip_stock")} placement="top" arrow>
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("plannedStockAtTheEndOfThePeriod")}
                <Tooltip title={t("tooltip_planneStock")} placement="top" arrow>
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("queue")}
                <Tooltip title={t("tooltip_queue")} placement="top" arrow>
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {t("contractInWork")}
                <Tooltip
                  title={t("tooltip_contractInWork")}
                  placement="top"
                  arrow
                >
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
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row, i) => (
              <TableRow
                key={i}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                }}
              >
                <TableCell>
                  {t(`article_${row.product.split(" ")[0]}`)}
                </TableCell>
                {["stock", "endStock", "waitingList", "inProduction"].map(
                  (field) => {
                    const value =
                      row[field as keyof Omit<StockData, "product">];
                    const isEndStock = field === "endStock";

                    return (
                      <TableCell key={field} align="center">
                        <TextField
                          type="number"
                          value={value}
                          onChange={(e) => {
                            if (isEndStock) {
                              handleChange(
                                i,
                                field as keyof Omit<StockData, "product">,
                                e.target.value
                              );
                            }
                          }}
                          disabled={!isEndStock}
                          variant="outlined"
                          size="small"
                          sx={{
                            width: "4rem",
                            input: {
                              textAlign: "center",
                              padding: "6px",
                              borderRadius: "8px",
                              backgroundColor: isEndStock
                                ? "#fdfdfd"
                                : "#f0f0f0",
                              border: isEndStock
                                ? `1px solid ${value === 0 ? "red" : "green"}`
                                : "1px solid #ccc",
                              transition: "border 0.2s",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          }}
                        />
                      </TableCell>
                    );
                  }
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
