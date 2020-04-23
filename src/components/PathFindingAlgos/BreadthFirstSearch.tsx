import { BoxObject } from "../Box";
import { renderPath, getNeighboringNodesDiagonalLast } from "./HelperFunctions";

export const breadthFirstSearch = (
  boxes: BoxObject[][],
  startNodeIndex: [number, number],
  endNodeIndex: [number, number],
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  console.log("I am in breadthFirstSearch");

  const startNode = boxes[startNodeIndex[0]][startNodeIndex[1]];
  const endNode = boxes[endNodeIndex[0]][endNodeIndex[1]];
  //Open List, to visit
  const frontier = new Array<BoxObject>();
  //Set of nodes already evaluated
  const closedSet = new Set<BoxObject>();

  frontier.push(startNode);
  closedSet.add(startNode);
  while (frontier.length > 0) {
    const currentNode = frontier.shift();

    if (currentNode) {
      if (currentNode === endNode) {
        renderPath(currentNode);
        updateGrid(boxes);
        break;
      }

      const neighboringNodes = getNeighboringNodesDiagonalLast(
        currentNode,
        boxes
      );
      neighboringNodes.forEach((neighbor) => {
        if (!neighbor.isBlocked && !closedSet.has(neighbor)) {
          neighbor.parent = currentNode;
          closedSet.add(neighbor);
          frontier.push(neighbor);
        }
      });
    }
  }
};
