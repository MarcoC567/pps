import { DispositionInput, DispositionValues } from "./bom.ts";

export function flattenTree(nodes, level = 0, parent = null) {
  let result = [];
  
  for (const node of nodes) {
    const {parts, ...rest} = node;
    result.push({...rest, level, parent});
    
    if (parts?.length) {
      result = result.concat(flattenTree(parts, level + 1, node.id));
    }
  }
  
  return result;
}

export function toDispositionInput(productionPlan: ProductionPlan): DispositionInput{
  const emptyMap = new Map<string, DispositionValues>();
  productionPlan.forEach(p => {
    const key = extractKey(p.product);
    const value: DispositionValues = {
      demand: 0,
      currentStock: p.stock,
      plannedSafetyStock: p.endStock,
      workInProgress: p.inProduction,
      waitingQueue: p.waitingList,
      productionOrder: 0,
    }
    emptyMap.set(key, value);
  });
  return emptyMap as DispositionInput;
}

function extractKey(str: string): string {
  const match = str.match(/^(\d{1,2})\s/);
  return match ? ("E" + match[1]) : "";
}



type ProductionPlan = { product: string, stock: number, endStock: number, waitingList: number, inProduction: number }[]