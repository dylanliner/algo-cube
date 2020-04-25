import { BoxObject } from "../Box";
import {
  renderPath,
  getNeighboringNodes,
  getDistanceBetweenNodes,
} from "./HelperFunctions";
import { BinaryHeap } from "./BinaryHeap";

export const aStarBinaryHeap = (
  boxes: BoxObject[][],
  startNode: BoxObject,
  endNode: BoxObject,
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  console.log("I am in aStarBinaryHeap");

  //Set of nodes to be evaluated
  const openSet = new BinaryHeap(boxes.length * boxes.length);

  //Set of nodes already evaluated
  const closedSet = new Set<BoxObject>();

  openSet.addToTop(startNode);

  while (openSet.length > 0) {
    const currentNode = openSet.removeTop();

    closedSet.add(currentNode);

    if (currentNode === endNode) {
      renderPath(currentNode);
      updateGrid(boxes);
      break;
    }
    const neighboringNodes = getNeighboringNodes(currentNode, boxes);
    neighboringNodes.forEach((neighbor) => {
      if (!neighbor.isBlocked && !closedSet.has(neighbor)) {
        const newNeighborGCost =
          currentNode.gCost + getDistanceBetweenNodes(currentNode, neighbor);
        if (newNeighborGCost < neighbor.gCost || neighbor.heapIndex === -1) {
          neighbor.gCost = newNeighborGCost;
          neighbor.parent = currentNode;
          if (neighbor.heapIndex === -1) {
            neighbor.hCost = getDistanceBetweenNodes(endNode, neighbor);
            openSet.addToTop(neighbor);
          } else {
            openSet.sortUp(neighbor);
          }
        }
      }
    });
  }
};
