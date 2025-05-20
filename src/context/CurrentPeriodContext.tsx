import { createContext, useContext, useState, ReactNode } from "react";

interface CurrentPeriodContextType {
  currentPeriod: number | undefined;
  setCurrentPeriod: (period: number) => void;
}

const CurrentPeriodContext = createContext<
  CurrentPeriodContextType | undefined
>(undefined);

export const useCurrentPeriod = () => {
  const context = useContext(CurrentPeriodContext);
  if (!context)
    throw new Error(
      "useCurrentPeriod must be used within CurrentPeriodProvider"
    );
  return context;
};

export const CurrentPeriodProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentPeriod, setCurrentPeriod] = useState<number>(() => {
    const importData = JSON.parse(
      localStorage.getItem("importData") || "{}"
    ) as {
      results?: { period: string };
    };
    const parsed = Number(importData.results?.period);
    return !isNaN(parsed) ? parsed : 0;
  });

  return (
    <CurrentPeriodContext.Provider value={{ currentPeriod, setCurrentPeriod }}>
      {children}
    </CurrentPeriodContext.Provider>
  );
};
