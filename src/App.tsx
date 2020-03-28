import React from "react";
import "./App.css";
import { Canvas, useFrame } from "react-three-fiber";
import Box from "./components/Box";

function App() {
  const size = 10;
  const columns = [...Array(size).keys()];
  const rows = [...Array(size).keys()];
  const cameraCenter = size / 2 - 1;
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
      {columns.map((column) =>
        rows.map((row) => (
          <Box key={[column, row]} position={[column, row, 0]} />
        ))
      )}
      <CustomCamera />
    </Canvas>
  );
}

export default App;
