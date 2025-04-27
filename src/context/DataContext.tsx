import { createContext, useContext, useState, ReactNode } from "react";

export type SellWishItem = { article: number; quantity: number };
export type SellDirectItem = { article: number; quantity: number; price: number; penalty: number };
export type OrderItem = { article: number; quantity: number; modus: number };
export type ProductionItem = { article: number; quantity: number };
export type WorkingTimeItem = { station: number; shift: number; overtime: number };

export type DataContextType = {
  sellWish: SellWishItem[];
  setSellWish: (data: SellWishItem[]) => void;
  sellDirect: SellDirectItem[];
  setSellDirect: (data: SellDirectItem[]) => void;
  orderList: OrderItem[];
  setOrderList: (data: OrderItem[]) => void;
  productionList: ProductionItem[];
  setProductionList: (data: ProductionItem[]) => void;
  workingTimeList: WorkingTimeItem[];
  setWorkingTimeList: (data: WorkingTimeItem[]) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useDataContext must be used within a DataProvider");
  return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [sellWish, setSellWish] = useState<SellWishItem[]>([]);
  const [sellDirect, setSellDirect] = useState<SellDirectItem[]>([]);
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [productionList, setProductionList] = useState<ProductionItem[]>([]);
  const [workingTimeList, setWorkingTimeList] = useState<WorkingTimeItem[]>([]);

  return (
    <DataContext.Provider value={{
      sellWish, setSellWish,
      sellDirect, setSellDirect,
      orderList, setOrderList,
      productionList, setProductionList,
      workingTimeList, setWorkingTimeList,
    }}>
      {children}
    </DataContext.Provider>
  );
}