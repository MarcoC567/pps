import { Box, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material"
import { DispositionValues, productBOMs } from "./util/bom.ts";
import { PartId } from "./util/parts.type.ts";
import { flattenTree } from "./util/helpers.ts";

export const InhouseDisposition = ({ dpR, dpI }) => {
  const dpResult: Map<string, number> = dpR as Map<string, number>;
  const dpInput = dpI as Map<string, DispositionValues>;
  const flattenedBOMTree = flattenTree(productBOMs);
  
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
  //TODO: Translations
  
  return (
    <TableContainer
      sx={{
        maxWidth: '100%',
        minWidth: '80rem',
        overflowX: 'auto',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'darkgoldenrod',
              '& th': {
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.0625rem',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'darkgoldenrod',
              },
            }}
          >
            <TableCell>Part</TableCell>
            <TableCell align="right">Demand</TableCell>
            <TableCell align="right">Current Stock</TableCell>
            <TableCell align="right">Planned Safety Stock</TableCell>
            <TableCell align="right">Work in Progress</TableCell>
            <TableCell align="right">Waiting Queue</TableCell>
            <TableCell align="right">Production Order</TableCell>
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
            
            return (
              <TableRow
                key={part.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { backgroundColor: 'grey.100' },
                }}
              >
                <TableCell>
                  <Box pl={part.level * 2} fontWeight="medium">
                    {part.partId + (["E16", "E17", "E26"].includes(part.partId) ? "*" : "") }
                  </Box>
                </TableCell>
                <TableCell align="right">{fmt(demand)}</TableCell>
                <TableCell align="right">{fmt(currentStock)}</TableCell>
                <TableCell align="right">{fmt(plannedSafetyStock)}</TableCell>
                <TableCell align="right">{fmt(workInProgress)}</TableCell>
                <TableCell align="right">{fmt(waitingQueue)}</TableCell>
                <TableCell align="right">{fmt(productionOrder??0)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>*Shared parts</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>

  );
}