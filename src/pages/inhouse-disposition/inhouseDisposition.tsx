import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { DispositionValues, productBOMs } from "./util/bom";
import { PartId } from "./util/parts.type";
import { flattenTree } from "./util/helpers";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

// 1) Props-Interface für die beiden Maps
export interface InhouseDispositionProps {
  dpR: Map<string, number>;
  dpI: Map<string, DispositionValues>;
}

// 2) Typ für die flattenTree-Elemente (PartId + Einrückungs-Level)
interface FlatPart {
  partId: PartId;
  level: number;
}

export const InhouseDisposition: React.FC<InhouseDispositionProps> = ({
  dpR,
  dpI,
}) => {
  // Maps sind jetzt korrekt typisiert
  const dpResult: Map<string, number> = dpR;
  const dpInput: Map<string, DispositionValues> = dpI;

  // flattenTree liefert ein Array von FlatPart
  const flattenedBOMTree: FlatPart[] = flattenTree(productBOMs);

  const { t } = useLanguage();
  const navigate = useNavigate();

  function getDispositionValues(partId: PartId): DispositionValues {
    return {
      demand: dpInput.get(partId)?.demand ?? 0,
      currentStock: dpInput.get(partId)?.currentStock ?? 0,
      plannedSafetyStock: dpInput.get(partId)?.plannedSafetyStock ?? 0,
      workInProgress: dpInput.get(partId)?.workInProgress ?? 0,
      waitingQueue: dpInput.get(partId)?.waitingQueue ?? 0,
      productionOrder: dpResult.get(partId) ?? 0,
    };
  }

  const fmt = (n: number) => Math.round(n).toLocaleString();

  const handleNextClick = () => {
    localStorage.setItem("visited_/inhouse-disposition", "true");
    navigate("/production-order");
  };

  return (
    <TableContainer
      sx={{
        maxWidth: "100%",
        minWidth: "80rem",
        overflowX: "auto",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow
            key="header"
            sx={{
              backgroundColor: "darkgoldenrod",
              "& th": {
                color: "white",
                fontWeight: "bold",
                fontSize: "1.0625rem",
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: "darkgoldenrod",
              },
            }}
          >
            <TableCell>{t("inhouse_disposition_parts")}</TableCell>
            <TableCell align="right">
              {t("inhouse_disposition_demand")}
            </TableCell>
            <TableCell align="right">
              {t("inhouse_disposition_current_stock")}
            </TableCell>
            <TableCell align="right">
              {t("inhouse_disposition_safety_stock")}
            </TableCell>
            <TableCell align="right">
              {t("inhouse_disposition_work_in_progress")}
            </TableCell>
            <TableCell align="right">
              {t("inhouse_disposition_waiting_queue")}
            </TableCell>
            <TableCell align="right">
              {t("inhouse_disposition_production_order")}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {flattenedBOMTree.map((part, index) => {
            // part: FlatPart, index: number
            const {
              demand,
              currentStock,
              workInProgress,
              waitingQueue,
              productionOrder,
              plannedSafetyStock,
            } = getDispositionValues(part.partId);
            const rowKey = `${part.partId}-${index}`;

            return (
              <TableRow
                key={rowKey}
                sx={{
                  backgroundColor: index % 2 === 0 ? "grey.50" : "white",
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "grey.100" },
                }}
              >
                <TableCell>
                  <Box pl={part.level * 2} fontWeight="medium">
                    {part.partId +
                      (["E16", "E17", "E26"].includes(part.partId) ? "*" : "")}
                  </Box>
                </TableCell>
                <TableCell align="right">{fmt(demand)}</TableCell>
                <TableCell align="right">{fmt(currentStock)}</TableCell>
                <TableCell align="right">{fmt(plannedSafetyStock)}</TableCell>
                <TableCell align="right">{fmt(workInProgress)}</TableCell>
                <TableCell align="right">{fmt(waitingQueue)}</TableCell>
                <TableCell align="right">{fmt(productionOrder ?? 0)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell>{t("inhouse_disposition_shared_parts")}</TableCell>
            <TableCell />
            <TableCell />
            <TableCell align="right">
              <button onClick={handleNextClick} className="mt-4 mx-auto my-btn">
                {t("next")}
              </button>
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
