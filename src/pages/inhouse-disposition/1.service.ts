import {
  DispositionInput,
  DispositionValues,
  PartBOM,
} from "./bom.ts";
import { PartId } from "./parts.type.ts";

export class DispositionService {
  productBOMs: PartBOM[];
  private output!: Map<PartId, number>;
  
  constructor(productBOMs: PartBOM[]) {
    this.productBOMs = productBOMs;
  }
  
  public calculateDispositionValues(input: DispositionInput): Map<PartId, number> {
    this.output = new Map<PartId, number>();
    
    this.productBOMs.forEach(partBOM => {
      this.traverseAndCalculate(partBOM, input);
    })
    
    return new Map<PartId, number>(this.output);
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