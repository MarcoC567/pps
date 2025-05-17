import {
  DispositionInput,
  DispositionValues,
  PartBOM,
} from "../util/bom.ts";
import { PartId } from "../util/parts.type.ts";

export const INHOUSE_DISPOSITION_RESULT = 'inhouseDispositionResult';
export const INHOUSE_DISPOSITION_INPUT = 'inhouseDispositionInput';

export class DispositionService {
  private output!: Map<string, number>;
  
  /*
    Recursively calculate the disposition values for the given product BOMs and the given disposition input.
    Saves the result in local storage.
   */
  public calculateDispositionValues(productBOMs: PartBOM[], dispositionInput: DispositionInput): Map<string, number> {
    this.output = new Map<PartId, number>();
    
    productBOMs.forEach(partBOM => {
      this.traverseAndCalculate(partBOM, dispositionInput, partBOM.partId);
    })
    
    const outputMap = new Map<string, number>(this.output);
    localStorage.setItem(INHOUSE_DISPOSITION_RESULT, JSON.stringify(outputMap));
    return new Map<string, number>(outputMap);
  }
  
  private traverseAndCalculate(partBOM: PartBOM, input: DispositionInput, parent: string, carryOver?: number): void {
    const productionOrder = this.calculateAndSetProdOrder(partBOM, input, parent, carryOver)
    
    partBOM.parts?.forEach(part => {
      const childPart = part.isUsedInAll ?
        input.get(part.partId+"_"+parent) :
        input.get(part.partId);
      if (childPart) {
        childPart.demand = productionOrder;
      }
    })
    
    if (partBOM.parts) {
      partBOM.parts.forEach(part => {
        this.traverseAndCalculate(part, input, partBOM.partId, input.get(part.partId)?.waitingQueue ?? 0);
      });
    }
  }
  
  private calculateAndSetProdOrder(partBOM: PartBOM, input: DispositionInput, parent: string, carryOver?: number): number {
    const partId = partBOM.isUsedInAll ? partBOM.partId+"_"+parent : partBOM.partId;
    const productionOrder = this.calculateProductionOrder(partBOM, input, parent, carryOver);
    
    const oldValue = this.output.get(partId);
    if (partBOM.isUsedInAll) {
      if (["E16","E17", "E26"].includes(partBOM.partId)) {
         const newPartId = partBOM.partId+"_"+this.mapParent(parent);
        this.output.set(newPartId, productionOrder);
      } else {
        this.output.set(partId, productionOrder);
      }
    } else {
      this.output.set(partId, productionOrder);
    }
    return productionOrder;
  }
  
  private calculateProductionOrder(partBOM: PartBOM, dpInput: DispositionInput, parent: string, carryOver?: number): number {
    const partId = ["E16","E17", "E26"].includes(partBOM.partId) ? partBOM.partId+"_"+this.mapParent(parent) : partBOM.partId;
    const inputValues: DispositionValues | undefined = dpInput.get(partId);
    if (!inputValues) {
      return 0;
    }
    const productionOrderRaw: number =
                                    inputValues.demand
                                  + (dpInput.get(parent)?.waitingQueue ?? 0)
                                  + inputValues.plannedSafetyStock
                                  - inputValues.currentStock
                                  - inputValues.waitingQueue
                                  - inputValues.workInProgress;
    return Math.max(0, Math.ceil(productionOrderRaw));
  }
  
  private mapParent(parent: string) {
    if (parent === "E51") return "P1";
    if (parent === "E56") return "P2";
    if (parent === "E31") return "P3";
    if (["P1", "P2", "P3"].includes(parent)) return parent;
  }
}