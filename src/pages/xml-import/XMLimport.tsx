import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "../../context/Navigation/navigationContext";
import { DocumentArrowUpIcon } from "@heroicons/react/16/solid";
import { XMLParser } from "fast-xml-parser";
import { isXML } from "../../services/validation.service";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

export default function XMLimport() {
  const { setIsNavigateable } = useNavigation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  //TODO jsonData später verwenden um die Daten aus der XML in die Tabellen zu mappen.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [, /*jsonData*/ setJsonData] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [canImport, setCanImport] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    setIsNavigateable(false);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    console.log("selectedFile", selectedFile);

    const validationResult = isXML(selectedFile);
    console.log("validationResult", validationResult);
    const isValid = validationResult === true;
    console.log("isValid", isValid);
    setFile(isValid ? selectedFile : null);
    setFileError(
      isValid
        ? null
        : typeof validationResult === "string"
        ? validationResult
        : "Ungültige Datei."
    );
    setJsonData(null);
    setCanImport(isValid);
  };

  const handleSelectButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportButtonClick = () => {
    if (file) {
      readFile(file);
    } else {
      setFileError("Bitte wähle zuerst eine XML-Datei aus.");
    }
  };

  const readFile = (fileToRead: File) => {
    const options = {
      attributeNamePrefix: "",
      ignoreAttributes: false,
    };

    const parser = new XMLParser(options);
    const reader = new FileReader();
    reader.readAsText(fileToRead);

    reader.onload = function (event) {
      try {
        const parsedData = parser.parse(event.target?.result as string);
        setJsonData(parsedData);
        localStorage.clear();
        localStorage.setItem("importData", JSON.stringify(parsedData));
        setFileError(null);
        localStorage.setItem("visited_/xmlImport", "true");
        navigate("/forecast");
      } catch (error) {
        console.error("Fehler beim Parsen der XML-Datei:", error);
        setFileError(
          "Fehler beim Parsen der XML-Datei. Bitte überprüfe die Datei."
        );
        setJsonData(null);
      }
    };

    reader.onerror = function (error) {
      console.error("Fehler beim Lesen der Datei:", error);
      setFileError("Fehler beim Lesen der Datei.");
      setJsonData(null);
    };
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">XML Input</h2>
        <p className="mt-2 text-gray-600 text-sm">{t("pleaseSelectXML")}</p>
        <input
          type="file"
          accept=".xml"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          onClick={(e) => ((e.target as HTMLInputElement).value = "")}
        />
        <div className="mt-4 flex flex-col items-center gap-4">
          <button
            onClick={handleSelectButtonClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 flex items-center gap-2 mx-auto my-btn "
          >
            {t("selectXML")}
            <DocumentArrowUpIcon className="w-5 h-5" />
          </button>
          {file && (
            <div className="mt-2 text-sm text-gray-500 flex items-center justify-between border rounded px-2 py-1">
              <span className="truncate">
                {t("choosenFile")} {file.name}
              </span>
              <button
                onClick={() => {
                  setFile(null);
                  setFileError(null);
                  setJsonData(null);
                  setCanImport(false);
                }}
                className={`mt-4 mx-auto my-btn`}
                title={t("removeFile")}
              >
                &times;
              </button>
            </div>
          )}
          {fileError && (
            <p className="mt-2 text-red-500 text-sm">{fileError}</p>
          )}
          <button
            onClick={handleImportButtonClick}
            disabled={!canImport || fileError !== null}
            className={`mt-4 mx-auto my-btn`}
          >
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
}
