import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrentPeriodContextType {
  currentPeriod: number | undefined;
  setCurrentPeriod: (period: number) => void;
}

const CurrentPeriodContext = createContext<CurrentPeriodContextType | undefined>(undefined);

export const useCurrentPeriod = () => {
  const context = useContext(CurrentPeriodContext);
  if (!context) throw new Error('useCurrentPeriod must be used within CurrentPeriodProvider');
  return context;
};

export const CurrentPeriodProvider = ({ children }: { children: ReactNode }) => {
  const [currentPeriod, setCurrentPeriod] = useState<number>();

  useEffect(() => {
    const importData = JSON.parse(localStorage.getItem('importData') || '{}') as {
      results?: {
        period: string;
        futureinwardstockmovement?: {
          order?: Array<{ orderperiod: string; article: string; mode: string; amount: string }>;
        };
      };
    };

    const parsedPeriod = Number(importData.results?.period);
    if (!isNaN(parsedPeriod)) {
      setCurrentPeriod(parsedPeriod);
    }
  }, []);

  return (
    <CurrentPeriodContext.Provider value={{ currentPeriod, setCurrentPeriod }}>
      {children}
    </CurrentPeriodContext.Provider>
  );
};
