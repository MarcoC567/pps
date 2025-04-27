import { Disclosure } from "@headlessui/react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext"; // <-- import Language-Context

const initialNavigation = [
  { name: "XML Import", href: "/xmlImport", current: false },
  { name: "Prognose", href: "/forecast", current: false },
  {
    name: "Eigenfertigungsdisposition",
    href: "/inhouse-disposition",
    current: false,
  },
  { name: "Kapazitätsplan", href: "/capacity-plan", current: false },
  {
    name: "Kaufteildisposition",
    href: "/purchase-disposition",
    current: false,
  },
  { name: "XML Export", href: "/xmlExport", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { language, setLanguage } = useLanguage(); // <-- Sprachwechsel

  const navigation = initialNavigation.map((item) => ({
    ...item,
    current: item.href === currentPath,
  }));

  return (
    <Disclosure
      as="nav"
      className="bg-gray-800 fixed top-0 inset-x-0 z-50 w-full"
    >
      <div className="w-full min-h-[5vh] mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Navigation Links */}
          <div className="flex space-x-4 items-center">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "rounded-md px-6 py-2 text-lg font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Language Switch */}
          <div className="flex space-x-2 items-center">
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
