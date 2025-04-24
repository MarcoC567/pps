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
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Typography variant="h5" gutterBottom>
        Lagerbestand &amp; Warteschlange
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
                Artikel
                <Tooltip
                  title="Hier stehen die Bezeichnungen der jeweiligen Eigenerzeugnisse."
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Lagerbestand
                <Tooltip
                  title="Der aktuelle Lagerbestand der aus der XML Datei gelesen wurde"
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Gepl. Lagerbestand am Ende
                <Tooltip
                  title="Bitte trage hier den Lagerbestand ein den du gerne am Ende dieser Periode haben möchtest"
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Warteschlange
                <Tooltip
                  title="Hier siehst du die Menge der Materialien die aus der vorangegangenen Periode noch in der Warteschlange stehen und auf die Bearbeitung warten."
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
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Aufträge in Bearbeitung
                <Tooltip
                  title="Hier siehst du die Menge der Materialien die aus der vorangegangenen Periode noch in Bearbeitung sind."
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
                <TableCell>{row.product}</TableCell>
                {["stock", "endStock", "waitingList", "inProduction"].map(
                  (field) => {
                    const value =
                      row[field as keyof Omit<StockData, "product">];
                    const isEndStock = field === "endStock";
                    const borderColor = isEndStock
                      ? value === 0
                        ? "red"
                        : "green"
                      : "#ccc";

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
