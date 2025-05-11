import { useEffect, useState } from "react";
import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useLanguage } from "../../context/LanguageContext";
import { basicData, modusOptions } from "./const";
import { useCurrentPeriod } from "../../context/CurrentPeriodContext";

type FutureStockEntry = {
    orderPeriod: number,
    mode: string,
    article: number,
    amount: number
}

export default function FutureInwardStockTable() {
    const { t } = useLanguage()
    const { currentPeriod } = useCurrentPeriod();
    const [futureInwardStockData, setFutureInwardStockData] = useState<FutureStockEntry[] | undefined>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const importData = JSON.parse(localStorage.getItem('importData') || '{}') as {
            results?: {
                period: string
                futureinwardstockmovement?: {
                    order?: Array<{ orderperiod: string, article: string, mode: string, amount: string }>;
                };
            };
        };

        console.log(importData.results?.futureinwardstockmovement?.order);

        setFutureInwardStockData(
            importData.results?.futureinwardstockmovement?.order?.map(
                (order) => {
                    const newFutureStockEntry: FutureStockEntry = {
                        orderPeriod: Number(order.orderperiod),
                        amount: Number(order.amount),
                        mode: modusOptions.find((option) => option.modus == Number(order.mode))!.key,
                        article: Number(order.article)
                    }
                    return newFutureStockEntry
                }
            )
        )

        setTimeout(() => setLoading(false), 100);
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: "bold", marginBottom: "1rem" }}
            >
                {t("futureInwardStockMovement")}
            </Typography>

            {loading ? (
                <div>
                    <Box sx={{ display: 'flex', marginLeft: 40 }}>
                        <CircularProgress />
                    </Box>
                </div>
            ) : (
                futureInwardStockData && (

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
                                    futureInwardStockData.map(
                                        (row, rowIndex) => {
                                            const factors = modusOptions.find(option => option.key == row.mode);
                                            const articleBasicData = basicData.find(item => item.itemNr == row.article)
                                            const eta = factors && articleBasicData && currentPeriod ? (articleBasicData.deliveryTime! * factors.deliveryDeadlineFactor + articleBasicData.deliveryTimeDeviation! * factors.deliveryDeviationExtra) * 5 - (currentPeriod - row.orderPeriod) * 5 + 1 : 0;
                                            const period = currentPeriod! + Math.floor(eta / 5);
                                            const day = Math.ceil(eta % 5);  
                                            return (
                                                <TableRow key={rowIndex} hover sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                                    <TableCell>{row.article}</TableCell>
                                                    <TableCell>{t(row.mode)}</TableCell>
                                                    <TableCell>{row.amount}</TableCell>
                                                    <TableCell>{row.orderPeriod}</TableCell>
                                                    <TableCell>{`${period} - ${day}`}</TableCell>
                                                </TableRow>
                                            )
                                        }
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}
        </div>
    )
}