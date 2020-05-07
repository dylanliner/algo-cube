import { BoxObject } from "../Box";
export const mergeSort = (
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void
): void => {
  console.log("mergeSort");
  //We devide the array recursively into two sub arrays and merge them back recursively

  //when we merge back, we always compare the first elements of the two subarrays,
  //We add the lowest one to the new mergedArray and remove it from the array it came from
  function merge(arrayA: BoxObject[], arrayB: BoxObject[]) {
    let mergedArray: BoxObject[] = [];
    while (arrayA.length > 0 && arrayB.length > 0) {
      if (arrayA[0].number < arrayB[0].number) {
        const element = arrayA.shift();
        if (element) mergedArray.push(element);
      } else {
        const element = arrayB.shift();
        if (element) mergedArray.push(element);
      }
    }

    //If there are elements lefts in one of the arrays, they need to be pushed at the end
    //of the new array
    if (arrayA.length > 0) {
      mergedArray = mergedArray.concat(arrayA);
    }

    if (arrayB.length > 0) {
      mergedArray = mergedArray.concat(arrayB);
    }

    return mergedArray;
  }

  function mergeSort(boxArray: BoxObject[]) {
    //We split the array into two arrays recursively until the arrays only contain 1 element
    if (boxArray.length === 1) {
      return boxArray;
    }

    //This part is called only if the the array contains more than 1 element
    let leftArray = boxArray.slice(0, boxArray.length / 2);
    let rightArray = boxArray.slice(boxArray.length / 2, boxArray.length);
    //recursive calls
    leftArray = mergeSort(leftArray);
    rightArray = mergeSort(rightArray);

    return merge(rightArray, leftArray);
  }

  setBoxArray(mergeSort(boxArray));
};
