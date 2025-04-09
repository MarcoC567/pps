import { Disclosure } from "@headlessui/react";
import { useState } from "react";

const initialNavigation = [
  { name: "XML Import", href: "/xml-import", current: false },
  { name: "Prognose/Produktionsplan", href: "/production-plan", current: false },
  { name: "Eigenfertigungsdisposition", href: "/inhouse-disposition", current: false },
  { name: "Kapazitätsplan", href: "/capacity-plan", current: false },
  { name: "Kaufteildisposition", href: "/purchase-disposition", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [navigation, setNavigation] = useState(initialNavigation);

  const handleNavClick = (clickedItemName: string) => {
    setNavigation((prev) =>
      prev.map((item) => ({
        ...item,
        current: item.name === clickedItemName,
      }))
    );
  };

  return (
    <Disclosure
      as="nav"
      className="bg-gray-800 fixed top-0 inset-x-0 z-50 w-full"
    >
      <div className="w-full min-h-[5vh] mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center">
          {" "}
          <div className="flex space-x-4 items-center">
            {" "}
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item.name)}
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
        </div>
      </div>
    </Disclosure>
  );
}
