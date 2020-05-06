import { BoxObject } from "../Box";
export const bubbleSort = (
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void
): void => {
  console.log("Bubblesort");
  //orders starting from the back of the array
  let n = boxArray.length - 1;
  while (n >= 1) {
    //this keeps track the index of that last swapped element
    let newN = 0;
    //we loop until the nth element (where we did our last swap)
    for (let i = 0; i < n; i++) {
      if (boxArray[i].number > boxArray[i + 1].number) {
        // we swap the current element with the next one
        //This means the largest element will always "bubble up" to its final position after looping n times
        const temp = boxArray[i];
        boxArray[i] = boxArray[i + 1];
        boxArray[i + 1] = temp;
        //after each swap we reassign newN so it keeps track of the index of that last swapped element
        newN = i;
      }
    }
    //if n is not reassigned, it means the array is sorted
    n = newN;
  }
  setBoxArray(boxArray);
};
