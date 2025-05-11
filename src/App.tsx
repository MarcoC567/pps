import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar.tsx";
import XmlImport from "./pages/xml-import/XMLimport.tsx";
import LandingPage from "./pages/landing-page/landingpage.tsx";
import { NavigationProvider } from "./context/Navigation/navigationContext";
import Forecast from "./pages/production-plan/productionPlanPage.tsx";
import InhouseDispositionPage from "./pages/inhouse-disposition";
import CapacityPlanPage from "./pages/capacity-plan";
import PurchaseDispositionPage from "./pages/purchase-disposition";
import { LanguageProvider } from "./context/LanguageContext";
import ExportPage from "./pages/xml-export/XMLexport.tsx";
import ProductionOrderList from "./pages/batchSizeSplitting/BatchSizeSplitting.tsx";
import { CurrentPeriodProvider } from "./context/CurrentPeriodContext.tsx";

function App() {
  return (
    <CurrentPeriodProvider>
      <LanguageProvider>
        <BrowserRouter>
          <NavigationProvider>
            <Navbar />
            <main style={{ paddingTop: "5rem" }}>
              {/* sorgt dafür, dass der Inhalt nicht hinter der Navbar liegt */}
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/xmlImport" element={<XmlImport />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route
                  path="/inhouse-disposition"
                  element={<InhouseDispositionPage />}
                />
                <Route
                  path="/production-order"
                  element={<ProductionOrderList />}
                />
                <Route path="/capacity-plan" element={<CapacityPlanPage />} />
                <Route
                  path="/purchase-disposition"
                  element={<PurchaseDispositionPage />}
                />
                <Route path="/xmlExport" element={<ExportPage />} />
              </Routes>
            </main>
          </NavigationProvider>
        </BrowserRouter>
      </LanguageProvider>
    </CurrentPeriodProvider>
  );
}

export default App;
