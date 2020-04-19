import { BoxObject } from "./Box";

export class Heap {
  nodes: BoxObject[];

  length: number;

  constructor(heapSize: number) {
    this.nodes = new Array(heapSize);
    this.length = 0;
  }

  addToTop(node: BoxObject) {
    node.heapIndex = this.length;
    this.nodes[this.length] = node;
    this.sortUp(node);
    this.length++;
  }

  sortUp(node: BoxObject) {
    let currentNode = node;
    while (currentNode.heapIndex > 0) {
      const parentIndex = Math.floor((currentNode.heapIndex - 1) / 2);
      const parentNode = this.nodes[parentIndex];
      if (parentNode.fCost() > node.fCost()) {
        this.swapNodes(parentNode, node);
      } else {
        break;
      }
      currentNode = this.nodes[parentIndex];
    }
  }

  swapNodes(nodeA: BoxObject, nodeB: BoxObject) {
    const nodeAHeapIndex = nodeA.heapIndex;
    this.nodes[nodeAHeapIndex] = nodeB;
    this.nodes[nodeB.heapIndex] = nodeA;

    nodeA.heapIndex = nodeB.heapIndex;
    nodeB.heapIndex = nodeAHeapIndex;
  }

  removeTop(): BoxObject {
    const firstItem = this.nodes[0];
    this.length--;
    this.nodes[0] = this.nodes[this.length];
    this.nodes[0].heapIndex = 0;
    this.sortDown(this.nodes[0]);
    return firstItem;
  }

  includes(node: BoxObject) {
    return this.nodes[node.heapIndex] === node;
  }

  sortDown(node: BoxObject) {
    while (node.heapIndex < this.length) {
      const childIndexLeft = node.heapIndex * 2 + 1;
      const childIndexRight = node.heapIndex * 2 + 2;
      const childRight = this.nodes[childIndexRight];
      const childLeft = this.nodes[childIndexLeft];

      let smallestFCostNode;
      //check if there's at least one left child
      if (childIndexLeft < this.length) {
        smallestFCostNode = childLeft;
        //check if there's a right child, and the smallest of the two children
        if (
          childIndexRight < this.length &&
          childRight.fCost() < childLeft.fCost()
        ) {
          smallestFCostNode = childRight;
        }

        if (smallestFCostNode.fCost() < node.fCost()) {
          this.swapNodes(smallestFCostNode, node);
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }
}

//Maybe put it in app.tsx
const getNeighboringNodes = (
  node: BoxObject,
  nodes: BoxObject[][]
): Array<BoxObject> => {
  const neighboringNodes = new Array<BoxObject>();

  for (let i = node.x - 1; i <= node.x + 1; i++) {
    if (i < nodes.length && i >= 0)
      for (let y = node.y - 1; y <= node.y + 1; y++) {
        if (y < nodes[i].length && y >= 0 && node !== nodes[i][y])
          neighboringNodes.push(nodes[i][y]);
      }
  }
  return neighboringNodes;
};

const renderPath = (currentNode: BoxObject | undefined) => {
  while (currentNode) {
    currentNode.isPath = true;
    currentNode = currentNode.parent;
  }
};

const getDistanceBetweenNodes = (nodeA: BoxObject, nodeB: BoxObject) => {
  const distX = Math.abs(nodeA.x - nodeB.x);
  const distY = Math.abs(nodeA.y - nodeB.y);

  if (distX > distY) {
    return distY * 14 + 10 * (distX - distY);
  } else {
    return distX * 14 + 10 * (distY - distX);
  }
};

export const pathFinderHeapOptimized = (
  boxes: BoxObject[][],
  startNodeIndex: [number, number],
  endNodeIndex: [number, number],
  updateGrid: (boxes: BoxObject[][]) => void
): void => {
  console.log("I am in PathFinder");

  const startNode = boxes[startNodeIndex[0]][startNodeIndex[1]];
  const endNode = boxes[endNodeIndex[0]][endNodeIndex[1]];

  //Set of nodes to be evaluated
  const openSet = new Heap(boxes.length);

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
        if (newNeighborGCost < neighbor.gCost || !openSet.includes(neighbor)) {
          neighbor.gCost = newNeighborGCost;
          neighbor.hCost = getDistanceBetweenNodes(endNode, neighbor);
          neighbor.parent = currentNode;
          if (!openSet.includes(neighbor)) {
            openSet.addToTop(neighbor);
          } else {
            openSet.sortUp(neighbor);
          }
        }
      }
    });
  }
};
