import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./Box";
import { BoxObject } from "./Box";
import Button from "@material-ui/core/Button";
import update from "immutability-helper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { LinearSearch } from "./SearchingAlgos/LinearSearch";
import { JumpSearch } from "./SearchingAlgos/JumpSearch";
import { BinarySearch } from "./SearchingAlgos/BinarySearch";
import { InterpolationSearch } from "./SearchingAlgos/InterpolationSearch";
import { ExponentialSearch } from "./SearchingAlgos/ExponentialSearch";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

interface RunButton {
  label: string;
  searchingAlgo: (
    x: number,
    boxes: BoxObject[],
    setBoxArray: (boxes: BoxObject[]) => void,
    setOpenDialog: (bool: boolean) => void
  ) => void;
  executionTime?: string;
}

const Searching: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [boxArray, setBoxArray] = useState([new BoxObject()]);
  const [prevBoxArray, setPrevBoxArray] = useState<BoxObject[]>([]);
  const [gridSize, setGridSize] = useState(30);
  const [errorText, setErrorText] = useState("");
  const [toSearch, setToSearch] = useState(30);
  const [buttons, setButtons] = useState<RunButton[]>([
    {
      label: "Linear Searh",
      searchingAlgo: LinearSearch,
    },
    {
      label: "Binary Search",
      searchingAlgo: BinarySearch,
    },
    {
      label: "Jump Search",
      searchingAlgo: JumpSearch,
    },
    {
      label: "Interpolation Search",
      searchingAlgo: InterpolationSearch,
    },
    {
      label: "Exponential Search",
      searchingAlgo: ExponentialSearch,
    },
  ]);

  console.log("I am the grid and am rerendering");
  const cameraCenter = gridSize / 2 - 1;
  const style = {
    width: "100vw",
    height: "50vh",
  };

  //FIXME Runs all the time, needs to change
  function CustomCamera() {
    useFrame((state) => {
      state.camera.position.x = cameraCenter;
      state.camera.position.z = 10;
      state.camera.updateProjectionMatrix();
    });
    return null;
  }
  function shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  useEffect(() => {
    console.log("I am in useEffect");

    function createBoxArray() {
      console.log("I am in create Grid");
      const initBoxArray: BoxObject[] = [];
      for (let i = 0; i < gridSize; i++) {
        const box = new BoxObject();
        box.number = i / gridSize;
        initBoxArray.push(box);
      }
      shuffle(initBoxArray);
      setBoxArray(initBoxArray);
      setPrevBoxArray([]);
    }
    createBoxArray();
  }, [gridSize]);

  const updateExecutionTime = (t1: number, t0: number, index: number): void => {
    const executionTime = "executed in " + (t1 - t0).toFixed(2) + " ms";
    setButtons(
      update(buttons, { [index]: { executionTime: { $set: executionTime } } })
    );
  };

  return (
    <>
      <Grid container justify="center" alignItems="center">
        <Grid item>
          <Canvas style={style}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {boxArray.map((boxProps: BoxObject, index: number) => (
              <Box key={index.toString()} {...boxProps} x={index} />
            ))}
            <CustomCamera />
          </Canvas>
        </Grid>
      </Grid>
      <Grid container justify="center" alignItems="center" spacing={3}>
        <Grid item>
          <TextField
            label="Array Length"
            defaultValue={30}
            error={errorText.length === 0 ? false : true}
            helperText={errorText}
            onChange={(e) => {
              const gridSize = Number(e.target.value);
              if (gridSize) {
                setGridSize(Math.floor(gridSize));
                setErrorText("");
              } else {
                setErrorText("Please enter a number");
              }
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Find the box (must be within array)"
            defaultValue={30}
            error={errorText.length === 0 ? false : true}
            helperText={errorText}
            onChange={(e) => {
              const toSearch = Number(e.target.value) / gridSize;
              if (toSearch) {
                setToSearch(toSearch);
                setErrorText("");
              } else {
                setErrorText("Please enter a number");
              }
            }}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              setBoxArray(prevBoxArray);
            }}
            variant="contained"
            color="secondary"
            disabled={prevBoxArray.length === 0}
          >
            Retry
          </Button>
        </Grid>
        {buttons.map((runButton: RunButton, index: number) => (
          <Grid item key={index.toString()}>
            <Button
              onClick={() => {
                setPrevBoxArray([...boxArray]);
                const t0 = performance.now();
                runButton.searchingAlgo(
                  toSearch,
                  boxArray,
                  setBoxArray,
                  setOpenDialog
                );
                const t1 = performance.now();
                updateExecutionTime(t1, t0, index);
              }}
              variant="contained"
            >
              {runButton.label}
            </Button>
            <br />
            {runButton.executionTime}
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Destination unreachable"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Searching;
