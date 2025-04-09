import { useEffect } from "react";
import { useNavigation } from "../../context/Navigation/navigationContext";
import { DocumentArrowUpIcon } from "@heroicons/react/16/solid";

export default function LandingPage() {
  const { setIsNavigateable } = useNavigation();

  useEffect(() => {
    setIsNavigateable(false);
  }, [setIsNavigateable]);

  const handleClick = () => {
    setIsNavigateable(true);
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">XML Input</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Bitte wähle hier deine XML Datei aus und lade sie hoch.
        </p>
        <button
          onClick={handleClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto "
        >
          XML hinzufügen
          <DocumentArrowUpIcon className="w-5 h-5"></DocumentArrowUpIcon>
        </button>
      </div>
    </div>
  );
}
