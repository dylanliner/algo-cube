import { BoxObject } from "../Box";
export const LinearSearch = (
  x: number,
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void,
  setOpenDialog: (bool: boolean) => void
): void => {
  console.log("LinearSearch");
  boxArray.forEach((box) => {
    if (box.number === x) {
      box.found = true;
      setBoxArray(boxArray);
      return;
    }
  });
};
