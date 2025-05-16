import { useEffect, useState } from "react";
import { dispositionService} from "./services";
import { DispositionInput, productBOMs } from "./util/bom.ts";
import { InhouseDisposition } from "./inhouseDisposition.tsx";
import { Paper } from "@mui/material";
import { INHOUSE_DISPOSITION_INPUT, INHOUSE_DISPOSITION_RESULT } from "./services/inhouseDisposition.service.ts";
import { addProducts, toDispositionInput } from "./util/helpers.ts";

export default function InhouseDispositionPage() {
  const [dispositionOutput, setDispositionOutput] = useState<Map<string, number> | null>(null);
  const [dispositionInput, setDispositionInput] = useState<DispositionInput | null>(null);
  
  useEffect(() => {
    const plannedStock = JSON.parse(localStorage.getItem("plannedStockAtTheEndOfThePeriod") ?? "");
    const productionPlan = JSON.parse(localStorage.getItem("productionPlanData") ?? "");
    const salesOrder = JSON.parse(localStorage.getItem("sellwish") ?? "");
    
    const dispositionInputWithProducts: DispositionInput = toDispositionInput(plannedStock);
    const dispositionInput = addProducts(dispositionInputWithProducts, productionPlan, salesOrder);
    
    const dispositionResult = dispositionService.calculateDispositionValues(productBOMs, dispositionInput);
    // console.log(dispositionInput);
    // console.log(dispositionResult);
    
    localStorage.setItem(INHOUSE_DISPOSITION_INPUT, JSON.stringify(Array.from(dispositionInput.entries())));
    localStorage.setItem(INHOUSE_DISPOSITION_RESULT, JSON.stringify(Array.from(dispositionResult.entries())));
    
    setDispositionOutput(dispositionResult);
    setDispositionInput(dispositionInput);
  }, []);
  
  if (!dispositionInput || !dispositionOutput) {
    return null;
  }
  
  return <div>
    <Paper>
      <InhouseDisposition dpR={dispositionOutput} dpI={dispositionInput} />
    </Paper>
  </div>;
}
