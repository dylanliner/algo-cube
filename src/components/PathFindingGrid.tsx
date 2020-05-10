import React, { useState, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./Box";
import { aStarSimpleArray } from "./PathFindingAlgos/AStarSimpleArray";
import { aStarBinaryHeap } from "./PathFindingAlgos/AStarBinaryHeap";
import { dijkstraAlgorithm } from "./PathFindingAlgos/DijkstraAlgorithm";
import { breadthFirstSearch } from "./PathFindingAlgos/BreadthFirstSearch";
import { BoxObject } from "./Box";
import Button from "@material-ui/core/Button";
import update from "immutability-helper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { RunButton } from "./RunButton";
export enum SelectionMode {
  StartNode,
  EndNode,
  BlockedNodes,
  Final,
}

const PathFindingGrid: React.FC = () => {
  const [reload, setReload] = useState(true);
  const [grid, setGrid] = useState({
    selectionMode: SelectionMode.StartNode,
    boxes: [[new BoxObject()]],
  });
  const [endNode, setEndNode] = useState<BoxObject>(new BoxObject());
  const [startNode, setStartNode] = useState<BoxObject>(new BoxObject());
  const [gridSize, setGridSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorText, setErrorText] = useState("");

  const updateGrid = (newBoxes: BoxObject[][]): void => {
    setGrid((grid) => {
      return {
        boxes: update(grid.boxes, { $set: newBoxes }),
        selectionMode: grid.selectionMode,
      };
    });
  };

  const [buttons, setButtons] = useState<RunButton[]>([
    {
      label: "A* (Simple Array)",
      pathFindingAlgo: aStarSimpleArray,
    },
    {
      label: "A* (Binary Heap)",
      pathFindingAlgo: aStarBinaryHeap,
    },
    {
      label: "Breadth First Search",
      pathFindingAlgo: breadthFirstSearch,
    },
    {
      label: "Dijkstra Algorithm",
      pathFindingAlgo: dijkstraAlgorithm,
    },
  ]);

  console.log("I am the grid and am rerendering");
  const cameraCenter = gridSize / 2 - 1;
  const zoom = gridSize - 1;
  const style = {
    height: "100vh",
  };

  //FIXME Runs all the time, needs to change
  function CustomCamera() {
    useFrame((state) => {
      state.camera.position.x = cameraCenter;
      state.camera.position.y = cameraCenter;
      state.camera.position.z = zoom;
      state.camera.updateProjectionMatrix();
    });
    return null;
  }

  useEffect(() => {
    console.log("I am in useEffect");
    const updateBox = (x: number, y: number): void => {
      setGrid((grid) => {
        const prevBox = grid.boxes[x][y];
        console.log("prev props", x, y, prevBox);
        const newBox = Object.assign({}, prevBox);
        console.log("prev selectionMode", grid.selectionMode);
        let newSelectionMode = grid.selectionMode;
        switch (grid.selectionMode) {
          case SelectionMode.StartNode:
            if (!newBox.isBlocked) {
              newSelectionMode = SelectionMode.EndNode;
              newBox.isStartNode = true;
              setStartNode(newBox);
            }
            break;
          case SelectionMode.EndNode:
            if (!newBox.isStartNode && !newBox.isBlocked) {
              newSelectionMode = SelectionMode.Final;
              newBox.isEndNode = true;
              setEndNode(newBox);
            }
            break;
          case SelectionMode.Final:
            console.log("reloading");
            setReload(!reload);
            break;
          case SelectionMode.BlockedNodes:
            newBox.isBlocked = !prevBox.isBlocked;
            break;
        }
        console.log("new props", x, y, newBox);
        console.log("new selectionMode", grid.selectionMode);
        return {
          boxes: update(grid.boxes, { [x]: { [y]: { $set: newBox } } }),
          selectionMode: newSelectionMode,
        };
      });
    };
    function createGrid() {
      console.log("I am in create Grid");
      const boxArray: BoxObject[][] = [];
      for (let i = 0; i < gridSize; i++) {
        boxArray.push([]);
        for (let y = 0; y < gridSize; y++) {
          const box = new BoxObject();
          box.x = i;
          box.y = y;
          box.updateBox = updateBox;
          boxArray[i][y] = box;
        }
      }
      console.log(boxArray);
      setGrid({ boxes: boxArray, selectionMode: SelectionMode.StartNode });
    }
    createGrid();
  }, [gridSize, reload]);

  const handleChange = (): void => {
    let newSelectionMode;
    setGrid((grid) => {
      if (grid.selectionMode === SelectionMode.BlockedNodes) {
        if (grid.boxes.some((row) => row.some((box) => box.isEndNode))) {
          newSelectionMode = SelectionMode.Final;
        } else if (
          grid.boxes.some((row) => row.some((box) => box.isStartNode))
        ) {
          newSelectionMode = SelectionMode.EndNode;
        } else {
          newSelectionMode = SelectionMode.StartNode;
        }
      } else {
        newSelectionMode = SelectionMode.BlockedNodes;
      }
      return { boxes: grid.boxes, selectionMode: newSelectionMode };
    });
  };

  const cleanUpGrid = (): void => {
    grid.boxes.forEach((column) =>
      column.forEach((box) => {
        box.heapIndex = -1;
        box.isPath = false;
        box.gCost = 0;
        box.hCost = 0;
        box.parent = undefined;
      })
    );
  };

  const updateExecutionTime = (t1: number, t0: number, index: number): void => {
    const executionTime = "executed in " + (t1 - t0).toFixed(2) + " ms";
    setButtons(
      update(buttons, { [index]: { executionTime: { $set: executionTime } } })
    );
  };

  return (
    <>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={4}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={3}
          >
            <Grid item>
              <TextField
                label="Grid size"
                defaultValue={10}
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
              <Button onClick={handleChange} variant="contained">
                {grid.selectionMode === SelectionMode.BlockedNodes
                  ? "Click here when you are done"
                  : "Click here to select block nodes"}
              </Button>
            </Grid>
            {buttons.map((runButton: RunButton, index: number) => (
              <Grid item key={index.toString()}>
                <Button
                  onClick={() => {
                    cleanUpGrid();
                    const t0 = performance.now();
                    if (runButton.pathFindingAlgo)
                      runButton.pathFindingAlgo(
                        grid.boxes,
                        startNode,
                        endNode,
                        updateGrid,
                        setOpenDialog
                      );
                    const t1 = performance.now();
                    updateExecutionTime(t1, t0, index);
                  }}
                  variant="contained"
                  disabled={grid.selectionMode !== SelectionMode.Final}
                >
                  {runButton.label}
                </Button>
                <br />
                {runButton.executionTime}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Canvas style={style}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {grid.boxes.map((rows: BoxObject[], index: number) =>
              rows.map((boxProps: BoxObject, index: number) => (
                <Box key={index.toString()} {...boxProps} />
              ))
            )}
            <CustomCamera />
          </Canvas>
        </Grid>
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

export default PathFindingGrid;
