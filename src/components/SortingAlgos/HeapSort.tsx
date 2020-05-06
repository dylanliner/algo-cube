import { BoxObject } from "../Box";
import { RectAreaLight } from "three";
export const heapSort = (
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void
): void => {
  console.log("heapSort");
  //Same idea as selection sort, except we first convert the array to a max heap (parent>children)
  //and we then build the sorted array from the end(largest element to smallest)
  //The "unsorted" region is already sorted as max-heap and the largest element will always be at index 0(thanks to maxheap)
  //if we had first converted the array to a min heap we would have been unable to sort in place because the sorted portion(at the beginning)
  //and min-heap would have overlapped(maybe the min-heap would have to be pushed back)

  function heapify(
    boxArray: BoxObject[],
    sizeOfHeap: number,
    currentIndex: number
  ): void {
    let largest = currentIndex;
    const leftChild = currentIndex * 2 + 1;
    const rightChild = currentIndex * 2 + 2;

    if (
      leftChild < sizeOfHeap &&
      boxArray[leftChild].number > boxArray[largest].number
    ) {
      largest = leftChild;
    }
    if (
      rightChild < sizeOfHeap &&
      boxArray[rightChild].number > boxArray[largest].number
    ) {
      largest = rightChild;
    }

    if (largest != currentIndex) {
      //swap
      const temp = boxArray[currentIndex];
      boxArray[currentIndex] = boxArray[largest];
      boxArray[largest] = temp;
      heapify(boxArray, sizeOfHeap, largest);
    }
  }

  const n = boxArray.length;
  //max-heapify array
  //we start from n/2 -1 because that's the parent of the last children (at index i=2*i+1 and i=2*i+2)
  for (let i = n / 2 - 1; i >= 0; i--) {
    heapify(boxArray, n, i);
  }

  //we start building the sorted region at the end of the array
  //we start at i = n-1 because the last element is at index n-1
  //i>0 because we don't need to loop when heap size =0
  for (let i = n - 1; i > 0; i--) {
    //we swap first element (largest) with current index
    const temp = boxArray[i];
    boxArray[i] = boxArray[0];
    boxArray[0] = temp;

    //the first element is no longer the largest, the new largest needs to be put at index 0
    //also, the size of the heap is reduced by one every time
    heapify(boxArray, i, 0);
  }
  setBoxArray(boxArray);
};
