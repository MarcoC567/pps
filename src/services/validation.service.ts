export function isXML(value: File | null | undefined): boolean | string {
  if (!value) return "Fehler keine XML Datei vorhanden oder gefunden";
  else value.name.endsWith(".xml");
  return true;
}
