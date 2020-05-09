import { BoxObject } from "../Box";
export const LinearSearch = (
  x: number,
  boxArray: BoxObject[],
  setBoxArray: (boxArray: BoxObject[]) => void,
  setOpenDialog: (bool: boolean) => void
): void => {
  console.log("LinearSearch");
  let foundOne = false;
  boxArray.forEach((box) => {
    if (box.number === x) {
      box.found = true;
      foundOne = true;
      setBoxArray(boxArray);
    }
  });
  if (!foundOne) setOpenDialog(true);
};
