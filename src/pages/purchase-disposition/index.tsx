import ProductionProgramTable from "./ProductionProgramTable";

export default function PurchaseDispositionPage() {
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
  return (
      <div>
        <ProductionProgramTable productionData={productionData} />
      </div>
    );
}
