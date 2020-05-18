import { BoxObject } from "./Box";

export interface RunButton {
  label: string;
  pathFindingAlgo?: (
    boxes: BoxObject[][],
    startNodeIndex: BoxObject,
    endNodeIndex: BoxObject,
    updateGrid: (boxes: BoxObject[][]) => void,
    setOpenDialog: (bool: boolean) => void
  ) => void;
  searchingAlgo?: (
    x: number,
    boxes: BoxObject[],
    setBoxArray: (boxes: BoxObject[]) => void,
    setOpenDialog: (bool: boolean) => void
  ) => void;
  sortingAlgo?: (
    boxes: BoxObject[],
    setBoxArray: (boxes: BoxObject[]) => void
  ) => void;
  executionTime?: string;
  disabled?: boolean;
}
