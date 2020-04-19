import { BoxObject } from "../Box";
import {
  renderPath,
  getNeighboringNodes,
  getDistanceBetweenNodes,
} from "./HelperFunctions";
import { BinaryHeap } from "./BinaryHeap";

export const breadthFirstSearch = (
  boxes: BoxObject[][],
  startNodeIndex: [number, number],
  endNodeIndex: [number, number],
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  const t0 = performance.now();
  console.log("I am in PathFinder");

  const startNode = boxes[startNodeIndex[0]][startNodeIndex[1]];
  const endNode = boxes[endNodeIndex[0]][endNodeIndex[1]];
};
