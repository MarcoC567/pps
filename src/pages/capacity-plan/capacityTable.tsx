/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  TableContainer,
  Tooltip,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext.tsx";
import mockData from "./mockData.json";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type WorkstationData = {
  setup_time: number | number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type Workstations = {
  [workstationName: string]: WorkstationData;
};

type ProductionEntry = [string, number];

export default function CapacityTable() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const productionRaw = localStorage.getItem("productionOrders");
  const productionList: ProductionEntry[] = productionRaw
    ? JSON.parse(productionRaw)
    : [];

  const productionMap = new Map<string, number>();
  const entryCountMap = new Map<string, number>();
  productionList.forEach(([product, quantity]) => {
    productionMap.set(product, (productionMap.get(product) || 0) + quantity);
    entryCountMap.set(product, (entryCountMap.get(product) || 0) + 1);
  });

  const [workstations, setWorkstations] = useState<Workstations>({});
  const [shiftData, setShiftData] = useState<
    Record<string, { shifts: number; overtime: number }>
  >({});
  const [setupTimeNewPerWS, setSetupTimeNewPerWS] = useState<
    Record<string, number>
  >({});
  const [prevSetupTime, setPrevSetupTime] = useState<Record<string, number>>({});
  const isSetupTimeNewInitialized = useRef(false); // Track setupTimeNewPerWS initialization
  const isPrevSetupTimeInitialized = useRef(false); // Track prevSetupTime initialization

  const raw = localStorage.getItem("importData");
  const importData = raw
    ? (JSON.parse(raw) as {
        results: {
          waitinglistworkstations: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            workplace: { id: string; timeneed: string; waitinglist?: any }[];
          };
        };
      })
    : null;

  useEffect(() => {
    if (mockData) {
      setWorkstations(mockData as Workstations);
    }
  }, []);

  const calculateShifts = (minutes: number) => {
    if (minutes <= 3600) return 1;
    if (minutes <= 6000) return 2;
    return 3;
  };

  const calculateOvertime = (totalMinutes: number, shifts: number) => {
    return Math.min(1200, Math.max(0, totalMinutes - 2400 * shifts));
  };

  const handleNextClick = () => {
    const list = workstationKeys.map((wsKey) => {
      const newCap = calculatedCapacities[wsKey] || 0;
      const newSetup = setupTimeNewPerWS[wsKey] || 0;
      const oldCap = prevPeriodCapacity[wsKey] || 0;
      const oldSetup = prevSetupTime[wsKey] || 0;
      const total = newCap + newSetup + oldCap + oldSetup;
      const shifts = shiftData[wsKey]?.shifts ?? calculateShifts(total);
      const rawOvertime =
        shiftData[wsKey]?.overtime ?? calculateOvertime(total, shifts);
      const overtime = Math.round(rawOvertime / 5);
      return {
        station: wsKey.replace("workstation", ""),
        shift: shifts,
        overtime: overtime,
      };
    });

    localStorage.setItem("workingtimelist", JSON.stringify(list));
    localStorage.setItem("visited_/capacity-plan", "true");
    navigate("/purchase-disposition");
  };

  const handleShiftChange = (
    ws: string,
    key: "shifts" | "overtime" | "overtimetag",
    value: string,
    totalMinutes: number
  ) => {
    let numValue = Math.max(0, Number(value) || 0);
    if (key === "shifts") numValue = Math.min(numValue, 3);
    if (key === "overtime") numValue = Math.min(numValue, 1200);
    if (key === "overtimetag") {
      numValue = Math.min(numValue, 240) * 5;
      key = "overtime"
    }

    setShiftData((prev) => {
      const updated = key === "shifts" ? {
        ...prev,
        [ws]: {
          ...prev[ws],
          ["shifts"]: numValue,
          ["overtime"]: calculateOvertime(totalMinutes, numValue)
        },
      } : {
        ...prev,
        [ws]: {
          ...prev[ws],
          [key]: numValue,
        },
      };

      const list = workstationKeys.map((wsKey) => {
        const entry = updated[wsKey] || {
          shifts: calculateShifts(0),
          overtime: 0,
        };
        return {
          station: wsKey.replace("workstation", ""),
          shift: entry.shifts,
          overtime: entry.overtime,
        };
      });

      localStorage.setItem("workingtimelist", JSON.stringify(list));
      return updated;
    });
  };

  const allParts = Array.from(productionMap.keys()).sort((a, b) => {
    const aIsE = a.startsWith("E");
    const bIsE = b.startsWith("E");
    const aNum = parseInt(a.substring(1));
    const bNum = parseInt(b.substring(1));
    if (aIsE && !bIsE) return -1;
    if (!aIsE && bIsE) return 1;
    return aNum - bNum;
  });

  const workstationKeys = Object.keys(workstations).filter(
    (ws) => ws !== "workstation5"
  );

  // Initialize setupTimeNewPerWS only once when dependencies are ready
  useEffect(() => {
    if (
      isSetupTimeNewInitialized.current ||
      workstationKeys.length === 0 ||
      allParts.length === 0
    ) {
      return;
    }

    const saved = localStorage.getItem("setupTimeNewPerWS");
    if (saved) {
      setSetupTimeNewPerWS(JSON.parse(saved));
    } else {
      const initial: Record<string, number> = {};
      workstationKeys.forEach((ws) => {
        const station = workstations[ws];
        let setupSum = 0;
        allParts.forEach((part) => {
          const entry = station?.[part];
          if (!entry) return;
          const productionQty = productionMap.get(part) || 0;
          const occurrences = productionQty > 0 ? entryCountMap.get(part) || 0 : 0;
          const setupPerPart = Array.isArray(station.setup_time)
            ? station.setup_time[0]
            : station.setup_time;
          setupSum += setupPerPart * occurrences;
        });
        initial[ws] = setupSum;
      });
      setSetupTimeNewPerWS(initial);
    }
    isSetupTimeNewInitialized.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workstations, productionMap, workstationKeys, allParts]);

  // Save setupTimeNewPerWS to localStorage only when it changes
  useEffect(() => {
    if (Object.keys(setupTimeNewPerWS).length > 0) {
      localStorage.setItem("setupTimeNewPerWS", JSON.stringify(setupTimeNewPerWS));
    }
  }, [setupTimeNewPerWS]);

  // Initialize prevSetupTime only once when dependencies are ready
  useEffect(() => {
    if (
      isPrevSetupTimeInitialized.current ||
      workstationKeys.length === 0 ||
      !importData?.results?.waitinglistworkstations?.workplace
    ) {
      return;
    }

    const saved = localStorage.getItem("prevSetupTime");
    if (saved) {
      setPrevSetupTime(JSON.parse(saved));
    } else {
      const initial: Record<string, number> = {};
      importData.results.waitinglistworkstations.workplace.forEach(
        (w: { id: string; timeneed: string; waitinglist?: any }) => {
          const wsKey = `workstation${w.id}`;
          const station = workstations[wsKey];
          if (!station) {
            initial[wsKey] = 0;
            return;
          }
          const setupPerPart = Array.isArray(station.setup_time)
            ? station.setup_time[0]
            : station.setup_time;
          const wl = w.waitinglist;
          if (Array.isArray(wl)) {
            initial[wsKey] = setupPerPart * wl.length;
          } else if (wl && typeof wl === "object") {
            initial[wsKey] = setupPerPart;
          } else {
            initial[wsKey] = 0;
          }
        }
      );
      setPrevSetupTime(initial);
    }
    isPrevSetupTimeInitialized.current = true;
  }, [workstations, importData, workstationKeys]);

  // Save prevSetupTime to localStorage only when it changes
  useEffect(() => {
    if (Object.keys(prevSetupTime).length > 0) {
      localStorage.setItem("prevSetupTime", JSON.stringify(prevSetupTime));
    }
  }, [prevSetupTime]);

  // Handler for setup time changes (new)
  const handleSetupTimeChange = (ws: string, value: string) => {
    const numValue = Math.max(0, Number(value) || 0);
    setSetupTimeNewPerWS((prev) => ({
      ...prev,
      [ws]: numValue,
    }));
  };

  // Handler for previous setup time changes
  const handlePrevSetupTimeChange = (ws: string, value: string) => {
    const numValue = Math.max(0, Number(value) || 0);
    setPrevSetupTime((prev) => ({
      ...prev,
      [ws]: numValue,
    }));
  };

  const calculatedCapacities: Record<string, number> = {};
  workstationKeys.forEach((ws) => {
    const station = workstations[ws];
    let capacitySum = 0;
    allParts.forEach((part) => {
      const entry = station?.[part];
      if (!entry) return;
      const productionQty = productionMap.get(part) || 0;
      capacitySum += productionQty * entry.multiplicator;
    });
    calculatedCapacities[ws] = capacitySum;
  });

  const prevPeriodCapacity: Record<string, number> = {};
  if (importData?.results?.waitinglistworkstations?.workplace) {
    importData.results.waitinglistworkstations.workplace.forEach(
      (w: { id: string; timeneed: string; waitinglist?: any }) => {
        const wsKey = `workstation${w.id}`;
        prevPeriodCapacity[wsKey] = Number(w.timeneed);
      }
    );
  }

  return (
    <div style={{ marginTop: "3rem", padding: "1rem" }}>
      <Paper
        elevation={4}
        sx={{
          padding: "2rem",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "95vw",
          backgroundColor: "#fafafa",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", marginBottom: "1rem" }}
        >
          {t("capacityPlan")}
        </Typography>

        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell sx={{ fontWeight: "bold" }}>{t("")}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("article")}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("orderAmount")}
                </TableCell>
                {workstationKeys.map((ws) => (
                  <TableCell
                    key={ws}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    {ws.replace("workstation", "WS ")}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {allParts.map((part, idx) => (
                <TableRow key={idx} hover>
                  <TableCell></TableCell>
                  <TableCell>{part}</TableCell>
                  <TableCell>{productionMap.get(part) ?? "-"}</TableCell>
                  {workstationKeys.map((ws) => {
                    const entry = workstations[ws]?.[part];
                    if (!entry) {
                      return (
                        <TableCell key={ws} align="center">
                          -
                        </TableCell>
                      );
                    }
                    const productionQty = productionMap.get(part) || 0;
                    const multiplicator = entry.multiplicator;
                    const cellValue = productionQty * multiplicator;
                    return (
                      <TableCell key={ws} align="center">
                        {cellValue > 0 ? cellValue : "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              {/* Zwischenlinie */}
              <TableRow>
                <TableCell colSpan={workstationKeys.length + 4}>
                  <div
                    style={{
                      height: "3px",
                      backgroundColor: "#333",
                      margin: "1rem 0",
                    }}
                  />
                </TableCell>
              </TableRow>

              {/* Kapazität neu */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_new")}</strong>
                  <Tooltip
                    title={t("tooltip_capacity_new")}
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
                {workstationKeys.map((ws) => (
                  <TableCell key={ws} align="center">
                    {calculatedCapacities[ws]}
                  </TableCell>
                ))}
              </TableRow>

              {/* Rüstzeit neu */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_setup_time_new")}</strong>
                  <Tooltip
                    title={t("tooltip_capacity_setup_time_new")}
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
                {workstationKeys.map((ws) => (
                  <TableCell key={ws} align="center">
                    <TextField
                      type="number"
                      value={setupTimeNewPerWS[ws] ?? 0}
                      onChange={(e) => handleSetupTimeChange(ws, e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0 }}
                      sx={{
                        widthremotework: "4rem",
                        input: {
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "8px",
                          backgroundColor: "#fdfdfd",
                          border: "1px solid #ccc",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>

              {/* Kapazität vorherige Periode */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_last_period")}</strong>
                  <Tooltip
                    title={t("tooltip_capacity_last_period")}
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
                {workstationKeys.map((ws) => (
                  <TableCell key={ws} align="center">
                    {prevPeriodCapacity[ws] ?? 0}
                  </TableCell>
                ))}
              </TableRow>

              {/* Rüstzeit vorherige Periode */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_setup_time_old_period")}</strong>
                  <Tooltip
                    title={t("tooltip_capacity_setup_time_last_period")}
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
                {workstationKeys.map((ws) => (
                  <TableCell key={ws} align="center">
                    <TextField
                      type="number"
                      value={prevSetupTime[ws] ?? 0}
                      onChange={(e) => handlePrevSetupTimeChange(ws, e.target.value)}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0 }}
                      sx={{
                        width: "4rem",
                        input: {
                          textAlign: "center",
                          padding: "6px",
                          borderRadius: "8px",
                          backgroundColor: "#fdfdfd",
                          border: "1px solid #ccc",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>

              {/* Gesamtkapazität */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("total_capacity")}</strong>
                  <Tooltip
                    title={t("tooltip_total_Capacity")}
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
                {workstationKeys.map((ws) => {
                  const newCap = calculatedCapacities[ws] || 0;
                  const newSetupVal = setupTimeNewPerWS[ws] || 0;
                  const oldCapVal = prevPeriodCapacity[ws] || 0;
                  const oldSetupVal = prevSetupTime[ws] || 0;
                  const totalVal =
                    newCap + newSetupVal + oldCapVal + oldSetupVal;
                  return (
                    <TableCell key={ws} align="center">
                      {totalVal}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Schichten */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("shifts")}</strong>
                  <Tooltip title={t("tooltip_Shifts")} placement="top" arrow>
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
                {workstationKeys.map((ws) => {
                  const newCap = calculatedCapacities[ws] || 0;
                  const newSetupVal = setupTimeNewPerWS[ws] || 0;
                  const oldCapVal = prevPeriodCapacity[ws] || 0;
                  const oldSetupVal = prevSetupTime[ws] || 0;
                  const totalVal =
                    newCap + newSetupVal + oldCapVal + oldSetupVal;
                  const shiftsVal =
                    shiftData[ws]?.shifts ?? calculateShifts(totalVal);
                  return (
                    <TableCell key={ws} align="center">
                      <TextField
                        type="number"
                        value={shiftsVal}
                        onChange={(e) =>
                          handleShiftChange(ws, "shifts", e.target.value, totalVal)
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
                            border: "1px solid #ccc",
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

              {/* Überstunden */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("overtime_in_total")}</strong>
                  <Tooltip
                    title={t("tooltip_overtime_in_total")}
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
                {workstationKeys.map((ws) => {
                  const newCap = calculatedCapacities[ws] || 0;
                  const newSetupVal = setupTimeNewPerWS[ws] || 0;
                  const oldCapVal = prevPeriodCapacity[ws] || 0;
                  const oldSetupVal = prevSetupTime[ws] || 0;
                  const totalVal =
                    newCap + newSetupVal + oldCapVal + oldSetupVal;
                  const shiftsVal =
                    shiftData[ws]?.shifts ?? calculateShifts(totalVal);
                  const overtimeVal =
                    shiftData[ws]?.overtime ?? calculateOvertime(totalVal, shiftsVal);
                  return (
                    <TableCell key={ws} align="center">
                      <TextField
                        type="number"
                        value={Math.round(overtimeVal)}
                        onChange={(e) =>
                          handleShiftChange(ws, "overtime", e.target.value, totalVal)
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
                            border: "1px solid #ccc",
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

              {/* Überstunden pro Tag */}
              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("overtime_per_day")}</strong>
                  <Tooltip
                    title={t("tooltip_overtime_per_day")}
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
                {workstationKeys.map((ws) => {
                  const newCap = calculatedCapacities[ws] || 0;
                  const newSetupVal = setupTimeNewPerWS[ws] || 0;
                  const oldCapVal = prevPeriodCapacity[ws] || 0;
                  const oldSetupVal = prevSetupTime[ws] || 0;
                  const totalVal =
                    newCap + newSetupVal + oldCapVal + oldSetupVal;
                  const shiftsVal =
                    shiftData[ws]?.shifts ?? calculateShifts(totalVal);
                  const overtimeVal =
                    shiftData[ws]?.overtime ?? calculateOvertime(totalVal, shiftsVal);
                  return (
                    <TableCell key={ws} align="center">
                      <TextField
                        type="number"
                        value={Math.round(overtimeVal / 5)}
                        onChange={(e) =>
                          handleShiftChange(ws, "overtimetag", e.target.value, totalVal)
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
                            border: "1px solid #ccc",
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
            </TableBody>
          </Table>
          <button onClick={handleNextClick} className={`mt-4 mx-auto my-btn`}>
            {t("next")}
          </button>
        </TableContainer>
      </Paper>
    </div>
  );
}