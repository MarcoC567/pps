import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PartBOM, productBOMs } from "../util/bom.ts";
import { PartId } from "../util/parts.type.ts";
import { DispositionService } from "./inhouseDisposition.service.ts";
import { addProducts, ProductionPlan, Sellwish } from "../util/helpers.ts";

interface DispositionValues {
  demand: number;
  currentStock: number;
  plannedSafetyStock: number;
  waitingQueue: number;
  workInProgress: number;
  productionOrder?: number;
}

function getProduct1BOMTree(): PartBOM {
  return {
    partId: "P1",
    parts: [
      {
        partId: "E26",
        isUsedInAll: false,
      },
      {
        partId: "E51",
        parts: [
          {
            partId: "E16",
            isUsedInAll: false,
          },
          {
            partId: "E17",
            isUsedInAll: false,
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
        demand: 0,
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
        demand: 0,
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
        demand: 0,
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

export const mockAll = (): Map<PartId, DispositionValues> =>
  new Map<PartId, DispositionValues>([
    // finished products
    ['P1',{ demand:15, plannedSafetyStock:15, currentStock:15, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['P2',{ demand:15, plannedSafetyStock:3, currentStock:15, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['P3',{ demand:9,  plannedSafetyStock:3,  currentStock:3,  waitingQueue:3, workInProgress:3, productionOrder:0 }],
    
    // E‑parts for P1
    ['E51',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E50',{ demand:0, plannedSafetyStock:9, currentStock:0, waitingQueue:10, workInProgress:3, productionOrder:0 }],
    ['E4', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E10',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E49',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E7', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E13',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E18',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    
    // E‑parts for P2
    ['E56',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E55',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E5', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E11',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E54',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E8', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E14',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E19',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    
    // E‑parts for P3
    ['E31',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E30',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E6', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E12',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E29',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E9', { demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E15',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E20',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    
    // shared E‑parts
    ['E26',{ demand:0, plannedSafetyStock:15, currentStock:15, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E16',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
    ['E17',{ demand:0, plannedSafetyStock:9, currentStock:6, waitingQueue:3, workInProgress:3, productionOrder:0 }],
  ]);
/* ─────────────────────────────────────────────────────── */
const mockProducts: PartBOM[] = [getProduct1BOMTree()];


describe('DispositionService', () => {
  let service: DispositionService;
  
  beforeEach(() => {
    service = new DispositionService();
    
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
  });
  
  it('calculates production orders for every part in the BOM tree', () => {
    const result = service.calculateDispositionValues(mockProducts, mockInput());

    const prodOrder = (id: PartId) => result.get(id);

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
    const result = service.calculateDispositionValues(productBomAllProducts, mockInputAllProducts());
    
    const prodOrder = (id: PartId) => result.get(id);
    
    expect(prodOrder('P1')).toBe(9);
    expect(prodOrder('P2')).toBe(9);
    expect(prodOrder('P3')).toBe(3);
    expect(prodOrder('E26')).toBe(30);
  });
  
  it('calculates production orders for all 3 products and its children, that have WIP and Waiting parts', () => {
    const mockInputAllPs = mockInputAllProductsWithWIPandWaiting();
    const productionPlan: ProductionPlan = [{product: "p1ChildrenBike", values: [9]},{product: "p2WomenBike", values: [9]},{product: "p3MenBike", values: [3]}];
    const sellwish: Sellwish = [{product: "p1ChildrenBike", current: 15},{product: "p2WomenBike", current: 15},{product: "p3MenBike", current: 9}];
    addProducts(mockInputAllPs, productionPlan, sellwish);
    
    const result = service.calculateDispositionValues(productBomAllProducts, mockInputAllPs);
    
    const dpvs = (id: PartId) => mockInputAllPs.get(id);
    const prodOrder = (id: PartId) => result.get(id);
    
    expect(prodOrder('P1')).toBe(9);
    expect(prodOrder('P2')).toBe(9);
    expect(prodOrder('P3')).toBe(3);
    expect(prodOrder('E26')).toBe(15);
  });
  
  it('full test of the whole thing', () => {
    const result = service.calculateDispositionValues(productBOMs, mockAll());
    
    const prodOrder = (id: PartId) => result.get(id);
    
    expect(prodOrder('P1')).toBe(9);
    expect(prodOrder('E51')).toBe(9);
    expect(prodOrder('E50')).toBe(8);
    expect(prodOrder('E4')).toBe(15);
    expect(prodOrder('E10')).toBe(15);
    expect(prodOrder('E49')).toBe(15);
    expect(prodOrder('E7')).toBe(15);
    expect(prodOrder('E13')).toBe(15);
    expect(prodOrder('E18')).toBe(15);
    
    expect(prodOrder('P2')).toBe(0);
    expect(prodOrder('E56')).toBe(0);
    expect(prodOrder('E55')).toBe(0);
    expect(prodOrder('E5')).toBe(0);
    expect(prodOrder('E11')).toBe(0);
    expect(prodOrder('E54')).toBe(0);
    expect(prodOrder('E8')).toBe(0);
    expect(prodOrder('E14')).toBe(0);
    expect(prodOrder('E19')).toBe(0);
    
    expect(prodOrder('P3')).toBe(3);
    expect(prodOrder('E31')).toBe(3);
    expect(prodOrder('E30')).toBe(3);
    expect(prodOrder('E6')).toBe(3);
    expect(prodOrder('E12')).toBe(3);
    expect(prodOrder('E29')).toBe(3);
    expect(prodOrder('E9')).toBe(3);
    expect(prodOrder('E15')).toBe(3);
    expect(prodOrder('E20')).toBe(3);
    
    // shared parts
    expect(prodOrder('E16')).toBe(15);
    expect(prodOrder('E17')).toBe(15);
    expect(prodOrder('E26')).toBe(12);
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
    
    const result = service.calculateDispositionValues([{ partId: 'P1' }], negativeInput);
    
    expect(result.get('P1')).toBe(0);
  });
});