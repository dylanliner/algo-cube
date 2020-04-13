import React, { useState, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";
import { pathFinder } from "./components/PathFinder";
import { BoxObject } from "./components/Box";
import Button from "@material-ui/core/Button";
import update from "immutability-helper";

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

  console.log("I am the grid and am rerendering");

  const size = 10;
  const cameraCenter = size / 2 - 1;
  const style = {
    width: "90vw",
    height: "90vh",
  };

  function CustomCamera() {
    useFrame((state) => {
      state.camera.position.x = cameraCenter;
      state.camera.position.y = cameraCenter;
      state.camera.position.z = 9;
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
      for (let i = 0; i < size; i++) {
        boxArray.push([]);
        for (let y = 0; y < size; y++) {
          const box = new BoxObject();
          box.position = [i, y, 0] as [number, number, number];
          box.updateBox = updateBox;
          boxArray[i][y] = box;
        }
      }
      console.log(boxArray);
      setGrid({ boxes: boxArray, selectionMode: SelectionMode.StartNode });
    }
    createGrid();
  }, [reload]);

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
