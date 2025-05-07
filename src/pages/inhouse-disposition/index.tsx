import { useEffect, useState } from "react";
import { dispositionService} from "./services";
import { DispositionInput, DispositionValues, productBOMs } from "./util/bom.ts";
import { Display } from "./display.tsx";
import { Paper } from "@mui/material";
import { PartId } from "./util/parts.type.ts";
import { INHOUSE_DISPOSITION_INPUT, INHOUSE_DISPOSITION_RESULT } from "./services/inhouseDisposition.service.ts";

export default function InhouseDispositionPage() {
  const [dispositionOutput, setDispositionOutput] = useState<Map<string, number> | null>(null);
  const [dispositionInput, setDispositionInput] = useState<DispositionInput | null>(null);
  useEffect(() => {
    // your side effect code here
    const dispositionInput: DispositionInput = new Map<PartId, DispositionValues>([
      // finished products
      ['P1',{ demand:15, plannedSafetyStock:15, currentStock:15, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['P2',{ demand:15, plannedSafetyStock:3, currentStock:15, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['P3',{ demand:9,  plannedSafetyStock:3,  currentStock:3,  waitingQueue:3, workInProgress:3, productionOrder:0 }],
      
      // E‑parts for P1
      ['E51',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E50',{ demand:0, plannedSafetyStock:9, currentStock:0, waitingQueue:10, workInProgress:3, productionOrder:0 }],
      ['E4', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E10',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E49',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E7', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E13',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E18',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      
      // E‑parts for P2
      ['E56',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E55',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E5', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E11',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E54',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E8', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E14',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E19',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      
      // E‑parts for P3
      ['E31',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E30',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E6', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E12',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E29',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E9', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E15',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E20',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      
      // shared E‑parts
      ['E26',{ demand:0, plannedSafetyStock:15, currentStock:15, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E16',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
      ['E17',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ]);// fetch from local storage and map accordingly
    localStorage.setItem(INHOUSE_DISPOSITION_INPUT, JSON.stringify(dispositionInput));
    const dispositionOutput = dispositionService.calculateDispositionValues(productBOMs, dispositionInput);
    setDispositionOutput(dispositionOutput);
    setDispositionInput(dispositionInput);
  }, []);
  
  if (!dispositionInput || !dispositionOutput) {
    return null;                      // or a <CircularProgress />
  }
  return <div>
    <Paper>
      <Display dpR={dispositionOutput} dpI={dispositionInput} />
    </Paper>
  </div>;
}
