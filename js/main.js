import * as THREE from "three";

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
let ambientLight = new THREE.AmbientLight(0x101010, 1.0); //color, intensity, distance
//ambientLight.position = camera.position; //light follows camera
scene.add(ambientLight);
//Directional Light is a light source that acts like a sun, that illuminates all the objects in the scene equally from a specific direction
let sunLight = new THREE.DirectionalLight(0xddddd, 1.0); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

let geometry = new THREE.BoxGeometry(1, 1, 1); //BoxGeometry is the shape of the object
let material = new THREE.MeshBasicMaterial({ color: "blue" }); //color of the object
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Controls
document.addEventListener("keydown", onKeyDown, false); //Event Listener for when we press the keys

//Texture of the floor
//let floorTexture = new THREE.ImageUtils.loadTexture("images/floor.png"); //ImageUtils is deprecated in the newer versions of THREE.js

let floorTexture = new THREE.TextureLoader().load("images/floor.png");

//Create the floor plane
let planeGeometry = new THREE.PlaneGeometry(50, 50);
let planeMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide,
});
let floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2; //this is 90 degrees
floorPlane.position.y = -Math.PI; //this is -180 degrees
scene.add(floorPlane);

//Create the ceil plane
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshBasicMaterial({
  color: "white",
});
let ceilPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilPlane.rotation.x = Math.PI / 2; //this is 90 degrees
ceilPlane.position.y = 14;
scene.add(ceilPlane);

//Create the walls
const wallGroup = new THREE.Group(); //create a group to hold the walls
scene.add(wallGroup);
//Front wall
const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({ color: "green" })
);
frontWall.position.z = -20;

//Left Wall
const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({
    color: "red",
  })
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

//Right Wall
const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(50, 20, 0.001),
  new THREE.MeshBasicMaterial({ color: "black" })
);
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 20;

wallGroup.add(frontWall, leftWall, rightWall);

//Loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BBox = new THREE.Box3();
  wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

//function when a key is pressed, execute this function
function onKeyDown(event) {
  let keycode = event.which;

  //right arrow key
  if (keycode === 39) {
    camera.translateX(-0.05);
    //left arrow key
  } else if (keycode === 37) {
    camera.translateX(0.05);
    //up arrow key
  } else if (keycode === 38) {
    camera.translateY(-0.05);
    //down arrow key
  } else if (keycode === 40) {
    camera.translateY(0.05);
  }
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
  return painting;
}

const painting1 = createPainting(
  "images/Umaru_Drink.jpg",
  10,
  5,
  new THREE.Vector3(10, 5, 20)
);

const painting2 = createPainting(
  "images/Umaru_Sleep.jpg",
  10,
  5,
  20,
  new THREE.Vector3(10, 5, 20)
);
scene.add(painting1, painting2);

let renderLoop = function () {
  cube.rotation.x = cube.rotation.x + 0.01;
  cube.rotation.y = cube.rotation.y + 0.01;
  renderer.render(scene, camera); //renders the scene
  requestAnimationFrame(renderLoop);
};

renderLoop();
