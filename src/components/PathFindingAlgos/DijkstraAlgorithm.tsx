import { BoxObject } from "../Box";
import {
  renderPath,
  getNeighboringNodes,
  getDistanceBetweenNodes,
} from "./HelperFunctions";
import { BinaryHeap } from "./BinaryHeap";
export const dijkstraAlgorithm = (
  boxes: BoxObject[][],
  startNodeIndex: [number, number],
  endNodeIndex: [number, number],
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  console.log("I am in dijkstraAlgorithm");

  const startNode = boxes[startNodeIndex[0]][startNodeIndex[1]];
  const endNode = boxes[endNodeIndex[0]][endNodeIndex[1]];
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
