//TODO Validation check
//TODO Anpassung an echte daten wenn Dennis soweit ist
//TODO Modell zuweisung (P1,2,3)
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
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext.tsx";
import mockData from "./mockData.json";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type WorkstationData = {
  setup_time: number | number[];
  total_capacity_need_last_period: number;
  total_setup_time_last_period: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type Workstations = {
  [workstationName: string]: WorkstationData;
};

export default function CapacityTable() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [workstations, setWorkstations] = useState<Workstations>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shiftData, setShiftData] = useState<
    Record<string, { shifts: number; overtime: number }>
  >({});

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

  const calculateOvertime = (totalMinutes: number) => {
    const shiftMinutes = 2400 * calculateShifts(totalMinutes);
    const overtime = totalMinutes - shiftMinutes;
    return Math.max(0, overtime);
  };

  const getShiftData = (ws: string, totalMinutes: number) => {
    const calculatedShifts = calculateShifts(totalMinutes);
    const calculatedOvertime = calculateOvertime(totalMinutes);
    return { shifts: calculatedShifts, overtime: calculatedOvertime };
  };

  const handleNextClick = () => {
    const list = workstationKeys.map((wsKey) => {
      const entry = shiftData[wsKey] || getShiftData(wsKey, 0);
      const stationNumber = wsKey.replace("workstation", "");
      return {
        station: stationNumber,
        shift: entry.shifts,
        overtime: entry.overtime,
      };
    });

    localStorage.setItem("workingtimelist", JSON.stringify(list));
    navigate("/purchase-disposition");
  };

  const handleShiftChange = (
    ws: string,
    key: "shifts" | "overtime",
    value: string
  ) => {
    const numValue = Math.max(0, Number(value) || 0);

    setShiftData((prev) => {
      const updated = {
        ...prev,
        [ws]: {
          ...prev[ws],
          [key]: numValue,
        },
      };

      // XML-kompatibles Format erzeugen
      const list = workstationKeys.map((wsKey) => {
        const entry = updated[wsKey] || getShiftData(wsKey, 0);
        const stationNumber = wsKey.replace("workstation", "");
        return {
          station: stationNumber,
          shift: entry.shifts,
          overtime: entry.overtime,
        };
      });

      // Speichern im localStorage
      localStorage.setItem("workingtimelist", JSON.stringify(list));

      return updated;
    });
  };

  const allParts = Array.from(
    new Set(
      Object.values(workstations).flatMap((ws) =>
        Object.keys(ws).filter(
          (key) => key.startsWith("E") || key.startsWith("P")
        )
      )
    )
  ).sort((a, b) => {
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

  const calculatedCapacities: Record<string, number> = {};

  workstationKeys.forEach((ws) => {
    const sum = allParts.reduce((acc, part) => {
      const amount = workstations[ws]?.[part]?.amount || 0;
      const multiplicator = workstations[ws]?.[part]?.multiplicator || 1;
      return acc + amount * multiplicator;
    }, 0);
    calculatedCapacities[ws] = sum;
  });

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
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("bikeModel")}
                </TableCell>
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
                  <TableCell>Modell X</TableCell>
                  <TableCell>{part}</TableCell>
                  <TableCell>
                    {(() => {
                      const entry = Object.values(workstations).find(
                        (ws) => part in ws
                      )?.[part];
                      if (!entry) return "-";
                      const amount = entry.amount || 0;
                      return amount;
                    })()}
                  </TableCell>
                  {workstationKeys.map((ws) => {
                    const entry = workstations[ws]?.[part];
                    const amount = entry?.amount || 0;
                    const multiplicator = entry?.multiplicator || 1;
                    return (
                      <TableCell key={ws} align="center">
                        {amount * multiplicator || "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={workstationKeys.length + 4}>
                  <div
                    style={{
                      height: "3px",
                      backgroundColor: "#333",
                      marginTop: "1rem",
                      marginBottom: "1rem",
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_new")} </strong>
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

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_setup_time_new")} </strong>
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

                {workstationKeys.map((ws) => {
                  const setupTime = Array.isArray(workstations[ws]?.setup_time)
                    ? workstations[ws]?.setup_time[0] || 0
                    : workstations[ws]?.setup_time || 0;

                  const numParts = allParts.filter(
                    (part) => workstations[ws]?.[part]?.amount > 0
                  ).length;

                  const totalSetup = setupTime * numParts;

                  return (
                    <TableCell key={ws} align="center">
                      {totalSetup}
                    </TableCell>
                  );
                })}
              </TableRow>

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_last_period")} </strong>
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
                    {workstations[ws]?.total_capacity_need_last_period ?? "-"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("capacity_setup_time_old_period")} </strong>
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
                    {workstations[ws]?.total_setup_time_last_period ?? "-"}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("total_capacity")} </strong>
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
                  const kapazitätNeu = allParts.reduce((acc, part) => {
                    const amount = workstations[ws]?.[part]?.amount || 0;
                    const multiplicator =
                      workstations[ws]?.[part]?.multiplicator || 1;
                    return acc + amount * multiplicator;
                  }, 0);

                  const setupPerPart = Array.isArray(
                    workstations[ws]?.setup_time
                  )
                    ? workstations[ws]?.setup_time[0] || 0
                    : workstations[ws]?.setup_time || 0;

                  const numParts = allParts.filter(
                    (part) => workstations[ws]?.[part]
                  ).length;

                  const umrüstzeitNeu = setupPerPart * numParts;
                  const kapazitätAlt =
                    workstations[ws]?.total_capacity_need_last_period || 0;
                  const umrüstzeitAlt =
                    workstations[ws]?.total_setup_time_last_period || 0;

                  const total =
                    kapazitätNeu + umrüstzeitNeu + kapazitätAlt + umrüstzeitAlt;

                  return (
                    <TableCell key={ws} align="center">
                      {total}
                    </TableCell>
                  );
                })}
              </TableRow>

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("shifts")} </strong>
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
                  const totalMinutes =
                    calculatedCapacities[ws] +
                    (Array.isArray(workstations[ws]?.setup_time)
                      ? workstations[ws]?.setup_time[0]
                      : workstations[ws]?.setup_time || 0);
                  return (
                    <TableCell key={ws} align="center">
                      <TextField
                        type="number"
                        value={getShiftData(ws, totalMinutes).shifts}
                        onChange={(e) =>
                          handleShiftChange(ws, "shifts", e.target.value)
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

              <TableRow hover>
                <TableCell colSpan={3}>
                  <strong>{t("overtime")} </strong>
                  <Tooltip title={t("tooltip_overtime")} placement="top" arrow>
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
                  const totalMinutes =
                    calculatedCapacities[ws] +
                    (Array.isArray(workstations[ws]?.setup_time)
                      ? workstations[ws]?.setup_time[0]
                      : workstations[ws]?.setup_time || 0);
                  const overtime = calculateOvertime(totalMinutes);
                  return (
                    <TableCell key={ws} align="center">
                      {overtime}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
          <button
            onClick={handleNextClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto "
          >
            {t("next")}
          </button>
        </TableContainer>
      </Paper>
    </div>
  );
}
