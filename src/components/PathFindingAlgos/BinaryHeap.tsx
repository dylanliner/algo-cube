import { BoxObject } from "../Box";
export class BinaryHeap {
  nodes: BoxObject[];

  length: number;

  constructor(heapSize: number) {
    this.nodes = new Array(heapSize);
    this.length = 0;
  }

  addToTop(node: BoxObject): void {
    node.heapIndex = this.length;
    this.nodes[this.length] = node;
    this.sortUp(node);
    this.length++;
  }

  sortUp(node: BoxObject): void {
    let currentNode = node;
    while (currentNode.heapIndex > 0) {
      const parentIndex = Math.floor((currentNode.heapIndex - 1) / 2);
      const parentNode = this.nodes[parentIndex];
      if (parentNode.fCost() <= node.fCost()) break;

      this.swapNodes(parentNode, node);
      currentNode = this.nodes[parentIndex];
    }
  }

  swapNodes(nodeA: BoxObject, nodeB: BoxObject): void {
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

  sortDown(node: BoxObject): void {
    while (node.heapIndex < this.length) {
      const childIndexLeft = node.heapIndex * 2 + 1;
      const childIndexRight = childIndexLeft + 1;
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
          return;
        }
      } else {
        return;
      }
    }
  }
}
