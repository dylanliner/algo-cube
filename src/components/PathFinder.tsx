import update from "immutability-helper";
import { BoxObject } from "./Box";

export const pathFinder = (
  boxes: BoxObject[][],
  startNodeIndex: [number, number],
  endNodeIndex: [number, number],
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  console.log("I am in PathFinder");

  const startNode = boxes[startNodeIndex[0]][startNodeIndex[1]];
  const endNode = boxes[endNodeIndex[0]][endNodeIndex[1]];

  //Set of nodes to be evaluated
  const openSet = new Array<BoxObject>();

  //Set of nodes already evaluated
  const closedSet = new Set<BoxObject>();

  if (startNode) {
    openSet.push(startNode);
  }

  while (openSet.length > 0) {
    let currentNode = openSet[0];
    for (let i = 1; i < openSet.length; i++) {
      if (
        openSet[i].fCost < currentNode.fCost ||
        (openSet[i].fCost === currentNode.fCost &&
          openSet[i].hCost < currentNode.hCost)
      ) {
        currentNode = openSet[i];
      }
    }

    openSet.pop();
    closedSet.add(currentNode);

    if (currentNode === endNode) {
      //renderPath();
    }
  }

  const renderPath = () => {};

  const getNeighboringNodes = (
    node: BoxObject,
    nodes: Map<[number, number, number], BoxObject>
  ) => {
    const neighboringNodes = new Array<BoxObject>();

    for (let i = node.position[0] - 1; i <= node.position[0] + 1; i++) {
      for (let y = node.position[1] - 1; y <= node.position[1] + 1; y++) {
        const neighborNode = nodes.get([i, y, node.position[2]]);
        if (neighborNode) {
          neighboringNodes.push(neighborNode);
        }
      }
    }
  };
};
