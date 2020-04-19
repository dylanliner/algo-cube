import React, { useState, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";
import { pathFinder } from "./components/PathFinder";
import { pathFinderHeapOptimized } from "./components/PathFinderHeapOptimized";
import { BoxObject } from "./components/Box";
import Button from "@material-ui/core/Button";
import update from "immutability-helper";
import TextField from "@material-ui/core/TextField";

export enum SelectionMode {
  StartNode,
  EndNode,
  BlockedNodes,
  Final,
}

const App: React.FC = () => {
  const [reload, setReload] = useState(true);
  const [grid, setGrid] = useState({
    selectionMode: SelectionMode.StartNode,
    boxes: [[new BoxObject()]],
  });
  const [endNode, setEndNode] = useState([0, 0] as [number, number]);
  const [startNode, setStartNode] = useState([0, 0] as [number, number]);
  const [gridSize, setGridSize] = useState(10);
  const [errorText, setErrorText] = useState("");

  console.log("I am the grid and am rerendering");
  const cameraCenter = gridSize / 2 - 1;
  const zoom = gridSize - 1;
  const style = {
    width: "90vw",
    height: "90vh",
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
              setStartNode([x, y]);
              newSelectionMode = SelectionMode.EndNode;
              newBox.isStartNode = true;
            }
            break;
          case SelectionMode.EndNode:
            if (!newBox.isStartNode && !newBox.isBlocked) {
              setEndNode([x, y]);
              newSelectionMode = SelectionMode.Final;
              newBox.isEndNode = true;
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

  const updateGrid = (newBoxes: BoxObject[][]): void => {
    setGrid((grid) => {
      return {
        boxes: update(grid.boxes, { $set: newBoxes }),
        selectionMode: grid.selectionMode,
      };
    });
  };

  return (
    <>
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
      <Button onClick={handleChange} variant="contained">
        {grid.selectionMode === SelectionMode.BlockedNodes
          ? "Click here when you are done"
          : "Click here to select block nodes"}
      </Button>
      <Button
        onClick={() => {
          pathFinder(grid.boxes, startNode, endNode, updateGrid);
        }}
        variant="contained"
        disabled={grid.selectionMode !== SelectionMode.Final}
      >
        Find Path
      </Button>
      <Button
        onClick={() => {
          pathFinderHeapOptimized(grid.boxes, startNode, endNode, updateGrid);
        }}
        variant="contained"
        disabled={grid.selectionMode !== SelectionMode.Final}
      >
        Find Path Heap Optimized
      </Button>

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
    </>
  );
};

export default App;
