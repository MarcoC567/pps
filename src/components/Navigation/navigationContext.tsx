import { createContext, useContext, useState, ReactNode } from "react";

interface NavigationContextType {
  isNavigateable: boolean;
  setIsNavigateable: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [isNavigateable, setIsNavigateable] = useState(false);

  return (
    <NavigationContext.Provider value={{ isNavigateable, setIsNavigateable }}>
      {children}
    </NavigationContext.Provider>
  );
};
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavigation muss mit einem NavigationProvider genutzt werden"
    );
  }
  return context;
};
