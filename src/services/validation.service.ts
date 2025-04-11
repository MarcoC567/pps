export function isXML(value: File | null | undefined): boolean | string {
  if (!value) return "Fehler: keine XML-Datei vorhanden oder gefunden";
  if (!value.name.toLowerCase().endsWith(".xml")) {
    return "Ungültige Datei: Bitte eine Datei mit der Endung .xml auswählen";
  }
  return true;
}
