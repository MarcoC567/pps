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
  return match ? ("E" + match[1]) : "";
}

export function addProducts(dpInput: DispositionInput, productionPlan: ProductionPlan): DispositionInput {
  productionPlan.forEach(p => {
    const key = mapProductKey(p.product);
    if (!key) return;
    dpInput.set(key, { // TODO: when I have the data
      demand: p.values[0],
      currentStock: 0,
      plannedSafetyStock: 0,
      workInProgress: 0,
      waitingQueue: 0,
      productionOrder: 0,
    });
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