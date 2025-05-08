//TODO EVTL Drag and Drop
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";

type ProductionOrder = {
  product: string;
  quantity: number;
};

export default function ProductionOrderListPage() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [splitAmount, setSplitAmount] = useState<{ [index: number]: number }>(
    {}
  );
  const [splitVisible, setSplitVisible] = useState<{
    [index: number]: boolean;
  }>({});

  useEffect(() => {
    // 1) Prüfe zuerst auf productionOrders (aktuelle Änderungen)
    const prodRaw = localStorage.getItem("productionOrders");
    if (prodRaw) {
      const parsedProd: [string, number][] = JSON.parse(prodRaw);
      const convertedProd: ProductionOrder[] = parsedProd.map(
        ([product, quantity]) => ({ product, quantity })
      );
      setOrders(convertedProd);
      return;
    }

    // 2) Wenn productionOrders nicht existiert, lade initial aus inhouseDispositionResult
    const stored = localStorage.getItem("inhouseDispositionResult");
    if (stored) {
      const parsedInit: [string, number][] = JSON.parse(stored);
      const convertedInit: ProductionOrder[] = parsedInit.map(
        ([product, quantity]) => ({ product, quantity })
      );
      setOrders(convertedInit);
      return;
    }

    // 3) Fallback, falls beides nicht gesetzt ist
    setOrders([
      { product: "P1", quantity: 100 },
      { product: "P2", quantity: 80 },
      { product: "P3", quantity: 60 },
    ]);
  }, []);

  const save = (list: ProductionOrder[]) => {
    setOrders(list);
    const serialized = list.map(({ product, quantity }) => [product, quantity]);
    localStorage.setItem("productionOrders", JSON.stringify(serialized));
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const copy = [...orders];
    [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]];
    save(copy);
  };

  const moveDown = (i: number) => {
    if (i === orders.length - 1) return;
    const copy = [...orders];
    [copy[i + 1], copy[i]] = [copy[i], copy[i + 1]];
    save(copy);
  };

  const toggleSplit = (index: number) => {
    setSplitVisible((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const updateSplit = (index: number, value: string) => {
    setSplitAmount((prev) => ({ ...prev, [index]: Number(value) || 0 }));
  };

  const applySplit = (index: number) => {
    const amount = splitAmount[index];
    const item = orders[index];
    if (amount <= 0 || amount >= item.quantity) return;
    const newOrders = [
      ...orders.slice(0, index),
      { ...item, quantity: amount },
      { ...item, quantity: item.quantity - amount },
      ...orders.slice(index + 1),
    ];
    save(newOrders);
    setSplitVisible({});
    setSplitAmount({});
  };

  const navigate = useNavigate();
  const handleNextClick = () => {
    navigate("/capacity-plan");
  };

  const { t } = useLanguage();

  return (
    <div style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          width: "60vw",
          height: "80vh",
          backgroundColor: "#fafafa",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          {t("production-order")}
        </Typography>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {orders.map((entry, i) => (
            <Box
              key={i}
              sx={{
                width: "80%",
                p: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">
                  <strong>{entry.product}</strong> – {entry.quantity} Stück
                </Typography>
                <Box display="flex" gap={1}>
                  <Tooltip title={t("tooltip_arrow_up")} arrow>
                    <IconButton onClick={() => moveUp(i)}>
                      <ArrowUpwardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("tooltip_arrow_down")} arrow>
                    <IconButton onClick={() => moveDown(i)}>
                      <ArrowDownwardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("tooltip_splitting")} arrow>
                    <IconButton onClick={() => toggleSplit(i)}>
                      <CallSplitIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {splitVisible[i] && (
                <Box display="flex" gap={2} alignItems="center">
                  <TextField
                    label="Split-Menge"
                    type="number"
                    value={splitAmount[i] || ""}
                    onChange={(e) => updateSplit(i, e.target.value)}
                    size="small"
                    sx={{ width: "120px" }}
                    error={
                      (splitAmount[i] ?? 0) <= 0 ||
                      (splitAmount[i] ?? 0) >= entry.quantity
                    }
                    helperText={
                      (splitAmount[i] ?? 0) <= 0 ||
                      (splitAmount[i] ?? 0) >= entry.quantity
                        ? `Muss zwischen 1 und ${entry.quantity - 1} liegen`
                        : ""
                    }
                  />
                  <Button
                    variant="contained"
                    onClick={() => applySplit(i)}
                    disabled={
                      (splitAmount[i] ?? 0) <= 0 ||
                      (splitAmount[i] ?? 0) >= entry.quantity
                    }
                  >
                    Aufteilen
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {/* </Paper> */}

        <Divider sx={{ my: 3 }} />

        <button
          onClick={handleNextClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto "
        >
          {t("next")}
        </button>
      </Paper>
    </div>
  );
}
