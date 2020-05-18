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
import { quickSort } from "./SortingAlgos/QuickSort";
import { RunButton } from "./RunButton";
const Searching: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [boxArray, setBoxArray] = useState([new BoxObject()]);
  const [gridSize, setGridSize] = useState(30);
  const [errorText, setErrorText] = useState("");
  const [toSearch, setToSearch] = useState(15);
  const [isFound, setIsFound] = useState(false);
  const [buttons, setButtons] = useState<RunButton[]>([
    {
      label: "Linear Searh",
      searchingAlgo: LinearSearch,
    },
    {
      label: "Binary Search",
      searchingAlgo: BinarySearch,
      disabled: true,
    },
    {
      label: "Jump Search",
      searchingAlgo: JumpSearch,
      disabled: true,
    },
    {
      label: "Interpolation Search",
      searchingAlgo: InterpolationSearch,
      disabled: true,
    },
    {
      label: "Exponential Search",
      searchingAlgo: ExponentialSearch,
      disabled: true,
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

  useEffect(() => {
    console.log("I am in useEffect");

    function createBoxArray() {
      console.log("I am in create Grid");
      const initBoxArray: BoxObject[] = [];
      for (let i = 0; i < gridSize; i++) {
        const box = new BoxObject();
        box.number = Math.floor(Math.random() * gridSize) / gridSize;
        initBoxArray.push(box);
      }
      quickSort(initBoxArray, setBoxArray);
    }
    createBoxArray();
  }, [gridSize]);

  const updateExecutionTime = (t1: number, t0: number, index: number): void => {
    const executionTime = "executed in " + (t1 - t0).toFixed(2) + " ms";
    setButtons(
      update(buttons, { [index]: { executionTime: { $set: executionTime } } })
    );
  };
  const reset = () => {
    boxArray.forEach((box) => (box.found = false));
    setBoxArray([...boxArray]);
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
            defaultValue={15}
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
            onClick={() => reset()}
            variant="contained"
            color="secondary"
            disabled={!isFound}
          >
            Retry
          </Button>
        </Grid>
        {buttons.map((runButton: RunButton, index: number) => (
          <Grid item key={index.toString()}>
            <Button
              onClick={() => {
                const t0 = performance.now();
                if (runButton.searchingAlgo)
                  runButton.searchingAlgo(
                    toSearch,
                    boxArray,
                    setBoxArray,
                    setOpenDialog
                  );
                setIsFound(true);
                const t1 = performance.now();
                updateExecutionTime(t1, t0, index);
              }}
              variant="contained"
              disabled={runButton.disabled}
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
        <DialogTitle id="alert-dialog-title">{"Element not found"}</DialogTitle>
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
