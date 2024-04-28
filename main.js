import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
//import { PointerLockControls } from "three-stdlib";
/*I change all the THREE.MeshBasicMaterial in my objects,
HREE.MeshStandardMaterial to respond to my lighting. */
const scene = new THREE.Scene(); //Create the scene
const camera = new THREE.PerspectiveCamera(
  75, //Field of view
  window.innerWidth / window.innerHeight, //Aspect ratio
  0.1, //Near clipping plane
  1000 //Far clipping plane
);
scene.add(camera);
camera.position.z = 5; //Don't forget to move backward 5 units to see our scene when rendered

const renderer = new THREE.WebGLRenderer({
  antialias: true, //For smooth edges
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffff, 1); //Background color
document.body.appendChild(renderer.domElement); //Add the renderer to our html

//Ambient Light is a soft light that lights up all te objects in the scene equally
let ambientLight = new THREE.AmbientLight(0x101010, 400); //color, intensity, distance
scene.add(ambientLight);
//Directional Light is a light source that acts like a sun, that illuminates all the objects in the scene equally from a specific direction
let sunLight = new THREE.DirectionalLight(0xffffff, 1); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

let geometry = new THREE.BoxGeometry(1, 1, 1); //BoxGeometry is the shape of the object
let material = new THREE.MeshStandardMaterial({ color: "blue" }); //color of the object
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Controls
//document.addEventListener("keydown", onKeyDown, false); //Event Listener for when we press the keys

//Texture of the floor
//let floorTexture = new THREE.ImageUtils.loadTexture("images/floor.png"); //ImageUtils is deprecated in the newer versions of THREE.js

let floorTexture = new THREE.TextureLoader().load("images/floor.png");

//Create the floor plane
let planeGeometry = new THREE.PlaneGeometry(50, 50);
let planeMaterial = new THREE.MeshStandardMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
let floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2; //this is 90 degrees
floorPlane.position.y = -Math.PI; //this is -180 degrees
scene.add(floorPlane);

//Create the ceil plane
let ceilTexture = new THREE.TextureLoader().load("images/ceiling.jpg");
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshStandardMaterial({
  map: ceilTexture,
});
let ceilPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilPlane.rotation.x = Math.PI / 2; //this is 90 degrees
ceilPlane.position.y = 10;
scene.add(ceilPlane);

//Create the walls
const wallGroup = new THREE.Group(); //create a group to hold the walls
scene.add(wallGroup);

//Create a wall material with realistic colors and textures
let wallTexture = new THREE.TextureLoader().load(
  "images/light-gray-concrete-wall.jpg"
); //load the texture
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);
/* 'wrapS' and 'wrapT' are properties of a texture that define how the texture should be repeated in the x
and y directions. 'wrapS' is the horizontal direction and 'wrapT' is the vertical direction. 'RepeatWrapping'
is one of the available wrapping modes and means that the texture will be repeated in the specified direction.
'RepeatWrapping' is the default wrapping mode for textures*/

//Front wall
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshStandardMaterial({ map: wallTexture })
);
frontWall.position.z = -20;
//Back wall
const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshStandardMaterial({ map: wallTexture })
);
backWall.position.z = 20;

//Left Wall
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
  })
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

//Right Wall
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshStandardMaterial({
    map: wallTexture,
  })
);
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 20;

wallGroup.add(frontWall, leftWall, rightWall, backWall);

//Loop through each wall and create the bounding box for each wall
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BoundingBox = new THREE.Box3();
  wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
}

// check if the player intersects with the wall
function checkCollision() {
  const playerBoundingBox = new THREE.Box3(); // create a bounding box for the player
  const cameraWorldPosition = new THREE.Vector3(); // create a vector to hold the camera position

  camera.getWorldPosition(cameraWorldPosition); // get the camera position and store it in the vector. Note: The camera represents the player's position in our case.
  playerBoundingBox.setFromCenterAndSize(
    /* setFromCenterAndSize is a method that takes the center and size of the box. We set the player's bounding 
    box size and center it on the camera's world position */
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );
  // loop through each wall
  for (let i = 0; i < wallGroup.children.length; i++) {
    const wall = wallGroup.children[i];
    if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      // check if the player's bounding box intersects with any of the wall bounding boxes
      return true; //
    }
  }
  return false;
}

function createPainting(imageURL, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageURL);
  const paintingMaterial = new THREE.MeshBasicMaterial({
    map: paintingTexture,
  });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.set(position.x, position.y, position.z);
  //position.z = pa forward/backward
  //position.y = pa upward/downward (vertical)
  //position.x = pa left/right (horizontal)
  return painting;
}

//Painting in the frontwall-left
const painting1 = createPainting(
  "images/Umaru_Drink.jpg",
  9,
  5,
  new THREE.Vector3(-10, 5, -19.99)
);

//Painting in the frontwall-right
const painting2 = createPainting(
  "images/Umaru_Sleep.jpg",
  9,
  5,
  new THREE.Vector3(10, 5, -19.99)
);

