"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

type HeroRobotProps = {
  className?: string
}

const BLINK_MIN_MS = 1600
const BLINK_MAX_MS = 4200
const BLINK_DOUBLE_CHANCE = 0.14
const AUTO_HEAD_YAW_SPEED = 0.0007
const AUTO_HEAD_PITCH_SPEED = 0.00045
const MOUSE_INFLUENCE_X = 0.85
const MOUSE_INFLUENCE_Y = 0.65
const CLICK_BURST_MS = 850

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
    let head: THREE.Object3D | null = null
    let headBaseRotation: THREE.Euler | null = null
    let headBasePosition: THREE.Vector3 | null = null
    const eyes: Array<{
      node: THREE.Object3D
      baseScale: THREE.Vector3
    }> = []
    const mouths: Array<{
      frame: number
      node: THREE.Object3D
      basePosition: THREE.Vector3
      baseScale: THREE.Vector3
    }> = []

    const blink = {
      startedAt: 0,
      duration: 180,
      minScale: 0.12,
      nextAt: performance.now() + randomBetween(BLINK_MIN_MS, BLINK_MAX_MS),
      secondBlinkAt: 0,
      secondBlinkQueued: false,
    }

    const scheduleNextBlink = (now: number) => {
      blink.nextAt = now + randomBetween(BLINK_MIN_MS, BLINK_MAX_MS)
      blink.secondBlinkQueued = false
      blink.secondBlinkAt = 0
    }

    const startBlink = (now: number, isSecondBlink: boolean) => {
      blink.startedAt = now
      blink.duration = randomBetween(130, 240)

      // Vary closure depth: soft, regular, and occasional full blink.
      const mood = Math.random()
      if (mood < 0.2) {
        blink.minScale = randomBetween(0.02, 0.07)
      } else if (mood < 0.55) {
        blink.minScale = randomBetween(0.1, 0.24)
      } else {
        blink.minScale = randomBetween(0.35, 0.68)
      }

      if (isSecondBlink) {
        scheduleNextBlink(now)
        return
      }

      if (Math.random() < BLINK_DOUBLE_CHANCE) {
        blink.secondBlinkQueued = true
        blink.secondBlinkAt = now + blink.duration + randomBetween(65, 145)
      } else {
        scheduleNextBlink(now)
      }
    }

    const lookTarget = new THREE.Vector2(0, 0)
    const lookCurrent = new THREE.Vector2(0, 0)
    const pointerTarget = new THREE.Vector2(0, 0)

    const interaction = {
      hoverTarget: 0,
      hoverMix: 0,
      clickStartedAt: 0,
    }

    const HEAD_CANDIDATE_NAMES = ["head", "cabeza", "robot_head"]

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

          if (!head) {
            const isHeadCandidate = HEAD_CANDIDATE_NAMES.some((name) =>
              lowerName.includes(name)
            )

            if (isHeadCandidate) {
              head = child
            }
          }

          if (lowerName === "eye_l" || lowerName === "eye_r") {
            eyes.push({
              node: child,
              baseScale: child.scale.clone(),
            })
          }

          const mouthFrameMatch = lowerName.match(/mouth[._-]?0*(\d+)/)
          if (mouthFrameMatch) {
            const frame = Number(mouthFrameMatch[1])
            if (frame >= 1 && frame <= 8) {
              mouths.push({
                frame,
                node: child,
                basePosition: child.position.clone(),
                baseScale: child.scale.clone(),
              })
            }
          }
        })

        mouths.sort((a, b) => a.frame - b.frame)

        mouths.forEach((mouth) => {
          mouth.node.visible = true
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

        // If no dedicated head node exists, rotate the full robot as fallback.
        if (!head) {
          head = robot
        }

        if (head) {
          headBaseRotation = head.rotation.clone()
          headBasePosition = head.position.clone()
        }

        scene.add(robot)
      },
      undefined,
      (error) => {
        console.error("Failed to load /P.R.O.T.O.glb", error)
      }
    )

    const handleMouseMove = (event: MouseEvent) => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      if (viewportWidth === 0 || viewportHeight === 0) return

      pointerTarget.x = THREE.MathUtils.clamp(
        (event.clientX / viewportWidth) * 2 - 1,
        -1,
        1
      )
      pointerTarget.y = THREE.MathUtils.clamp(
        -((event.clientY / viewportHeight) * 2 - 1),
        -1,
        1
      )
    }

    const handlePointerEnter = () => {
      interaction.hoverTarget = 1
    }

    const handlePointerLeave = () => {
      interaction.hoverTarget = 0
    }

    const handleClick = () => {
      const now = performance.now()
      interaction.clickStartedAt = now

      // Click occasionally forces a deeper instant blink for playful feedback.
      startBlink(now, false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    mount.addEventListener("pointerenter", handlePointerEnter)
    mount.addEventListener("pointerleave", handlePointerLeave)
    mount.addEventListener("click", handleClick)

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

      interaction.hoverMix = THREE.MathUtils.lerp(
        interaction.hoverMix,
        interaction.hoverTarget,
        0.12
      )

      let clickProgress = 1
      let clickSpin = 0
      if (interaction.clickStartedAt > 0) {
        clickProgress = THREE.MathUtils.clamp(
          (time - interaction.clickStartedAt) / CLICK_BURST_MS,
          0,
          1
        )

        const clickSpinProgress = 1 - Math.pow(1 - clickProgress, 3)
        clickSpin = clickSpinProgress * Math.PI * 2

        if (clickProgress >= 1) {
          interaction.clickStartedAt = 0
        }
      }

      const clickEnvelope = Math.pow(1 - clickProgress, 2)
      const clickWiggle =
        Math.sin(clickProgress * Math.PI * 6) * clickEnvelope * 0.45
      const hoverJitterX =
        Math.sin(time * 0.0031 + 0.4) * interaction.hoverMix * 0.22
      const hoverJitterY =
        Math.cos(time * 0.0025 + 1.3) * interaction.hoverMix * 0.15

      const autoX = Math.sin(time * AUTO_HEAD_YAW_SPEED)
      const autoY = Math.cos(time * AUTO_HEAD_PITCH_SPEED + 0.9) * 0.65

      lookTarget.x = THREE.MathUtils.clamp(
        autoX +
          pointerTarget.x * MOUSE_INFLUENCE_X +
          hoverJitterX +
          clickWiggle * 0.5,
        -1,
        1
      )
      lookTarget.y = THREE.MathUtils.clamp(
        autoY + pointerTarget.y * MOUSE_INFLUENCE_Y + hoverJitterY,
        -1,
        1
      )

      lookCurrent.lerp(lookTarget, 0.08)

      if (head && headBaseRotation) {
        const yawRange = 0.42 + interaction.hoverMix * 0.12
        const pitchRange = 0.24 + interaction.hoverMix * 0.08
        head.rotation.y =
          headBaseRotation.y + lookCurrent.x * yawRange + clickSpin
        head.rotation.x = headBaseRotation.x + lookCurrent.y * pitchRange
        head.rotation.z =
          headBaseRotation.z +
          clickWiggle * 0.18 +
          Math.sin(time * 0.0045) * interaction.hoverMix * 0.03
      }

      if (head && headBasePosition) {
        const hoverBob =
          Math.sin(time * 0.006 + 0.8) * interaction.hoverMix * 0.03
        const clickBob =
          Math.sin(clickProgress * Math.PI * 2.8) * clickEnvelope * 0.08
        head.position.y = headBasePosition.y + hoverBob + clickBob
      }

      if (blink.startedAt === 0 && time >= blink.nextAt) {
        startBlink(time, false)
      }

      if (
        blink.startedAt === 0 &&
        blink.secondBlinkQueued &&
        time >= blink.secondBlinkAt
      ) {
        startBlink(time, true)
      }

      if (blink.startedAt > 0) {
        const progress = (time - blink.startedAt) / blink.duration

        if (progress >= 1) {
          blink.startedAt = 0
          for (const eye of eyes) {
            eye.node.scale.y = eye.baseScale.y
          }
        } else {
          const openness = Math.abs(Math.cos(progress * Math.PI))
          const blinkScale = blink.minScale + openness * (1 - blink.minScale)

          for (const eye of eyes) {
            eye.node.scale.y = eye.baseScale.y * blinkScale
          }
        }
      }

      if (mouths.length > 0) {
        const smile = THREE.MathUtils.clamp(
          (Math.sin(time * 0.0016) + 1) * 0.5 +
            interaction.hoverMix * 0.2 +
            clickEnvelope * 0.35,
          0,
          1
        )
        const talkBase = Math.max(
          0,
          Math.sin(
            time * (0.013 + interaction.hoverMix * 0.005) + clickEnvelope
          )
        )
        const talk =
          talkBase * (1 + interaction.hoverMix * 0.45 + clickEnvelope * 0.8)

        mouths.forEach((mouth, index) => {
          const spread =
            mouths.length <= 1 ? 0 : index / (mouths.length - 1) - 0.5
          const phase = index * 0.55
          const flutter = Math.max(0, Math.sin(time * 0.016 + phase))
          const lift = talk * 0.024 + flutter * 0.009
          const smileShift = smile * 0.014

          mouth.node.position.y = mouth.basePosition.y - lift
          mouth.node.position.x = mouth.basePosition.x + spread * smileShift * 2

          mouth.node.scale.y =
            mouth.baseScale.y * (1 + talk * 0.28 + flutter * 0.08)
          mouth.node.scale.x = mouth.baseScale.x * (1 + smile * 0.06)
        })
      }

      renderer.render(scene, camera)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      mount.removeEventListener("pointerenter", handlePointerEnter)
      mount.removeEventListener("pointerleave", handlePointerLeave)
      mount.removeEventListener("click", handleClick)
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
