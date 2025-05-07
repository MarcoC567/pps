import {
  DispositionInput,
  DispositionValues,
  PartBOM,
} from "../util/bom.ts";
import { PartId } from "../util/parts.type.ts";

export const INHOUSE_DISPOSITION_RESULT = 'inhouseDispositionResult';
export const INHOUSE_DISPOSITION_INPUT = 'inhouseDispositionInput';

export class DispositionService {
  private output!: Map<PartId, number>;
  
  /*
    Recursively calculate the disposition values for the given product BOMs and the given disposition input.
    Saves the result in local storage.
   */
  public calculateDispositionValues(productBOMs: PartBOM[], dispositionInput: DispositionInput): Map<PartId, number> {
    this.output = new Map<PartId, number>();
    
    productBOMs.forEach(partBOM => {
      this.traverseAndCalculate(partBOM, dispositionInput);
    })
    
    const outputMap = new Map<PartId, number>(this.output);
    localStorage.setItem(INHOUSE_DISPOSITION_RESULT, JSON.stringify(outputMap));
    return outputMap;
  }
  
  private traverseAndCalculate(partBOM: PartBOM, input: DispositionInput, carryOver?: number): void {
    const partId = partBOM.partId;
    const productionOrder = this.calculateProductionOrder(partBOM, input, carryOver);
    
    const oldValue = this.output.get(partId);
    if (oldValue) {
      this.output.set(partId, oldValue + productionOrder);
    } else {
      this.output.set(partId, productionOrder);
    }
    
    partBOM.parts?.forEach(partBOM => {
      const childPart = input.get(partBOM.partId);
      if (childPart) {
        childPart.demand = productionOrder;
      }
    })
    
    if (partBOM.parts) {
      partBOM.parts.forEach(partBOM => {
        this.traverseAndCalculate(partBOM, input, input.get(partId)?.waitingQueue ?? 0);
      });
    }
  }
  
  private calculateProductionOrder(partBOM: PartBOM, dpInput: DispositionInput, carryOver?: number): number {
    const inputValues: DispositionValues | undefined = dpInput.get(partBOM.partId);
    if (!inputValues) {
      return 0;
    }
    const productionOrderRaw: number =
                                    inputValues.demand
                                  + (carryOver || 0)
                                  + (partBOM.isUsedInAll ? inputValues.plannedSafetyStock / 3 : inputValues.plannedSafetyStock)
                                  - (partBOM.isUsedInAll ? inputValues.currentStock / 3 : inputValues.currentStock)
                                  - (partBOM.isUsedInAll ? inputValues.waitingQueue / 3 : inputValues.waitingQueue)
                                  - (partBOM.isUsedInAll ? inputValues.workInProgress / 3 : inputValues.workInProgress);
    return Math.max(0, productionOrderRaw);
  }
}