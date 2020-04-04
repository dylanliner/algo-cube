import React, { useState, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";
import { BoxObject } from "./components/Box";

const App: React.FC = () => {
  const size = 10;
  const updateBlocked = (id: string, isBlocked: boolean): void => {
    console.log(id + " is blocked " + isBlocked);
  };
  console.log("I am the grid and am rerendering");
  const [boxes, setBoxes] = useState([
    {
      id: "",
      position: [0, 0, 0] as [number, number, number],
      isBlocked: false,
      updateBlocked: updateBlocked,
    },
  ]);

  const cameraCenter = size / 2 ;

  useEffect(() => {
    function createGrid() {
      const boxArray = [];
      for (let i = 0; i < size; i++) {
        for (let y = 0; y < size; y++) {
          boxArray.push({
            id: "",
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
          id={index.toString()}
          position={boxProps.position}
          updateBlocked={updateBlocked}
          isBlocked={boxProps.isBlocked}
        />
      ))}
      <CustomCamera />
    </Canvas>
  );
};

export default App;
