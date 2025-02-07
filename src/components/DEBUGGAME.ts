import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d-compat'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

// ✅ Initialize Three.js Scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new PointerLockControls(camera, document.body)
document.addEventListener('click', () => controls.lock())

await RAPIER.init()
const world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0))

// ✅ Create Rapier Kinematic Character Controller
const characterController = world.createCharacterController(0.1) // `0.1` is skin width
characterController.setMaxSlopeClimbAngle(45)
characterController.setMinSlopeSlideAngle(30)
characterController.enableSnapToGround(0.2)

// ✅ Create Player Collider
const player = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased())
const playerCollider = world.createCollider(RAPIER.ColliderDesc.capsule(0.5, 1), player)
const playerVelocity = new RAPIER.Vector3(0, 0, 0)
let isGrounded = false

// ✅ Create Ground
const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
world.createCollider(RAPIER.ColliderDesc.cuboid(10, 0.1, 10), ground)

// ✅ Create a Visible Player (for debugging)
const playerMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }))
scene.add(playerMesh)

// Movement Variables
const movement = { forward: 0, right: 0 }
document.addEventListener('keydown', e => {
  if (e.code === 'KeyW') movement.forward = 1
  if (e.code === 'KeyS') movement.forward = -1
  if (e.code === 'KeyA') movement.right = -1
  if (e.code === 'KeyD') movement.right = 1
})
document.addEventListener('keyup', e => {
  if (e.code === 'KeyW' || e.code === 'KeyS') movement.forward = 0
  if (e.code === 'KeyA' || e.code === 'KeyD') movement.right = 0
})

// Game Loop
function animate() {
  requestAnimationFrame(animate)

  // Get Player's Current Position
  const playerPos = player.translation()

  // Calculate Movement Direction
  const moveSpeed = 0.1
  const direction = new THREE.Vector3()
  camera.getWorldDirection(direction)
  direction.y = 0 // Keep movement on the horizontal plane
  direction.normalize()

  const right = new THREE.Vector3()
  right.crossVectors(camera.up, direction).normalize()

  const movementVector = new RAPIER.Vector3(direction.x * movement.forward * moveSpeed + right.x * movement.right * moveSpeed, playerVelocity.y, direction.z * movement.forward * moveSpeed + right.z * movement.right * moveSpeed)

  // ✅ Move Character Using Kinematic Controller
  const movementApplied = characterController.computeColliderMovement(playerCollider, movementVector)
  isGrounded = characterController.computedMovementApplied() // Detect if grounded

  // Apply movement to the player
  player.setNextKinematicTranslation(playerPos.add(movementApplied))

  // Update Three.js Mesh Position
  playerMesh.position.copy(player.translation())

  renderer.render(scene, camera)
}

animate()
export default () => {}
