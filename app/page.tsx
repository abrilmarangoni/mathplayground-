"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function PointillistHand({
  position,
  rotationDirection,
  isLeft,
}: {
  position: [number, number, number]
  rotationDirection: number
  isLeft: boolean
}) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []

    const calculateShading = (x: number, y: number, z: number, normalX = 0, normalY = 0, normalZ = 1) => {
      const lightDir = { x: 0.4, y: 0.6, z: 0.7 }
      const lightMag = Math.sqrt(lightDir.x ** 2 + lightDir.y ** 2 + lightDir.z ** 2)
      const normLightX = lightDir.x / lightMag
      const normLightY = lightDir.y / lightMag
      const normLightZ = lightDir.z / lightMag
      const diffuse = Math.max(0, normalX * normLightX + normalY * normLightY + normalZ * normLightZ)
      const ao = 0.3 + z * 0.35
      const edgeFactor = Math.abs(x) > 1.3 ? 1.2 : 1.0
      const baseLight = 0.25 + diffuse * 0.55 + ao * 0.2
      return Math.min(1, baseLight * edgeFactor)
    }

    const createFingerSegment = (
      startX: number,
      startY: number,
      startZ: number,
      endX: number,
      endY: number,
      endZ: number,
      startRadius: number,
      endRadius: number,
      points: number,
      curvature = 0,
    ) => {
      const dx = endX - startX
      const dy = endY - startY
      const dz = endZ - startZ
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
      for (let i = 0; i < points; i++) {
        const t = Math.random()
        const radiusFactor = Math.pow(1 - t, 0.6)
        const radius = endRadius + (startRadius - endRadius) * radiusFactor
        const layerDepth = Math.pow(Math.random(), 0.4)
        const layerRadius = layerDepth * radius
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radialY = layerRadius * Math.sin(phi) * Math.cos(theta)
        const radialZ = layerRadius * Math.sin(phi) * Math.sin(theta)
        const curveOffset = Math.sin(t * Math.PI) * curvature * t * (1 + Math.random() * 0.2)
        const x = startX + dx * t
        const y = startY + dy * t + radialY
        const z = startZ + dz * t + radialZ + curveOffset
        const normalX = Math.cos(theta) * Math.sin(phi)
        const normalY = Math.sin(theta) * Math.sin(phi)
        const normalZ = Math.cos(phi)
        positions.push(x, y, z)
        const lightIntensity = calculateShading(x, y, z, normalX, normalY, normalZ)
        const depthVariation = 0.15 + layerDepth * 0.25
        const randomVariation = Math.random() * 0.15
        const finalIntensity = Math.min(1, lightIntensity * depthVariation + randomVariation)
        colors.push(finalIntensity, finalIntensity, finalIntensity)
      }
    }

    const createJoint = (x: number, y: number, z: number, radius: number, points: number, flatten = 1) => {
      for (let i = 0; i < points; i++) {
        const index = i + 0.5
        const phi = Math.acos(1 - (2 * index) / points)
        const theta = Math.PI * (1 + Math.sqrt(5)) * index
        const r = Math.pow(Math.random(), 0.35) * radius
        const px = x + r * Math.sin(phi) * Math.cos(theta)
        const py = y + r * Math.sin(phi) * Math.sin(theta) * flatten
        const pz = z + r * Math.cos(phi) * flatten
        positions.push(px, py, pz)
        const normalX = Math.sin(phi) * Math.cos(theta)
        const normalY = Math.sin(phi) * Math.sin(theta) * flatten
        const normalZ = Math.cos(phi) * flatten
        const lightIntensity = calculateShading(px, py, pz, normalX, normalY, normalZ)
        const depthFactor = r / radius
        const finalIntensity = Math.min(1, lightIntensity * (0.6 + depthFactor * 0.25) + Math.random() * 0.15)
        colors.push(finalIntensity, finalIntensity, finalIntensity)
      }
    }

    const createPalm = (mirror: number) => {
      for (let i = 0; i < 12000; i++) {
        const u = Math.random()
        const v = Math.random()
        const palmX = (u - 0.5) * 1.45 - 0.18
        const palmY = (v - 0.5) * 1.05
        const depthFactor = 1 - Math.abs(palmY) * 0.35
        const curvature = Math.sin(v * Math.PI) * 0.1 * (1 + u * 0.3)
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const depthRadius = Math.pow(Math.random(), 0.4) * 0.2 * depthFactor
        const x = palmX * mirror * -1
        const y = palmY + Math.sin(phi) * Math.cos(theta) * depthRadius * 0.75
        const z = Math.sin(phi) * Math.sin(theta) * depthRadius + curvature
        positions.push(x, y, z)
        const normalX = Math.sin(phi) * Math.cos(theta)
        const normalY = Math.sin(phi) * Math.sin(theta) * 0.75
        const normalZ = Math.cos(phi) + curvature * 2
        const lightIntensity = calculateShading(x, y, z, normalX, normalY, normalZ)
        const palmDepth = depthRadius / (0.2 * depthFactor)
        const finalIntensity = Math.min(1, lightIntensity * (0.5 + palmDepth * 0.3) + Math.random() * 0.2)
        colors.push(finalIntensity, finalIntensity, finalIntensity)
      }
    }

    const mirror = isLeft ? -1 : 1

    createPalm(mirror)

    for (let i = 0; i < 3500; i++) {
      const t = Math.random()
      const depth = -0.75 - t * 0.7
      const wristRadius = 0.34 * (1 - t * 0.2)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.pow(Math.random(), 0.4) * wristRadius
      const x = depth * mirror * -1
      const y = r * Math.sin(phi) * Math.cos(theta) * 0.9
      const z = r * Math.sin(phi) * Math.sin(theta) * 0.75
      positions.push(x, y, z)
      const normalX = Math.sin(phi) * Math.cos(theta)
      const normalY = Math.sin(phi) * Math.sin(theta) * 0.9
      const normalZ = Math.cos(phi) * 0.75
      const lightIntensity = calculateShading(x, y, z, normalX, normalY, normalZ)
      const fadeStart = 0.3
      const fadeFactor = t < fadeStart ? 1 : Math.pow(1 - (t - fadeStart) / (1 - fadeStart), 3)
      const baseIntensity = lightIntensity * (0.4 + Math.random() * 0.2) * fadeFactor
      colors.push(baseIntensity, baseIntensity, baseIntensity)
    }

    const thumbBase = { x: -0.36 * mirror * -1, y: 0.54, z: 0.06 }
    const thumbMid = { x: -0.06 * mirror * -1, y: 0.82, z: 0.14 }
    const thumbTip = { x: 0.22 * mirror * -1, y: 1.02, z: 0.18 }

    createJoint(thumbBase.x, thumbBase.y, thumbBase.z, 0.19, 550, 0.88)
    createFingerSegment(
      thumbBase.x,
      thumbBase.y,
      thumbBase.z,
      thumbMid.x,
      thumbMid.y,
      thumbMid.z,
      0.18,
      0.16,
      2200,
      0.025,
    )
    createJoint(thumbMid.x, thumbMid.y, thumbMid.z, 0.165, 500, 0.92)
    createFingerSegment(thumbMid.x, thumbMid.y, thumbMid.z, thumbTip.x, thumbTip.y, thumbTip.z, 0.16, 0.12, 1900, 0.035)
    createJoint(thumbTip.x, thumbTip.y, thumbTip.z, 0.11, 420, 1)

    const indexBase = { x: 0.52 * mirror * -1, y: 0.4, z: 0.025 }
    const indexK1 = { x: 0.98 * mirror * -1, y: 0.35, z: 0.0 }
    const indexK2 = { x: 1.4 * mirror * -1, y: 0.31, z: -0.01 }
    const indexTip = { x: 1.78 * mirror * -1, y: 0.28, z: -0.02 }

    createJoint(indexBase.x, indexBase.y, indexBase.z, 0.17, 580)
    createFingerSegment(
      indexBase.x,
      indexBase.y,
      indexBase.z,
      indexK1.x,
      indexK1.y,
      indexK1.z,
      0.155,
      0.145,
      2400,
      -0.012,
    )
    createJoint(indexK1.x, indexK1.y, indexK1.z, 0.15, 480)
    createFingerSegment(indexK1.x, indexK1.y, indexK1.z, indexK2.x, indexK2.y, indexK2.z, 0.14, 0.125, 2200, -0.012)
    createJoint(indexK2.x, indexK2.y, indexK2.z, 0.13, 420)
    createFingerSegment(indexK2.x, indexK2.y, indexK2.z, indexTip.x, indexTip.y, indexTip.z, 0.12, 0.095, 2000, -0.012)
    createJoint(indexTip.x, indexTip.y, indexTip.z, 0.09, 360)

    const middleBase = { x: 0.52 * mirror * -1, y: 0.14, z: 0.025 }
    const middleK1 = { x: 1.02 * mirror * -1, y: 0.12, z: -0.035 }
    const middleK2 = { x: 1.43 * mirror * -1, y: 0.1, z: -0.12 }
    const middleTip = { x: 1.7 * mirror * -1, y: 0.08, z: -0.23 }

    createJoint(middleBase.x, middleBase.y, middleBase.z, 0.17, 560)
    createFingerSegment(
      middleBase.x,
      middleBase.y,
      middleBase.z,
      middleK1.x,
      middleK1.y,
      middleK1.z,
      0.155,
      0.14,
      2300,
      -0.025,
    )
    createJoint(middleK1.x, middleK1.y, middleK1.z, 0.145, 460)
    createFingerSegment(
      middleK1.x,
      middleK1.y,
      middleK1.z,
      middleK2.x,
      middleK2.y,
      middleK2.z,
      0.135,
      0.12,
      2100,
      -0.035,
    )
    createJoint(middleK2.x, middleK2.y, middleK2.z, 0.125, 400)
    createFingerSegment(
      middleK2.x,
      middleK2.y,
      middleK2.z,
      middleTip.x,
      middleTip.y,
      middleTip.z,
      0.115,
      0.09,
      1800,
      -0.045,
    )
    createJoint(middleTip.x, middleTip.y, middleTip.z, 0.085, 340)

    const ringBase = { x: 0.5 * mirror * -1, y: -0.14, z: 0.025 }
    const ringK1 = { x: 0.95 * mirror * -1, y: -0.16, z: -0.07 }
    const ringK2 = { x: 1.29 * mirror * -1, y: -0.18, z: -0.2 }
    const ringTip = { x: 1.5 * mirror * -1, y: -0.2, z: -0.38 }

    createJoint(ringBase.x, ringBase.y, ringBase.z, 0.16, 520)
    createFingerSegment(ringBase.x, ringBase.y, ringBase.z, ringK1.x, ringK1.y, ringK1.z, 0.145, 0.13, 2100, -0.035)
    createJoint(ringK1.x, ringK1.y, ringK1.z, 0.135, 440)
    createFingerSegment(ringK1.x, ringK1.y, ringK1.z, ringK2.x, ringK2.y, ringK2.z, 0.125, 0.11, 1900, -0.055)
    createJoint(ringK2.x, ringK2.y, ringK2.z, 0.115, 380)
    createFingerSegment(ringK2.x, ringK2.y, ringK2.z, ringTip.x, ringTip.y, ringTip.z, 0.105, 0.08, 1600, -0.07)
    createJoint(ringTip.x, ringTip.y, ringTip.z, 0.075, 320)

    const pinkyBase = { x: 0.46 * mirror * -1, y: -0.38, z: 0.025 }
    const pinkyK1 = { x: 0.81 * mirror * -1, y: -0.41, z: -0.09 }
    const pinkyK2 = { x: 1.07 * mirror * -1, y: -0.44, z: -0.26 }
    const pinkyTip = { x: 1.23 * mirror * -1, y: -0.46, z: -0.45 }

    createJoint(pinkyBase.x, pinkyBase.y, pinkyBase.z, 0.14, 480)
    createFingerSegment(
      pinkyBase.x,
      pinkyBase.y,
      pinkyBase.z,
      pinkyK1.x,
      pinkyK1.y,
      pinkyK1.z,
      0.125,
      0.11,
      1800,
      -0.045,
    )
    createJoint(pinkyK1.x, pinkyK1.y, pinkyK1.z, 0.115, 400)
    createFingerSegment(pinkyK1.x, pinkyK1.y, pinkyK1.z, pinkyK2.x, pinkyK2.y, pinkyK2.z, 0.105, 0.09, 1600, -0.065)
    createJoint(pinkyK2.x, pinkyK2.y, pinkyK2.z, 0.095, 340)
    createFingerSegment(pinkyK2.x, pinkyK2.y, pinkyK2.z, pinkyTip.x, pinkyTip.y, pinkyTip.z, 0.085, 0.065, 1400, -0.085)
    createJoint(pinkyTip.x, pinkyTip.y, pinkyTip.z, 0.065, 300)

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    }
  }, [isLeft])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += rotationDirection * 0.01
    }
  })

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <PointillistHand position={[-1.81, 0, 0]} rotationDirection={1} isLeft={true} />
      <PointillistHand position={[1.81, 0, 0]} rotationDirection={-1} isLeft={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={1} />
    </>
  )
}

export default function Page() {
  return (
    <div className="w-full h-screen bg-black" style={{ margin: 0, padding: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Canvas 
        camera={{ position: [0, 3, 3], fov: 55 }} 
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

