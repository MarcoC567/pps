import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar.tsx";
import XmlImport from "./pages/xml-import/XMLimport.tsx";
import LandingPage from "./pages/landing-page/landingpage.tsx";
import { NavigationProvider } from "./context/Navigation/navigationContext";
import ProductionPlanPage from "./pages/production-plan/productionPlanPage.tsx";
import InhouseDispositionPage from "./pages/inhouse-disposition";
import CapacityPlanPage from "./pages/capacity-plan";
import PurchaseDispositionPage from "./pages/purchase-disposition";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <NavigationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/xmlImport" element={<XmlImport />} />
            <Route path="/production-plan" element={<ProductionPlanPage />} />
            <Route
              path="/inhouse-disposition"
              element={<InhouseDispositionPage />}
            />
            <Route path="/capacity-plan" element={<CapacityPlanPage />} />
            <Route
              path="/purchase-disposition"
              element={<PurchaseDispositionPage />}
            />
          </Routes>
        </BrowserRouter>
      </NavigationProvider>
    </>
  );
}

export default App;
