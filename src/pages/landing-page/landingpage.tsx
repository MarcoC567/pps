import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../../context/Navigation/navigationContext";
import { useLanguage } from "../../context/LanguageContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setIsNavigateable } = useNavigation();
  const { t } = useLanguage();

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
        {t("landing_page_title")}
      </h1>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition my-btn"
      >
        {t("landing_page_button")}
      </button>
    </div>
  );
}
