import jsonData from "../../data/base-data/parts.json";

export const items = [
  21, 22, 23, 24, 25, 27, 28, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
  44, 45, 46, 47, 48, 52, 53, 57, 58, 59,
];

export const itemAdditionalData = [
  {
    itemNr: 21,
    usageRatioP1: 1,
    usageRatioP2: 0,
    usageRatioP3: 0,
    discountQuantity: 300,
  },
  {
    itemNr: 22,
    usageRatioP1: 0,
    usageRatioP2: 1,
    usageRatioP3: 0,
    discountQuantity: 300,
  },
  {
    itemNr: 23,
    usageRatioP1: 0,
    usageRatioP2: 0,
    usageRatioP3: 1,
    discountQuantity: 300,
  },
  {
    itemNr: 24,
    usageRatioP1: 7,
    usageRatioP2: 7,
    usageRatioP3: 7,
    discountQuantity: 6100,
  },
  {
    itemNr: 25,
    usageRatioP1: 4,
    usageRatioP2: 4,
    usageRatioP3: 4,
    discountQuantity: 3600,
  },
  {
    itemNr: 27,
    usageRatioP1: 2,
    usageRatioP2: 2,
    usageRatioP3: 2,
    discountQuantity: 1800,
  },
  {
    itemNr: 28,
    usageRatioP1: 4,
    usageRatioP2: 5,
    usageRatioP3: 6,
    discountQuantity: 4500,
  },
  {
    itemNr: 32,
    usageRatioP1: 3,
    usageRatioP2: 3,
    usageRatioP3: 3,
    discountQuantity: 2700,
  },
  {
    itemNr: 33,
    usageRatioP1: 0,
    usageRatioP2: 0,
    usageRatioP3: 2,
    discountQuantity: 900,
  },
  {
    itemNr: 34,
    usageRatioP1: 0,
    usageRatioP2: 0,
    usageRatioP3: 72,
    discountQuantity: 22000,
  },
  {
    itemNr: 35,
    usageRatioP1: 4,
    usageRatioP2: 4,
    usageRatioP3: 4,
    discountQuantity: 3600,
  },
  {
    itemNr: 36,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 37,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 38,
    usageRatioP1: 2,
    usageRatioP2: 2,
    usageRatioP3: 2,
    discountQuantity: 1800,
  },
  {
    itemNr: 39,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 40,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 41,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 1800,
  },
  {
    itemNr: 42,
    usageRatioP1: 2,
    usageRatioP2: 2,
    usageRatioP3: 2,
    discountQuantity: 2700,
  },
  {
    itemNr: 43,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 44,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 45,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 46,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 47,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 600,
  },
  {
    itemNr: 48,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 22000,
  },
  {
    itemNr: 52,
    usageRatioP1: 2,
    usageRatioP2: 2,
    usageRatioP3: 2,
    discountQuantity: 600,
  },
  {
    itemNr: 53,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 22000,
  },
  {
    itemNr: 57,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 58,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 900,
  },
  {
    itemNr: 59,
    usageRatioP1: 1,
    usageRatioP2: 1,
    usageRatioP3: 1,
    discountQuantity: 1800,
  },
];

const itemsBasicDataList = jsonData["artikel"];

export const basicData = itemAdditionalData.map(
  ({ itemNr, usageRatioP1, usageRatioP2, usageRatioP3, discountQuantity }) => {
    const itemBasicData = itemsBasicDataList.find((item) =>
      item.artikelnummer.startsWith(itemNr.toString())
    );
    const deliveryTime = itemBasicData?.lieferzeit;
    const deliveryTimeDeviation = itemBasicData?.lieferzeitabweichung;

    return {
      itemNr,
      deliveryTime,
      deliveryTimeDeviation,
      discountQuantity,
      usageRatioP1,
      usageRatioP2,
      usageRatioP3,
    };
  }
);
