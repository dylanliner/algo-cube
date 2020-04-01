import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";

function App() {
  const size = 10;

  const [boxes, setBoxes] = useState([{ position: [0, 0, 0] }]);

  const cameraCenter = size / 2 - 1;

  interface BoxObject {
    position: number[];
  }

  function createGrid() {
    const boxArray = [];
    for (let i = 0; i < size; i++) {
      for (let y = 0; y < size; y++) {
        boxArray.push({ position: [i, y, 0] });
      }
    }
    setBoxes(boxArray);
  }

  useEffect(() => {
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
      {boxes.map((box: BoxObject, index: number) => (
        <Box key={index.toString()} position={box.position} />
      ))}
      <CustomCamera />
    </Canvas>
  );
}

export default App;
