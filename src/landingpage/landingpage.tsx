import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../Navigation/navigationContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setIsNavigateable } = useNavigation();

  useEffect(() => {
    setIsNavigateable(false);
  }, [setIsNavigateable]);

  const handleClick = () => {
    setIsNavigateable(true);
    navigate("/xmlImport");
  };

  return (
    <div className="w-[80vw] min-h-[80vh] mx-auto my-12 bg-white rounded-2xl shadow-md p-8 flex flex-col justify-center items-center hover:shadow-xl transition-shadow duration-300">
      <h1 className="text-2xl font-bold mb-8 text-center text-black">
        Willkommen beim Planungstool
      </h1>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition"
      >
        Starte die Planung
      </button>
    </div>
  );
}
