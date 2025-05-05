import {
  DispositionInput,
  DispositionValues,
  PartBOM,
} from "./bom.ts";

export class DispositionService {
  productBOMs: PartBOM[];
  
  constructor(productBOMs: PartBOM[]) {
    this.productBOMs = productBOMs;
  }
  
  public calculateDispositionValues(input: DispositionInput): DispositionInput {
    this.productBOMs.forEach(partBOM => {
      this.traverseAndCalculate(partBOM, input);
    })
    
    return input;
  }
  
  private traverseAndCalculate(partBOM: PartBOM, input: DispositionInput, carryOver?: number): void {
    const partId = partBOM.partId;
    const productionOrder = this.calculateProductionOrder(partBOM, input, carryOver);
    if (productionOrder) {
      const oldValues = input.get(partId) || this.emptyDispositionValues();
      if (oldValues && oldValues.productionOrder) {
        oldValues.productionOrder += productionOrder.productionOrder ?? 0;
      } else if (oldValues) {
        oldValues.productionOrder = productionOrder.productionOrder;
      }
      partBOM.parts?.forEach(partBOM => {
        const childPart = input.get(partBOM.partId);
        if (childPart) {
          childPart.demand = productionOrder.productionOrder ?? 0;
        }
      })
    }
    if (partBOM.parts) {
      partBOM.parts.forEach(partBOM => {
        this.traverseAndCalculate(partBOM, input, input.get(partId)?.waitingQueue ?? 0);
      });
    }
  }
  
  private emptyDispositionValues(): DispositionValues {
    return {
      demand: 0,
      plannedSafetyStock: 0,
      currentStock: 0,
      waitingQueue: 0,
      workInProgress: 0,
      productionOrder: 0,
    }
  }
  //
  // private addDispositionValues(v1: DispositionValues, v2: DispositionValues): DispositionValues {
  //   return {
  //     demand: v1.demand + v2.demand,
  //     plannedSafetyStock: v1.plannedSafetyStock + v2.plannedSafetyStock,
  //     currentStock: v1.currentStock + v2.currentStock,
  //     waitingQueue: v1.waitingQueue + v2.waitingQueue,
  //     workInProgress: v1.workInProgress + v2.workInProgress,
  //     productionOrder: (v1.productionOrder ?? 0) + (v2.productionOrder ?? 0),
  //   }
  // }
  
  private calculateProductionOrder(partBOM: PartBOM, dpInput: DispositionInput, carryOver?: number): DispositionValues | null {
    const inputValues: DispositionValues | undefined = dpInput.get(partBOM.partId);
    if (!inputValues) {
      return null;
    }
    const productionOrderRaw: number =
                                    inputValues.demand
                                  + (carryOver || 0)
                                  + inputValues.plannedSafetyStock
                                  - inputValues.currentStock
                                  - inputValues.waitingQueue
                                  - inputValues.workInProgress;
    const productionOrder = Math.max(0, productionOrderRaw);

    return { ...inputValues, productionOrder }
  }
}

