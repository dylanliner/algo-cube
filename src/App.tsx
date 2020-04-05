import React, { useState, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";
import { BoxObject } from "./components/Box";
import update from "immutability-helper";

const App: React.FC = () => {
  const size = 10;

  console.log("I am the grid and am rerendering");
  const [boxes, setBoxes] = useState([
    {
      index: 0,
      position: [0, 0, 0] as [number, number, number],
      isBlocked: false,
      updateBlocked: (index: number, isBlocked: boolean) => {
        console.log("stuff");
      },
    },
  ]);

  const cameraCenter = size / 2;

  useEffect(() => {
    console.log("I am in useEffect");
    const updateBlocked = (index: number, isBlocked: boolean): void => {
      console.log(index + " is blocked " + isBlocked);

      setBoxes((boxes) =>
        update(boxes, { [index]: { isBlocked: { $set: isBlocked } } })
      );
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
            updateBlocked: updateBlocked,
          });
        }
      }
      setBoxes(boxArray);
    }
    createGrid();
  }, []);

  const style = {
    width: "100vw",
    height: "100vh",
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

  return (
    <Canvas style={style}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {boxes.map((boxProps: BoxObject, index: number) => (
        <Box
          key={index.toString()}
          index={index}
          position={boxProps.position}
          updateBlocked={boxProps.updateBlocked}
          isBlocked={boxProps.isBlocked}
        />
      ))}
      <CustomCamera />
    </Canvas>
  );
};

export default App;
