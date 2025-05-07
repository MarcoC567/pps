import { useEffect, useState } from "react";
import { dispositionService} from "./services";
import { DispositionInput, productBOMs } from "./util/bom.ts";
import { Display } from "./display.tsx";
import { Paper } from "@mui/material";
import { INHOUSE_DISPOSITION_INPUT, INHOUSE_DISPOSITION_RESULT } from "./services/inhouseDisposition.service.ts";
import { toDispositionInput } from "./util/helpers.ts";

export default function InhouseDispositionPage() {
  const [dispositionOutput, setDispositionOutput] = useState<Map<string, number> | null>(null);
  const [dispositionInput, setDispositionInput] = useState<DispositionInput | null>(null);
  
  useEffect(() => {
    const productionPlan = JSON.parse(localStorage.getItem("plannedStockAtTheEndOfThePeriod") ?? "");
    const dispositionInput: DispositionInput = toDispositionInput(productionPlan);
    
    const dispositionResult = dispositionService.calculateDispositionValues(productBOMs, dispositionInput);
    localStorage.setItem(INHOUSE_DISPOSITION_INPUT, JSON.stringify(dispositionInput));
    localStorage.setItem(INHOUSE_DISPOSITION_RESULT, JSON.stringify(dispositionResult));
    
    setDispositionOutput(dispositionResult);
    setDispositionInput(dispositionInput);
  }, []);
  
  if (!dispositionInput || !dispositionOutput) {
    return null;
  }
  
  return <div>
    <Paper>
      <Display dpR={dispositionOutput} dpI={dispositionInput} />
    </Paper>
  </div>;
}
