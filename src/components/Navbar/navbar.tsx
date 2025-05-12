import { Disclosure } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";

// Hilfsfunktion für Klassen
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  const { language, setLanguage } = useLanguage();
  // Initiale Navigation (wie gehabt)
  const initialNavigation = [
    { name: t("XMLimport"), href: "/xmlImport" },
    { name: t("forecastonly"), href: "/forecast" },
    { name: t("inhouse-disposition"), href: "/inhouse-disposition" },
    { name: t("production-order"), href: "/production-order" },
    { name: t("capacityPlan"), href: "/capacity-plan" },
    { name: t("purchasePartsDisposition"), href: "/purchase-disposition" },
    { name: t("XML Export"), href: "/xmlExport" },
  ];

  // State für die freigeschalteten Routen
  const [visited, setVisited] = useState<string[]>([]);

  // Beim Mount aus localStorage lesen
  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("visited_")
    );
    console.log("⤷ localStorage keys:", keys);
    const visitedRoutes = keys.map((k) => k.replace(/^visited_/, ""));
    console.log("⤷ visitedRoutes:", visitedRoutes);
    setVisited(visitedRoutes);
  }, [location.pathname]);

  // Navigation mit “current”-Flag
  const navigation = initialNavigation.map((item) => ({
    ...item,
    current: item.href === currentPath,
    // klickbar, wenn bereits besucht ODER aktuelle Seite
    enabled: visited.includes(item.href) || item.href === "/xmlImport",
  }));

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 inset-x-0 z-50">
      <div className="w-full min-h-[5vh] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Links */}
          <div className="flex space-x-4 items-center">
            {navigation.map((item) => {
              // Wenn nicht enabled, rendern wir ein <span> statt <a>
              const commonClasses = "rounded-md px-6 py-2 text-lg font-medium";
              if (!item.enabled) {
                return (
                  <span
                    key={item.href}
                    className={classNames(
                      "text-gray-600 cursor-not-allowed",
                      commonClasses
                    )}
                  >
                    {item.name}
                  </span>
                );
              }

              // Sonst normale <a>
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    commonClasses
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </a>
              );
            })}
            <button
              onClick={() => setLanguage("de")}
              className={classNames(
                language === "de"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "px-3 py-1 rounded-md text-sm font-medium"
              )}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={classNames(
                language === "en"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "px-3 py-1 rounded-md text-sm font-medium"
              )}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
