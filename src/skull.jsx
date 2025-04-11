import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSkullControls } from "./modelControls";

const SkullModel = ({ matrix, faceWidth, faceHeight, isResizing }) => {
  const { scene, materials } = useGLTF("nospaceright.glb");
  const { scaleX, scaleY, scaleZ, offsetX, offsetY, offsetZ, opacity } =
    useSkullControls();
  const modelRef = useRef();
  const initialX = 13.5;
  const initialY = 13.5;
  const initialZ = 13.5;

  // 新增 X 和 Y 变量，初始值设为 0
  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [S, setS] = useState(1);

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event) => {
      let newX = X;
      let newY = Y;
      let newZ = Z;
      let newS = S;

      switch (event.key) {
        case "ArrowUp":
          newY += 0.1;
          break;
        case "ArrowDown":
          newY -= 0.1;
          break;
        case "ArrowLeft":
          newX -= 0.1;
          break;
        case "ArrowRight":
          newX += 0.1;
          break;
        case "F":
          newZ += 0.1;
          break;
        case "f":
          newZ += 0.1;
          break;
        case "B":
          newZ -= 0.1;
          break;
        case "b":
          newZ -= 0.1;
          break;
        case "L":
          newS += 0.03;
          break;
        case "l":
          newS += 0.03;
          break;
        case "S":
          newS -= 0.03;
          break;
        case "s":
          newS -= 0.03;
          break;
        default:
          return;
      }

      setX(newX);
      setY(newY);
      setZ(newZ);
      setS(newS);
      console.log("X:", newX, "Y:", newY, "Z:", newZ, "S:", newS);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [X, Y, Z, S]);

  useEffect(() => {
    if (matrix) {
      let baseScaleX = faceWidth ? faceWidth / 28 : initialX;
      let baseScaleY = faceHeight ? faceHeight / 40 : initialY;
      let baseScaleZ = initialZ;

      // Apply manual scaling on top of the base scale
      const finalScaleX = baseScaleX * scaleX * S;
      const finalScaleY = baseScaleY * scaleY * S;
      const finalScaleZ = baseScaleZ * scaleZ * S;
      const m = matrix
        .clone()
        .scale(new THREE.Vector3(finalScaleX, finalScaleY, finalScaleZ));
      m.setPosition(
        m.elements[12] + offsetX + X,
        m.elements[13] + offsetY + Y,
        m.elements[14] + offsetZ + Z,
      );
      scene.matrixAutoUpdate = false;
      scene.matrix.copy(m);
      // console log current scale
    }
  }, [matrix, scaleX, scaleY, scaleZ, offsetX, offsetY, faceWidth, faceHeight]);

  useEffect(() => {
    if (materials) {
      for (const materialName in materials) {
        const material = materials[materialName];
        material.opacity = opacity;
        material.transparent = opacity < 1;
        material.needsUpdate = true;
      }
    }
  }, [materials, opacity]);

  return <primitive object={scene} ref={modelRef} />;
};

export default SkullModel;