// ProductionOrderListPage.tsx
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
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [splitAmount, setSplitAmount] = useState<{ [index: number]: number }>(
    {}
  );
  const [splitVisible, setSplitVisible] = useState<{
    [index: number]: boolean;
  }>({});

  // Hilfsfunktion, um in LS zu speichern
  const saveToLS = (list: ProductionOrder[]) => {
    const serialized: [string, number][] = list.map(({ product, quantity }) => [
      product,
      quantity,
    ]);
    localStorage.setItem("productionOrders", JSON.stringify(serialized));
  };

  useEffect(() => {
    // 1) Prüfe, ob schon productionOrders existieren
    const prodRaw = localStorage.getItem("productionOrders");
    if (prodRaw) {
      const parsedProd: [string, number][] = JSON.parse(prodRaw);
      const convertedProd: ProductionOrder[] = parsedProd.map(
        ([product, quantity]) => ({ product, quantity })
      );
      setOrders(convertedProd);
      return;
    }

    // 2) Sonst: aus inhouseDispositionResult laden, wenn vorhanden
    const stored = localStorage.getItem("inhouseDispositionResult");
    if (stored) {
      const parsedInit: [string, number][] = JSON.parse(stored);
      const convertedInit: ProductionOrder[] = parsedInit.map(
        ([product, quantity]) => ({ product, quantity })
      );
      setOrders(convertedInit);
      // direkt in LS speichern
      saveToLS(convertedInit);
      return;
    }

    // 3) Fallback: hartcodierte Default-Orders
    const fallback: ProductionOrder[] = [
      { product: "P1", quantity: 100 },
      { product: "P2", quantity: 80 },
      { product: "P3", quantity: 60 },
    ];
    setOrders(fallback);
    saveToLS(fallback);
  }, []);

  // Auch nach jeder Interaktion speichern
  const save = (list: ProductionOrder[]) => {
    setOrders(list);
    saveToLS(list);
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

  const handleNextClick = () => {
    // speichere nochmal den Stand ab
    save(orders);
    localStorage.setItem("visited_/production-order", "true");
    navigate("/capacity-plan");
  };

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
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
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

        <Divider sx={{ my: 3 }} />

        <button onClick={handleNextClick} className={`mt-4 mx-auto my-btn`}>
          {t("next")}
        </button>
      </Paper>
    </div>
  );
}
