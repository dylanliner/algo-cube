import { BoxObject } from "../Box";
import {
  renderPath,
  getNeighboringNodes,
  getDistanceBetweenNodes,
} from "./HelperFunctions";
import { BinaryHeap } from "./BinaryHeap";
export const dijkstraAlgorithm = (
  boxes: BoxObject[][],
  startNode: BoxObject,
  endNode: BoxObject,
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  console.log("I am in dijkstraAlgorithm");
  //Open List, to visit
  const frontier = new BinaryHeap(boxes.length * boxes.length);
  //Set of nodes already evaluated
  const closedSet = new Set<BoxObject>();

  frontier.addToTop(startNode);
  while (frontier.length > 0) {
    const currentNode = frontier.removeTop();
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
        if (neighbor.heapIndex === -1 || newNeighborGCost < neighbor.gCost) {
          neighbor.gCost = newNeighborGCost;
          neighbor.parent = currentNode;
          if (neighbor.heapIndex === -1) {
            frontier.addToTop(neighbor);
          } else {
            frontier.sortUp(neighbor);
          }
        }
      }
    });
  }
};
