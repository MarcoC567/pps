import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type ProductionData = {
    product: string;
    values: number[];
}[];


export default function ProductionProgramTable(props: { productionData: ProductionData }) {
    const productionData = props.productionData

    const sumValues = productionData[0].values.map((_, i) =>
        productionData.reduce((sum, row) => sum + row.values[i], 0)
    );

    return (
        <div style={{ padding: "2rem" }}>
            <Typography variant="h4" gutterBottom>
                Produktionsprogramm
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Periode</TableCell>
                            <TableCell align="center">n</TableCell>
                            <TableCell align="center">n+1</TableCell>
                            <TableCell align="center">n+2</TableCell>
                            <TableCell align="center">n+3</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productionData.map((row, index) => (
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