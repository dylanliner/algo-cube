import { BoxObject } from "../Box";
//Maybe put it in app.tsx
export const getNeighboringNodes = (
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

export const renderPath = (currentNode: BoxObject | undefined) => {
  while (currentNode) {
    currentNode.isPath = true;
    currentNode = currentNode.parent;
  }
};

export const getDistanceBetweenNodes = (nodeA: BoxObject, nodeB: BoxObject) => {
  const distX = Math.abs(nodeA.x - nodeB.x);
  const distY = Math.abs(nodeA.y - nodeB.y);

  if (distX > distY) {
    return distY * 14 + 10 * (distX - distY);
  } else {
    return distX * 14 + 10 * (distY - distX);
  }
};
