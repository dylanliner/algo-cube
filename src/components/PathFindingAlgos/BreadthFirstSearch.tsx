import { BoxObject } from "../Box";
import { renderPath, getNeighboringNodesDiagonalLast } from "./HelperFunctions";

export const breadthFirstSearch = (
  boxes: BoxObject[][],
  startNode: BoxObject,
  endNode: BoxObject,
  updateGrid: (boxes: BoxObject[][]) => void,
  setOpenDialog: (bool: boolean) => void
): void => {
  console.log("I am in breadthFirstSearch");
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
        return;
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
  setOpenDialog(true);
};
