import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Paper } from '@mui/material';

export type StockData = {
  product: string;
  stock: number;
  endStock: number;
  waitingList: number;
  inProduction: number;
};

export default function StockAndQueueTable(props : { stockData : StockData[]}) {
  const stockData = props.stockData;

  return (
    <div style={{ marginTop: "3rem" }}>
      <Typography variant="h5" gutterBottom>
        Lagerbestand &amp; Warteschlange
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Zugehörigkeit</TableCell>
              <TableCell align="center">Lagerbestand</TableCell>
              <TableCell align="center">Gepl. Lagerbestand am Ende</TableCell>
              <TableCell align="center">Warteschlange</TableCell>
              <TableCell align="center">Aufträge in Bearbeitung</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.product}</TableCell>
                <TableCell align="center">{row.stock}</TableCell>
                <TableCell align="center">{row.endStock}</TableCell>
                <TableCell align="center">{row.waitingList}</TableCell>
                <TableCell align="center">{row.inProduction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
