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

export function toDispositionInput(productionPlan: PlannedStock): DispositionInput{
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
  if (match && ["1", "2", "3"].includes(match[1])) {
    return "P" + match[1];
  }
  return match ? ("E" + match[1]) : "";
}

export function addProducts(dpInput: DispositionInput, productionPlan: ProductionPlan): DispositionInput {
  productionPlan.forEach(p => {
    const key = mapProductKey(p.product);
    if (!key) return;
    const dpV = dpInput.get(key);
    if (dpV) { // TODO: when I have the data
      dpV.demand = p.values[0];
    }
  })
  return dpInput;
}

function mapProductKey(product: string) {
  switch (product) {
    case "p1ChildrenBike":
      return "P1"
    case "p2WomenBike":
      return "P2"
    case "p3MenBike":
      return "P3"
  }
}


type PlannedStock = { product: string, stock: number, endStock: number, waitingList: number, inProduction: number }[]
type ProductionPlan = { product: "p1ChildrenBike" | "p2WomenBike" | "p3MenBike", values: number[] }[]