//Painting in the left sidewall
const painting3 = createPainting(
  "images/Umaru_Teddy.jpg",
  9,
  5,
  new THREE.Vector3(-19.99, 5, -10)
);
painting3.rotation.y = Math.PI / 2; //90 degrees. If we don't rotate this, it will show up in the front of us instead of lying on the left wall

//Painting in the right sidewall
const painting4 = createPainting(
  "images/Umaru_Space.jpg",
  9,
  5,
  new THREE.Vector3(19.99, 5, -10)
);
painting4.rotation.y = -(Math.PI / 2);
scene.add(painting1, painting2, painting3, painting4);

//Controls
const controls = new PointerLockControls(camera, document.body);
//Lock the pointer (controls are activated) and hide the menu when the experience starts
function startExperience() {
  controls.lock();
  hideMenu();
}
const playButton = document.getElementById("play_button");
playButton.addEventListener("click", startExperience);

function hideMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "none";
}

function showMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = "block";
}

controls.addEventListener("unlock", showMenu);
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

//event listener for when we press the keys
document.addEventListener(
  "keydown", // keydown is an event that fires when a key is pressed
  (event) => {
    if (event.key in keysPressed) {
      // check if the key pressed is in the keysPressed object
      keysPressed[event.key] = true; // if it is, set the value to true
    }
  },
  false
);

//event listener for when we release the keys
document.addEventListener(
  "keyup", // keyup is an event that fires when a key is released
  (event) => {
    if (event.key in keysPressed) {
      // check if the key released is in the keysPressed object
      keysPressed[event.key] = false; // if it is, set the value to false
    }
  },
  false
);

//function when a key is pressed, execute this function
/*function onKeyDown(event) {
  let keycode = event.which;

  //right arrow key
  if (keycode === 39 || keycode === 68) {
    controls.moveRight(0.08);
    //left arrow key
  } else if (keycode === 37 || keycode === 65) {
    controls.moveRight(-0.08);
    //up arrow key
  } else if (keycode === 38 || keycode === 87) {
    controls.moveForward(0.08);
    //down arrow key
  } else if (keycode === 40 || keycode === 83) {
    controls.moveForward(-0.08);
  }
}*/

//Add the movement (left/right/forward/backward) to the scene. Press the arrow keys or WASD to move

const clock = new THREE.Clock();

function updateMovement(delta) {
  const moveSpeed = 5 * delta;
  /*moveSpeed is the distance the camera will move in one second. We multiply it with delta to make the movement
  framerate independent. This means that the movement will be the same regardless of the framerate. This is important
  because if the framerate is low, the movement will be slow and if the framerate is high, the movement will be fast.
  This is not what we want. We want the movement to be the same regardless of the framerate*/
  const previousPosition = camera.position.clone();
  if (keysPressed.ArrowRight || keysPressed.d) {
    controls.moveRight(moveSpeed);
  }
  if (keysPressed.ArrowLeft || keysPressed.a) {
    controls.moveRight(-moveSpeed);
  }
  if (keysPressed.ArrowUp || keysPressed.w) {
    controls.moveForward(moveSpeed);
  }
  if (keysPressed.ArrowDown || keysPressed.s) {
    controls.moveForward(-moveSpeed);
  }

  /* After the movement is applied, we check for the collisions by calling the checkCollision function.
  If a collision is detected, we revert the camera's position to its previous position, effectively 
  preventing the player from moving through walls.*/

  if (checkCollision()) {
    camera.position.copy(previousPosition);
    /* reset the camera position to the previous position. The previousPosition variable is a clone of the
    camera position before the movement*/
  }
}
//Used to render the scene
let render = function () {
  const delta = clock.getDelta();
  updateMovement(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
render();

let renderLoopBox = function () {
  cube.rotation.x = cube.rotation.x + 0.01;
  cube.rotation.y = cube.rotation.y + 0.01;
  renderer.render(scene, camera); //renders the scene
  requestAnimationFrame(renderLoopBox);
};

renderLoopBox();

/**/

import * as THREE from "three";
import { scene, setupScene, animate } from "modules/scene.js";
import { createPaintings } from "modules/paintings.js";
import { createWalls } from "modules/walls.js";
import { setupLighting } from "modules/lighting.js";
import { setupFloor } from "modules/floor.js";
import { createCeiling } from "modules/ceiling.js";
import { createBoundingBoxes } from "modules/boundingBox.js";
import { setupRendering } from "modules/rendering.js";
import { setupEventListeners } from "modules/eventListeners.js";
import { addObjectstoScene } from "modules/sceneHelpers.js";
import { setupPlayButton } from "modules/menu.js";

let { camera, controls, renderer } = setupScene();

const textureLoader = new THREE.TextureLoader();

const walls = createWalls(scene, textureLoader);
const floor = setupFloor(scene);
const ceiling = createCeiling(scene, textureLoader);
const paintings = createPaintings(scene, textureLoader);
const lighting = setupLighting(scene, paintings);

createBoundingBoxes(walls);
createBoundingBoxes(paintings);
addObjectstoScene(scene, paintings);
setupPlayButton(controls);
setupEventListeners(controls);
setupRendering(scene, camera, renderer, paintings, controls, walls);
