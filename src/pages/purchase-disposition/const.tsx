import jsonData from "../../data/base-data/parts.json";

export const items = [
  21, 22, 23, 24, 25, 27, 28, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
  44, 45, 46, 47, 48, 52, 53, 57, 58, 59,
];

export const usageRatioP1List = [
  1, 0, 0, 7, 4, 2, 4, 3, 0, 0, 4, 1, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 1, 2, 2, 72,
  0, 0, 2,
];

export const usageRatioP2List = [
  0, 1, 0, 7, 4, 2, 5, 3, 0, 0, 4, 1, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 1, 2, 0, 0,
  2, 72, 2,
];

export const usageRatioP3List = [
  0, 0, 1, 7, 4, 2, 6, 3, 2, 72, 4, 1, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 1, 2, 0, 0,
  0, 0, 2,
];

export const discountQuantityValues = [
  300, 300, 300, 6100, 3600, 1800, 4500, 2700, 900, 22000, 3600, 900, 900, 300,
  1800, 900, 900, 1800, 2700, 900, 900, 900, 900, 1800, 600, 22000, 600, 22000,
  1800,
];

const itemsBasicDataList = jsonData["artikel"];

export const basicData = items.map((itemNr, index) => {
  const itemBasicData = itemsBasicDataList.find((item) =>
    item.artikelnummer.startsWith(itemNr.toString())
  );
  const deliveryTime = itemBasicData?.lieferzeit;
  const deliveryTimeDeviation = itemBasicData?.lieferzeitabweichung;

  return {
    itemNr: itemNr,
    deliveryTime: deliveryTime,
    deliveryTimeDeviation: deliveryTimeDeviation,
    discountQuantity: discountQuantityValues[index],
    usageRatioP1: usageRatioP1List[index],
    usageRatioP2: usageRatioP2List[index],
    usageRatioP3: usageRatioP3List[index],
  };
});
