import { DispositionInput, DispositionValues } from "./bom.ts";

export function flattenTree(nodes, level = 0, parent = null) {
  let result = [];
  
  for (const node of nodes) {
    const {parts, ...rest} = node;
    result.push({...rest, level, parent});
    
    if (parts?.length) {
      result = result.concat(flattenTree(parts, level + 1, node.partId));
    }
  }
  
  return result;
}

export function toDispositionInput(productionPlan: PlannedStock): DispositionInput{
  const emptyMap = new Map<string, DispositionValues>();
  productionPlan.forEach(p => {
    const key = extractKey(p.product);
    if (["E16","E17","E26"].includes(key)) {
        emptyMap.set(key+"_P1", returnDispoValues(p, true));
        emptyMap.set(key+"_P2", returnDispoValues(p, true));
        emptyMap.set(key+"_P3", returnDispoValues(p, true));
    } else {
      const value: DispositionValues = returnDispoValues(p);
      emptyMap.set(key, value);
    }
  });
  return emptyMap as DispositionInput;
}

function returnDispoValues(p: Product, split3: boolean = false) {
  return {
    demand: 0,
    currentStock: split3 ? (p.stock / 3) : p.stock,
    plannedSafetyStock: split3 ? Math.ceil(p.endStock / 3) : p.endStock,
    workInProgress: split3 ? Math.ceil(p.inProduction / 3) : p.inProduction,
    waitingQueue: split3 ? Math.ceil(p.waitingList / 3) : p.waitingList,
    productionOrder: 0,
  }
}

function extractKey(str: string): string {
  const match = str.match(/^(\d{1,2})\s/);
  if (match && ["1", "2", "3"].includes(match[1])) {
    return "P" + match[1];
  }
  return match ? ("E" + match[1]) : "";
}

export function addProducts(dpInput: DispositionInput, productionPlan: ProductionPlan, salesOrder: Sellwish): DispositionInput {
  productionPlan.forEach(p => {
    const key = mapProductKey(p.product);
    if (!key) return;
    const dpV = dpInput.get(key);
    const po = p.values[0];
    if (dpV) {
      dpV.demand = salesOrder.find(s => s.product === p.product)?.current || 0;
      // dpV.plannedSafetyStock = po - ;
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
type Product = { product: string, stock: number, endStock: number, waitingList: number, inProduction: number }
export type ProductionPlan = { product: "p1ChildrenBike" | "p2WomenBike" | "p3MenBike", values: number[] }[]
export type Sellwish = { product: "p1ChildrenBike" | "p2WomenBike" | "p3MenBike", current: number }[]