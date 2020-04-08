import React, { useState, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";
import { BoxObject } from "./components/Box";
import update from "immutability-helper";
import Button from "@material-ui/core/Button";

enum SelectionMode {
  StartNode,
  EndNode,
  BlockedNodes,
  Final,
}

const App: React.FC = () => {
  const size = 10;

  const [reload, setReload] = useState(true);
  const [grid, setGrid] = useState({
    selectionMode: SelectionMode.StartNode,
    boxes: [
      {
        index: 0,
        position: [0, 0, 0] as [number, number, number],
        isBlocked: false,
        isStartNode: false,
        isEndNode: false,
        updateBox: (index: number) => {
          console.log("stuff");
        },
      },
    ],
  });
  console.log("I am the grid and am rerendering");

  const cameraCenter = size / 2 - 1;

  useEffect(() => {
    console.log("I am in useEffect");
    const updateBox = (index: number): void => {
      setGrid((grid) => {
        const prevBox = grid.boxes[index];
        const newBox = Object.assign({}, prevBox);
        let newSelectionMode = grid.selectionMode;
        console.log(grid.selectionMode);
        switch (grid.selectionMode) {
          case SelectionMode.StartNode:
            if (!newBox.isBlocked) {
              newBox.isStartNode = true;
              newSelectionMode = SelectionMode.EndNode;
            }
            break;
          case SelectionMode.EndNode:
            if (!newBox.isStartNode && !newBox.isBlocked) {
              newBox.isEndNode = true;
              newSelectionMode = SelectionMode.Final;
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
        console.log("new props", index, newBox);
        return {
          selectionMode: newSelectionMode,
          boxes: update(grid.boxes, { [index]: { $set: newBox } }),
        };
      });
    };
    function createGrid() {
      console.log("I am in create Grid");
      const boxArray = [];
      for (let i = 0; i < size; i++) {
        for (let y = 0; y < size; y++) {
          boxArray.push({
            index: 0,
            position: [i, y, 0] as [number, number, number],
            isBlocked: false,
            isStartNode: false,
            isEndNode: false,
            updateBox: updateBox,
          });
        }
      }
      setGrid({
        selectionMode: SelectionMode.StartNode,
        boxes: boxArray,
      });
    }
    createGrid();
  }, [reload]);

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

  const handleChange = (): void => {
    setGrid((grid) => {
      let newGridSelectionMode;
      if (grid.selectionMode === SelectionMode.BlockedNodes) {
        if (grid.boxes.some((box) => box.isEndNode)) {
          newGridSelectionMode = SelectionMode.Final;
        } else if (grid.boxes.some((box) => box.isStartNode)) {
          newGridSelectionMode = SelectionMode.EndNode;
        } else {
          newGridSelectionMode = SelectionMode.StartNode;
        }
      } else {
        newGridSelectionMode = SelectionMode.BlockedNodes;
      }
      return {
        boxes: grid.boxes,
        selectionMode: newGridSelectionMode,
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
      <Canvas style={style}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {grid.boxes.map((boxProps: BoxObject, index: number) => (
          <Box
            key={index.toString()}
            index={index}
            position={boxProps.position}
            updateBox={boxProps.updateBox}
            isBlocked={boxProps.isBlocked}
            isStartNode={boxProps.isStartNode}
            isEndNode={boxProps.isEndNode}
          />
        ))}
        <CustomCamera />
      </Canvas>
    </>
  );
};

export default App;
