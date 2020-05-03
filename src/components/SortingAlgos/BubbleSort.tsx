import { BoxObject } from "../Box";
export const bubbleSort = (
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void
): void => {
  console.log("Bubblesort");
  let n = boxArray.length - 1;
  while (n >= 1) {
    //we only loop until the second to last index minus j because
    //for jth pass, the jth largest element sinks down towards the end of the array
    //until it reaches its final place
    let newN = 0;
    for (let i = 0; i < n; i++) {
      if (boxArray[i].number > boxArray[i + 1].number) {
        const temp = boxArray[i];
        boxArray[i] = boxArray[i + 1];
        boxArray[i + 1] = temp;
        newN = i;
      }
    }
    n = newN;
  }
  setBoxArray(boxArray);
};
