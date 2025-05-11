
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";
import { FutureStockEntry } from ".";


export default function FutureInwardStockTable(props: { futureInwardStockData: FutureStockEntry[] }) {
    const { t } = useLanguage()

    return (
        <div style={{ padding: "2rem" }}>
            <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: "bold", marginBottom: "1rem" }}
            >
                {t("futureInwardStockMovement")}
            </Typography>
                    <TableContainer component={Paper} sx={{ maxWidth: 1400, width: "60%", margin: "0 auto", borderRadius: 3, boxShadow: 3, overflow: "contain" }}>
                        <Table size="medium">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                                    <TableCell sx={{ fontWeight: "bold" }}>{t("article")} </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>{t("mode")} </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>{t("quantity")} </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>{t("orderPeriod")} </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>{t("inward_stock_movement")} </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.futureInwardStockData.map(
                                        (row, rowIndex) => {
                                            return (
                                                <TableRow key={rowIndex} hover sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                                    <TableCell align="center">{row.article}</TableCell>
                                                    <TableCell align="center">{t(row.mode)}</TableCell>
                                                    <TableCell align="center">{row.amount}</TableCell>
                                                    <TableCell align="center">{row.orderPeriod}</TableCell>
                                                    <TableCell align="center">{`${row.inwardStockMovement.period} - ${row.inwardStockMovement.day}`}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
        </div>
    )
}