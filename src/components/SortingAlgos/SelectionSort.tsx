import { BoxObject } from "../Box";
export const selectionSort = (
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void
): void => {
  console.log("selectionSort");
  //Orders from front of the array
  for (let lh = 0; lh < boxArray.length; lh++) {
    //right hand index takes value of current by default,
    //Only reassigned if a lower min than current is found
    let rh = lh;

    //Finding the min in the elements to the right while looping over unsorted part of the array (heap sort improves on that point)
    for (let i = lh + 1; i < boxArray.length; i++) {
      if (boxArray[i].number < boxArray[rh].number) {
        rh = i;
      }
    }

    //the min takes the place of the current element and current elements takes the place of min
    const temp = boxArray[lh];
    boxArray[lh] = boxArray[rh];
    boxArray[rh] = temp;
  }
  setBoxArray(boxArray);
};
