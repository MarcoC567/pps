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
    console.log(dispositionResult);
    
    localStorage.setItem(INHOUSE_DISPOSITION_INPUT, JSON.stringify(Array.from(dispositionInput.entries())));
    setResults(dispositionResult);
    
    setDispositionOutput(dispositionResult);
    setDispositionInput(dispositionInput);
  }, []);
  
  if (!dispositionInput || !dispositionOutput) {
    return null;
  }
  
  function setResults(dispositionResult: Map<string, number>) {
    const copy = new Map<string, number>(dispositionResult);
    copy.forEach((value, key) => {
      if ((key.startsWith("E16") || key.startsWith("E17") || key.startsWith("E26")) && key.length > 3) {
        const newKey = key.slice(0, 3);
        if (copy.has(newKey)) {
          copy.set(newKey, value + (copy.get(newKey) ?? 0));
        } else {
          copy.set(newKey, value);
        }
        copy.delete(key);
      }
    });

    localStorage.setItem(INHOUSE_DISPOSITION_RESULT, JSON.stringify(Array.from(dispositionResult.entries())));
    console.log(copy);
  }
  
  return <div>
    <Paper>
      <InhouseDisposition dpR={dispositionOutput} dpI={dispositionInput} />
    </Paper>
  </div>;
}
