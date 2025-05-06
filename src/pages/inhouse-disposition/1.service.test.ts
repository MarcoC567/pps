import { describe, it, expect, beforeEach } from 'vitest';
import { PartBOM } from "./bom.ts";
import { PartId } from "./parts.type.ts";
import { DispositionService } from "./1.service.ts";

interface DispositionValues {
  demand: number;
  currentStock: number;
  plannedSafetyStock: number;
  waitingQueue: number;
  workInProgress: number;
  productionOrder?: number;
}

/**
 * A tiny product structure for the test:
 *
 *            A
 *          /   \
 *         B     C  (isUsedInAll = true)
 */
// const mockProducts: PartBOM[] = [
//   {
//     partId: 'P1',
//     parts: [
//       { partId: 'E4' },
//       { partId: 'E5', isUsedInAll: true },
//     ],
//   },
// ];

function getProduct1BOMTree(): PartBOM {
  return {
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
}

/**
 * Disposition input values fed into the service.
 * (productionOrder will be overwritten by the service)
 */
const mockInput = (): Map<PartId, DispositionValues> =>
  new Map<PartId, DispositionValues>([
    [
      'P1',
      {
        demand: 200,
        plannedSafetyStock: 60,
        currentStock: 60,
        waitingQueue: 120,
        workInProgress: 30,
        productionOrder: 0,
      },
    ],
    [
      'E26',
      {
        demand: 0,
        plannedSafetyStock: 20,
        currentStock: 20,
        waitingQueue: 0,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E51',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E16',
      {
        demand: 0,
        plannedSafetyStock: 20,
        currentStock: 20,
        waitingQueue: 10,
        workInProgress: 5,
        productionOrder: 0,
      },
    ],
    [
      'E17',
      {
        demand: 0,
        plannedSafetyStock: 20,
        currentStock: 20,
        waitingQueue: 0,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],    [
      'E50',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],    [
      'E4',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E10',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E49',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E7',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E13',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
    [
      'E18',
      {
        demand: 0,
        plannedSafetyStock: 50,
        currentStock: 50,
        waitingQueue: 10,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
  ]);


const mockInputAllProducts = (): Map<PartId, DispositionValues> =>
  new Map<PartId, DispositionValues>([
    [
      'P1',
      {
        demand: 15,
        plannedSafetyStock: 15,
        currentStock: 15,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
    [
      'P2',
      {
        demand: 15,
        plannedSafetyStock: 15,
        currentStock: 15,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
    [
      'P3',
      {
        demand: 9,
        plannedSafetyStock: 3,
        currentStock: 3,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
    [
      'E26',
      {
        demand: 0,
        plannedSafetyStock: 15,
        currentStock: 15,
        waitingQueue: 0,
        workInProgress: 0,
        productionOrder: 0,
      },
    ],
  ]);

const productBomAllProducts: PartBOM[] = [
  {
    partId: "P1",
    parts: [
      {
        partId: "E26",
        isUsedInAll: true,
      },
    ],
  },
  {
    partId: "P2",
    parts: [
      {
        partId: "E26",
        isUsedInAll: true,
      },
    ],
  },
  {
    partId: "P3",
    parts: [
      {
        partId: "E26",
        isUsedInAll: true,
      },
    ],
  },
]

const mockInputAllProductsWithWIPandWaiting = (): Map<PartId, DispositionValues> =>
  new Map<PartId, DispositionValues>([
    [
      'P1',
      {
        demand: 15,
        plannedSafetyStock: 15,
        currentStock: 15,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
    [
      'P2',
      {
        demand: 15,
        plannedSafetyStock: 15,
        currentStock: 15,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
    [
      'P3',
      {
        demand: 9,
        plannedSafetyStock: 3,
        currentStock: 3,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
    [
      'E26',
      {
        demand: 0,
        plannedSafetyStock: 15,
        currentStock: 15,
        waitingQueue: 3,
        workInProgress: 3,
        productionOrder: 0,
      },
    ],
  ]);
/* ─────────────────────────────────────────────────────── */
const mockProducts: PartBOM[] = [getProduct1BOMTree()];


describe('DispositionService', () => {
  let service: DispositionService;
  
  beforeEach(() => {
    service = new DispositionService(mockProducts);
  });
  
  it('calculates production orders for every part in the BOM tree', () => {
    const result = service.calculateDispositionValues(mockInput());

    // Helper to make assertions terser
    const prodOrder = (id: PartId) => result.get(id)?.productionOrder;

    expect(prodOrder('P1')).toBe(50);
    expect(prodOrder('E26')).toBe(170);
    expect(prodOrder('E51')).toBe(160);

    expect(prodOrder('E16')).toBe(155);
    expect(prodOrder('E17')).toBe(170);
    expect(prodOrder('E50')).toBe(160);
    expect(prodOrder('E4')).toBe(160);
    expect(prodOrder('E10')).toBe(160);
    expect(prodOrder('E49')).toBe(160);
    expect(prodOrder('E7')).toBe(160);
    expect(prodOrder('E13')).toBe(160);
    expect(prodOrder('E18')).toBe(160);
  });
  
  it('calculates production orders for all 3 products and its children', () => {
    (service as any).productBOMs = productBomAllProducts;
    
    const result = service.calculateDispositionValues(mockInputAllProducts());
    
    // Helper to make assertions terser
    const prodOrder = (id: PartId) => result.get(id)?.productionOrder;
    
    expect(prodOrder('P1')).toBe(9);
    expect(prodOrder('P2')).toBe(9);
    expect(prodOrder('P3')).toBe(3);
    expect(prodOrder('E26')).toBe(30);
  });
  
  it('calculates production orders for all 3 products and its children, that have WIP and Waiting parts', () => {
    (service as any).productBOMs = productBomAllProducts;
    
    const result = service.calculateDispositionValues(mockInputAllProductsWithWIPandWaiting());
    
    // Helper to make assertions terser
    const prodOrder = (id: PartId) => result.get(id)?.productionOrder;
    
    expect(prodOrder('P1')).toBe(9);
    expect(prodOrder('P2')).toBe(9);
    expect(prodOrder('P3')).toBe(3);
    expect(prodOrder('E26')).toBe(24);
  });
  
  it('never returns negative production orders (floor at 0)', () => {
    const negativeInput = new Map<PartId, DispositionValues>([
      [
        'P1',
        {
          demand: 0,
          currentStock: 100,
          plannedSafetyStock: 0,
          waitingQueue: 0,
          workInProgress: 0,
          productionOrder: 0,
        },
      ],
    ]);
    (service as any).productBOMs = [{ partId: 'P1' }];
    
    const result = service.calculateDispositionValues(negativeInput);
    
    expect(result.get('P1')?.productionOrder).toBe(0);
  });
});