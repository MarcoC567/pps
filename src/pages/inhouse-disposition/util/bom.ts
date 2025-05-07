import { PartId } from "./parts.type.ts";

export interface DispositionValues {
  /*
  Automatisch für nicht P-Teile
   */
  demand: number;
  plannedSafetyStock: number;
  currentStock: number;
  waitingQueue: number;
  workInProgress: number;
  productionOrder?: number;
}

export type DispositionInput = Map<PartId, DispositionValues>;

export interface PartBOM {
  partId: PartId;
  isUsedInAll?: boolean;
  parts?: PartBOM[];
}

const p1: PartBOM = {
  partId: "P1",
  parts: [
    {
      partId: "E26",
      isUsedInAll: true,
    },
    {
      partId: "E51",
      parts: [
        {
          partId: "E16",
          isUsedInAll: true,
        },
        {
          partId: "E17",
          isUsedInAll: true,
        },
        {
          partId: "E50",
          parts: [
            {
              partId: "E4",
            },
            {
              partId: "E10",
            },
            {
              partId: "E49",
              parts: [
                {
                  partId: "E7",
                },
                {
                  partId: "E13",
                },
                {
                  partId: "E18",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const p2: PartBOM = {
  partId: "P2",
  parts: [
    {
      partId: "E26",
      isUsedInAll: true,
    },
    {
      partId: "E56",
      parts: [
        {
          partId: "E16",
          isUsedInAll: true,
        },
        {
          partId: "E17",
          isUsedInAll: true,
        },
        {
          partId: "E55",
          parts: [
            {
              partId: "E5",
            },
            {
              partId: "E11",
            },
            {
              partId: "E54",
              parts: [
                {
                  partId: "E8",
                },
                {
                  partId: "E14",
                },
                {
                  partId: "E19",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const p3: PartBOM = {
  partId: "P3",
  parts: [
    {
      partId: "E26",
      isUsedInAll: true,
    },
    {
      partId: "E31",
      parts: [
        {
          partId: "E16",
          isUsedInAll: true,
        },
        {
          partId: "E17",
          isUsedInAll: true,
        },
        {
          partId: "E30",
          parts: [
            {
              partId: "E6",
            },
            {
              partId: "E12",
            },
            {
              partId: "E29",
              parts: [
                {
                  partId: "E9",
                },
                {
                  partId: "E15",
                },
                {
                  partId: "E20",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const productBOMs: PartBOM[] = [p1, p2, p3];