import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useLanguage } from "../../context/LanguageContext";
import { ProductionPlanData } from "../production-plan/ProductionPlanTable";
import { useCurrentPeriod } from "../../context/CurrentPeriodContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[100],
}));

const StyledSumRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
}));

export default function ProductionProgramTable(props: {
  productionData: ProductionPlanData;
}) {
  const { currentPeriod } = useCurrentPeriod();
  const productionData = props.productionData;
  const { t } = useLanguage();

  const sumValues = productionData[0].values.map((_, i) =>
    productionData.reduce((sum, row) => sum + row.values[i], 0)
  );

  return (
    <div style={{ padding: "2rem" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("purchasePartsDisposition")}
      </Typography>
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        {t("Produktionsprogramm")}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 1400,
          width: "50%",
          borderRadius: 3,
          margin: "0 auto",
          boxShadow: 3,
          overflowX: "auto",
        }}
      >
        <Table
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="production table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>{t("period")}</StyledTableCell>
              <StyledTableCell align="center">
                {currentPeriod! + 1}
              </StyledTableCell>
              <StyledTableCell align="center">
                {currentPeriod! + 2}
              </StyledTableCell>
              <StyledTableCell align="center">
                {currentPeriod! + 3}
              </StyledTableCell>
              <StyledTableCell align="center">
                {currentPeriod! + 4}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productionData.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell component="th" scope="row">
                  {t(row.product)}
                </TableCell>
                {row.values.map((value, i) => (
                  <TableCell key={i} align="center">
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <StyledSumRow>
              <TableCell>
                <strong>{t("sum")}</strong>
              </TableCell>
              {sumValues.map((val, i) => (
                <TableCell key={i} align="center">
                  <strong>{val}</strong>
                </TableCell>
              ))}
            </StyledSumRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
