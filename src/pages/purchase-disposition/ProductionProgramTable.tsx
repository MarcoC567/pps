import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

type ProductionData = {
    product: string;
    values: number[];
}[];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.grey[100],
}));

const StyledSumRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
}));

export default function ProductionProgramTable(props: { productionData: ProductionData }) {
    const productionData = props.productionData;

    const sumValues = productionData[0].values.map((_, i) =>
        productionData.reduce((sum, row) => sum + row.values[i], 0)
    );

    return (
        <div style={{ padding: "2rem" }}>
            <Typography
                variant="h5"
                align="center"
                sx={{ fontWeight: "bold", marginBottom: "1rem" }}
            >
                Produktionsprogramm
            </Typography>

            <TableContainer component={Paper} sx={{
                maxWidth: 1000,
                borderRadius: 3,
                boxShadow: 3, overflowX: 'auto'
            }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="production table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Periode</StyledTableCell>
                            <StyledTableCell align="center">n</StyledTableCell>
                            <StyledTableCell align="center">n+1</StyledTableCell>
                            <StyledTableCell align="center">n+2</StyledTableCell>
                            <StyledTableCell align="center">n+3</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productionData.map((row, index) => (
                            <TableRow key={index} hover>
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
                        <StyledSumRow>
                            <TableCell>
                                <strong>Summe</strong>
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