import { BoxObject } from "../Box";
export const insertionSort = (
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void
): void => {
  console.log("insertionSort");
  // Doesn't have a fully sorted portion (kinda orders from front to back)
  for (let i = 0; i < boxArray.length; i++) {
    let j = i;
    //for every element j, we sink it down until the element before it is smaller
    while (j > 0 && boxArray[j - 1].number > boxArray[j].number) {
      // swap element j with the one before it
      const temp = boxArray[j - 1];
      boxArray[j - 1] = boxArray[j];
      boxArray[j] = temp;

      j--;
    }
  }
  setBoxArray(boxArray);
};
