import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

type SalesForecastData = {
  product: string;
  current: number;
  next: number;
}[];

export default function SalesForecastTable(props: { salesForecastData: SalesForecastData }) {
  const salesForecastData = props.salesForecastData;

  const salesSum = salesForecastData.reduce(
    (acc, row) => ({
      current: acc.current + row.current,
      next: acc.next + row.next,
    }),
    { current: 0, next: 0 }
  );

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        Verkaufswunsch
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Periode (Aktuell)</TableCell>
              <TableCell>Periode (n+1)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesForecastData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{`${row.product}: ${row.current}`}</TableCell>
                <TableCell>{`${row.product}: ${row.next}`}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Summe: {salesSum.current}</strong>
              </TableCell>
              <TableCell>
                <strong>Summe: {salesSum.next}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
