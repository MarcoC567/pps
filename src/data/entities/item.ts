import { Workstation } from "./workstation.ts";

export interface Item {
  artikelnummer: string;
  produktart: string;
  bezeichnung: string;
  verwendung: string | null;
  startmenge: number;
  startpreis: number;
  lieferkosten: number | null;
  lieferzeit: number | null;
  lieferzeitabweichung: number | null;
  arbeitsplaetze: Workstation[];
}
