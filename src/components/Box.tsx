import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

export class BoxObject {
  x: number;
  y: number;
  isBlocked = false;
  isStartNode = false;
  isEndNode = false;
  gCost: number;
  hCost: number;
  updateBox: (x: number, y: number) => void;
  parent: BoxObject | undefined;
  isPath = false;
  number: number;
  heapIndex: number;
  color: string;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.gCost = 0;
    this.hCost = 0;
    this.color = "orange";
    this.number = 0;
    this.updateBox = (x: number, y: number) => {};
    this.heapIndex = -1;
  }

  fCost = (): number => {
    return this.gCost + this.hCost;
  };
}

const Box: React.FC<BoxObject> = React.memo((props: BoxObject) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef(new THREE.Mesh());
  console.log("I am a box and rerendering", props.x, props.y);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [color, setColor] = useState("orange");
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  useEffect(() => {
    const getColor = (): void => {
      let color = "";
      if (props.isBlocked) {
        color = "hotpink";
      } else if (props.isStartNode) {
        color = "blue";
      } else if (props.isEndNode) {
        color = "green";
      } else if (props.isPath || hovered) {
        color = "red";
      } else {
        color = props.color;
      }
      setColor(color);
    };
    getColor();
  }, [
    hovered,
    props.color,
    props.isBlocked,
    props.isEndNode,
    props.isPath,
    props.isStartNode,
  ]);
  return (
    <mesh
      position={[props.x, props.y, 0]}
      ref={mesh}
      scale={[0.5, 0.5, 0.5]}
      onClick={(e) => {
        console.log("clicked on box");
        props.updateBox(props.x, props.y);
      }}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
});
Box.displayName = "Box";
export default Box;
