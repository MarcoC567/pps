import { Disclosure } from "@headlessui/react";
import { useLocation, NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
// import { useEffect, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();

  const initialNavigation = [
    { name: t("XMLimport"), href: "/xmlImport" },
    { name: t("forecastonly"), href: "/forecast" },
    { name: t("inhouse-disposition"), href: "/inhouse-disposition" },
    { name: t("production-order"), href: "/production-order" },
    { name: t("capacityPlan"), href: "/capacity-plan" },
    { name: t("purchasePartsDisposition"), href: "/purchase-disposition" },
    { name: t("XML Export"), href: "/xmlExport" },
  ];

  const currentIndex = Math.max(
    0,
    initialNavigation.findIndex((item) => item.href === location.pathname)
  );

  const navigation = initialNavigation.map((item, idx) => ({
    ...item,
    enabled: idx <= currentIndex,
  }));

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 inset-x-0 z-50">
      <div className="w-full min-h-[5vh] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Links */}
          <div className="flex space-x-4 items-center">
            {navigation.map((item) => {
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
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      commonClasses
                    )
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
            <button
              onClick={() => setLanguage("de")}
              className={classNames(
                language === "de"
                  ? "my-btn text-indigo-800"
                  : "text-gray-300 hover:bg-gray-700 hover:text-gray-600",
                "px-3 py-1 rounded-md text-sm font-medium"
              )}
            >
              DE
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={classNames(
                language === "en"
                  ? "my-btn text-indigo-800"
                  : "text-gray-300 hover:bg-gray-700 hover:text-gray-600",
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
