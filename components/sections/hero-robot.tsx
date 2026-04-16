"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

type HeroRobotProps = {
  className?: string
}

const BLINK_MIN_MS = 1600
const BLINK_MAX_MS = 4200
const MOUTH_FRAME_MS = 120

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function HeroRobot({ className }: HeroRobotProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.2, 6)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.9)
    const key = new THREE.DirectionalLight(0xdff3ff, 1.2)
    key.position.set(3, 2, 4)
    const rim = new THREE.DirectionalLight(0x88d3ff, 0.6)
    rim.position.set(-3, 1, -2)
    scene.add(ambient, key, rim)

    const loader = new GLTFLoader()

    let robot: THREE.Object3D | null = null
    const eyes: Array<{
      node: THREE.Object3D
      basePosition: THREE.Vector3
      baseScale: THREE.Vector3
    }> = []
    const mouths: THREE.Object3D[] = []

    let currentMouthIndex = 0
    let lastMouthFrameAt = 0

    let blinkStartedAt = 0
    let blinkDuration = 180
    let nextBlinkAt =
      performance.now() + randomBetween(BLINK_MIN_MS, BLINK_MAX_MS)

    const lookTarget = new THREE.Vector2(0, 0)
    const lookCurrent = new THREE.Vector2(0, 0)

    loader.load(
      "/P.R.O.T.O.glb",
      (gltf) => {
        robot = gltf.scene
        robot.scale.setScalar(1)

        robot.traverse((child) => {
          const mesh = child as THREE.Mesh
          if (mesh.isMesh) {
            mesh.castShadow = false
            mesh.receiveShadow = false
          }

          const lowerName = child.name.toLowerCase()
          if (lowerName === "eye_l" || lowerName === "eye_r") {
            eyes.push({
              node: child,
              basePosition: child.position.clone(),
              baseScale: child.scale.clone(),
            })
          }

          const mouthFrameMatch = lowerName.match(/^mouth\.(\d+)$/)
          if (mouthFrameMatch) {
            const frame = Number(mouthFrameMatch[1])
            if (frame >= 1 && frame <= 8) {
              mouths.push(child)
            }
          }

          if (mouths.length === 0 && lowerName.startsWith("mouth")) {
            mouths.push(child)
          }
        })

        mouths.sort((a, b) => {
          const getIndex = (name: string) => {
            const match = name.match(/\.(\d+)$/)
            return match ? Number(match[1]) : 0
          }

          return getIndex(a.name) - getIndex(b.name)
        })

        mouths.forEach((mouth, index) => {
          mouth.visible = index === 0
        })

        // Center and fit the imported model regardless of original Blender transforms.
        const box = new THREE.Box3().setFromObject(robot)
        if (!box.isEmpty()) {
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)

          robot.position.sub(center)

          const fov = THREE.MathUtils.degToRad(camera.fov)
          const fitDistance = (maxDim * 0.5) / Math.tan(fov * 0.5)

          camera.position.set(0, size.y * 0.06, fitDistance * 1.45)
          camera.near = Math.max(0.01, fitDistance / 100)
          camera.far = fitDistance * 100
          camera.lookAt(0, 0, 0)
          camera.updateProjectionMatrix()
        }

        // Front-face alignment for this specific robot asset.
        robot.rotation.y = -Math.PI / 2

        scene.add(robot)
      },
      undefined,
      (error) => {
        console.error("Failed to load /P.R.O.T.O.glb", error)
      }
    )

    const handleMouseMove = (event: MouseEvent) => {
      lookTarget.x = (event.clientX / window.innerWidth) * 2 - 1
      lookTarget.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener("mousemove", handleMouseMove)

    const updateSize = () => {
      const { clientWidth, clientHeight } = mount
      if (clientWidth === 0 || clientHeight === 0) return

      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight, false)
    }

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(mount)
    updateSize()

    let frameId = 0

    const animate = (time: number) => {
      frameId = window.requestAnimationFrame(animate)

      lookCurrent.lerp(lookTarget, 0.08)

      for (const eye of eyes) {
        eye.node.position.x = eye.basePosition.x + lookCurrent.x * 0.055
        eye.node.position.y = eye.basePosition.y + lookCurrent.y * 0.035
      }

      if (time >= nextBlinkAt) {
        blinkStartedAt = time
        blinkDuration = randomBetween(150, 220)
        nextBlinkAt = time + randomBetween(BLINK_MIN_MS, BLINK_MAX_MS)
      }

      if (blinkStartedAt > 0) {
        const progress = (time - blinkStartedAt) / blinkDuration

        if (progress >= 1) {
          blinkStartedAt = 0
          for (const eye of eyes) {
            eye.node.scale.y = eye.baseScale.y
          }
        } else {
          const openness = Math.abs(Math.cos(progress * Math.PI))
          const blinkScale = 0.12 + openness * 0.88

          for (const eye of eyes) {
            eye.node.scale.y = eye.baseScale.y * blinkScale
          }
        }
      }

      if (mouths.length > 0 && time - lastMouthFrameAt > MOUTH_FRAME_MS) {
        lastMouthFrameAt = time
        currentMouthIndex = (currentMouthIndex + 1) % mouths.length

        mouths.forEach((mouth, index) => {
          mouth.visible = index === currentMouthIndex
        })
      }

      renderer.render(scene, camera)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frameId)

      scene.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return

        mesh.geometry.dispose()

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose())
        } else {
          mesh.material.dispose()
        }
      })

      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className={className ?? "relative h-55 w-full max-w-105"}
      ref={mountRef}
    />
  )
}
