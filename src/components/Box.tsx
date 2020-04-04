import React, { useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";

export interface BoxObject {
  id: string;
  position: [number, number, number];
  isBlocked: boolean;
  updateBlocked: (key: string, isBlocked: boolean) => void;
}

const Box: React.FC<BoxObject> = React.memo((props: BoxObject) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef(new THREE.Mesh());
  console.log("I am a box and rerendering", props.position);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <mesh
      position={props.position}
      ref={mesh}
      scale={[0.5, 0.5, 0.5]}
      onClick={(e) => {
        props.updateBlocked(props.id, !props.isBlocked);
      }}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered || props.isBlocked ? "hotpink" : "orange"}
      />
    </mesh>
  );
});
Box.displayName = "Box";
export default Box;
