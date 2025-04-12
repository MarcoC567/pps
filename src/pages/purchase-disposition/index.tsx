import { items } from "./const";
import ProductionProgramTable from "./ProductionProgramTable";
import PurchaseDispositionTable from "./PurchaseDispositionTable";

export default function PurchaseDispositionPage() {
  
  const fakeAmounts: Record<number, number> = {
    21: 10,
    22: 20,
    23: 30,
    24: 40,
    25: 50,
    27: 60,
    28: 70,
    32: 80,
    33: 90,
    34: 100,
    35: 110,
    36: 120,
    37: 130,
    38: 140,
    39: 150,
    40: 160,
    41: 170,
    42: 180,
    43: 190,
    44: 200,
    45: 210,
    46: 220,
    47: 230,
    48: 240,
    52: 250,
    53: 260,
    57: 270,
    58: 280,
    59: 290,
  };

  const productionData = [
    {
      product: "P1 Children Bike",
      values: [150, 150, 150, 150],
    },
    {
      product: "P2 Women Bike",
      values: [150, 150, 150, 100],
    },
    {
      product: "P3 Men Bike",
      values: [150, 150, 150, 100],
    },
  ];

  const initialInventoryData = items.map((itemNumber) => {
    return {
      itemNr: itemNumber,
      ammount: fakeAmounts[itemNumber],
    };
  });

  return (
    <div>
      <ProductionProgramTable productionData={productionData} />
      <PurchaseDispositionTable
        initialInventoryData={initialInventoryData}
        productionData={productionData}
      />
    </div>
  );
}
