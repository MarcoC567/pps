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

type ForecastData = {
  product: string;
  values: number[];
}[];


export default function ForecastTable(props: { forecastData: ForecastData }) {
  const forecastData = props.forecastData;

  const sumValues = forecastData[0].values.map((_, i) =>
    forecastData.reduce((sum, row) => sum + row.values[i], 0)
  );

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Produktionsplan – Prognosen
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {Array.from({ length: 7 }, (_, i) => (
                <TableCell key={i} align="center">
                  Periode {i + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {forecastData.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.product}
                </TableCell>
                {row.values.map((value, i) => (
                  <TableCell key={i} align="center">
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Summe</strong>
              </TableCell>
              {sumValues.map((val, i) => (
                <TableCell key={i} align="center">
                  <strong>{val}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
