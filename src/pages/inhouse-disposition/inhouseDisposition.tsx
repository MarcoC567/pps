import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow, Tooltip,
} from "@mui/material";
import { DispositionValues, productBOMs } from "./util/bom.ts";
import { PartId } from "./util/parts.type.ts";
import { flattenTree } from "./util/helpers.ts";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.tsx";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const InhouseDisposition = ({dpR, dpI}) => {
  const dpResult: Map<string, number> = dpR as Map<string, number>;
  const dpInput = dpI as Map<string, DispositionValues>;
  const flattenedBOMTree = flattenTree(productBOMs)
  mapFlattenedBOMTree(flattenedBOMTree);
  const {t} = useLanguage();
  
  function mapFlattenedBOMTree(fbt) {
    for (const part of fbt) {
      if (["E16", "E17", "E26"].includes(part.partId)) {
        part.partId = part.partId + "_" + mapParent(part.parent);
      }
    }
  }
  
  function mapParent(parent: string) {
    if (parent === "E51") return "P1";
    if (parent === "E56") return "P2";
    if (parent === "E31") return "P3";
    if (["P1", "P2", "P3"].includes(parent)) return parent;
  }
  
  function mapPartId(partId: string) {
    if (partId.startsWith("E16")) return "E16";
    if (partId.startsWith("E17")) return "E17";
    if (partId.startsWith("E26")) return "E26";
    return partId;
  }
  
  function getDispositionValues(partId: PartId): DispositionValues {
    const dpi = dpInput.get(partId);
    if (!dpi) return {
      demand: 0,
      currentStock: 0,
      plannedSafetyStock: 0,
      workInProgress: 0,
      waitingQueue: 0,
      productionOrder: 0
    };
    const dpv = {
      demand: dpi.demand,
      currentStock: dpi.currentStock,
      plannedSafetyStock: dpi.plannedSafetyStock,
      workInProgress: dpi.workInProgress,
      waitingQueue: dpi.waitingQueue,
      productionOrder: dpi.productionOrder,
    };
    return dpv;
  }
  
  const fmt = (n: number) => Math.round(n).toLocaleString();
  const navigate = useNavigate();
  const handleNextClick = () => {
    localStorage.setItem("visited_/inhouse-disposition", "true");
    navigate("/production-order");
  };
  
  return (
    <>
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
              <TableCell
                colSpan={8}
                sx={{
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  alignContent: "center",
                  textAlign: "center"
                }}
              >
                {t("inhouse_disposition_title")}
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {flattenedBOMTree.map((part, index) => {
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
                <React.Fragment key={rowKey+"_fragment"}>
                  {part.level === 0 && (
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
                      <TableCell align="right">{t("inhouse_disposition_demand")}</TableCell>
                      <TableCell align="right">
                        <Tooltip title={t("tooltip_carry_over")} placement="top" arrow>
                          <InfoOutlinedIcon
                            sx={{fontSize: 16, verticalAlign: "middle", color: "black", cursor: "pointer",}}/>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">{t("inhouse_disposition_safety_stock")}</TableCell>
                      <TableCell align="right">{t("inhouse_disposition_current_stock")}</TableCell>
                      <TableCell align="right">{t("inhouse_disposition_work_in_progress")}</TableCell>
                      <TableCell align="right">{t("inhouse_disposition_waiting_queue")}</TableCell>
                      <TableCell align="right">{t("inhouse_disposition_production_order")}</TableCell>
                    </TableRow>)}
                  <TableRow
                    key={rowKey}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "grey.50" : "white",
                      "&:last-child td, &:last-child th": {border: 0},
                      "&:hover": {backgroundColor: "grey.100"},
                    }}
                  >
                    <TableCell>
                      <Box pl={part.level * 2} fontWeight="medium">
                        {mapPartId(part.partId) +
                          (["E16", "E17", "E26"].includes(mapPartId(part.partId))
                            ? "*"
                            : "")}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{fmt(demand)}</TableCell>
                    <TableCell align="right">{(dpInput.get(part.parent)?.waitingQueue) || ""}</TableCell>
                    <TableCell
                      align="right">{fmt((plannedSafetyStock))}</TableCell>
                    <TableCell align="right">{fmt((currentStock))}</TableCell>
                    <TableCell align="right">{fmt((workInProgress))}</TableCell>
                    <TableCell align="right">{fmt((waitingQueue))}</TableCell>
                    <TableCell align="right">
                      {fmt(dpResult.get(part.partId) || 0)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>{t("inhouse_disposition_shared_parts")}</TableCell>
              <TableCell/>
              <TableCell/>
              <TableCell align="right">
                <button
                  onClick={handleNextClick}
                  className={`mt-4 mx-auto my-btn`}
                >
                  {t("next")}
                </button>
              </TableCell>
              <TableCell/>
              <TableCell/>
              <TableCell/>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};
