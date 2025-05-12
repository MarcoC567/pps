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
  Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLanguage } from "../../context/LanguageContext.tsx";
import parts from "../../data/base-data/parts.json";

export type StockData = {
  product: string;
  stock: number;
  endStock: number;
  waitingList: number;
  inProduction: number;
}[];

interface StockAndQueueTableProps {
  data: StockData;
  onChange: (newData: StockData) => void;
}

export default function StockAndQueueTable({
  data,
  onChange,
}: StockAndQueueTableProps) {
  const { t } = useLanguage();

  const handleChange = (index: number, newValue: string) => {
    const updated = data.map((row, i) =>
      i === index ? { ...row, endStock: Number(newValue) || 0 } : row
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
              {["stock", "endStock", "waitingList", "inProduction"].map(
                (field) => (
                  <TableCell
                    key={field}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    {t(field)}
                    <Tooltip
                      title={t(`tooltip_${field}`)}
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
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, i) => {
              const isValid = row.endStock !== 0;
              // Artikelnummer aus String extrahieren
              const artNum = Number(row.product.split(" ")[0]);
              const part = parts.artikel.find(
                (p) => Number(p.artikelnummer) === artNum
              );
              const displayName = part ? part.bezeichnung : row.product;

              return (
                <TableRow
                  key={i}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell>{displayName}</TableCell>
                  <TableCell align="center">{row.stock}</TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={row.endStock}
                      onChange={(e) => handleChange(i, e.target.value)}
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
                  <TableCell align="center">{row.waitingList}</TableCell>
                  <TableCell align="center">{row.inProduction}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
