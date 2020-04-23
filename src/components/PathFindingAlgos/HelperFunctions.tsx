import { BoxObject } from "../Box";
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

export const getNeighboringNodesDiagonalLast = (
  node: BoxObject,
  nodes: BoxObject[][]
): Array<BoxObject> => {
  const neighboringNodes = new Array<BoxObject>();

  //North
  if (node.y < nodes[0].length - 1)
    neighboringNodes.push(nodes[node.x][node.y + 1]);

  //South
  if (node.y > 0) neighboringNodes.push(nodes[node.x][node.y - 1]);

  //East
  if (node.x > 0) neighboringNodes.push(nodes[node.x - 1][node.y]);

  //West
  if (node.x < nodes.length - 1)
    neighboringNodes.push(nodes[node.x + 1][node.y]);

  //North-East
  if (node.y < nodes[0].length - 1 && node.x > 0)
    neighboringNodes.push(nodes[node.x - 1][node.y + 1]);

  //North-West
  if (node.y < nodes[0].length - 1 && node.x < nodes.length - 1)
    neighboringNodes.push(nodes[node.x + 1][node.y + 1]);

  //South-East
  if (node.y > 0 && node.x > 0)
    neighboringNodes.push(nodes[node.x - 1][node.y - 1]);

  //South-West
  if (node.y > 0 && node.x < nodes.length - 1)
    neighboringNodes.push(nodes[node.x + 1][node.y - 1]);

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
