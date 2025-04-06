import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/navbar.tsx";
import XmlImport from "./components/XMLimport/XMLimport.tsx";
import LandingPage from "./components/landingpage/landingpage.tsx";
import { NavigationProvider } from "./components/Navigation/navigationContext";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <NavigationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/xmlImport" element={<XmlImport />} />
          </Routes>
        </BrowserRouter>
      </NavigationProvider>
    </>
  );
}

export default App;
