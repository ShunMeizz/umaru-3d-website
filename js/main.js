const scene = new THREE.Scene(); //Create the scene
const camera = new THREE.PerspectiveCamera(
  75, //Field of view
  window.innerWidth / window.innerHeight, //Aspect ratio
  0,
  1, //Near
  1000 //Far
);
scene.add(camera);
camera.position.z = 5; //Don't forget to move backward 5 units to see our scene when rendered

const renderer = new THREE.WebGLRenderer({
  antialias: true, //For smooth edges
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfffff, 1); //Background color
document.body.appendChild(renderer.domElement); //Add the renderer to our html

//Let there be light!
//Ambient Light
let ambientLight = new THREE.AmbientLight(0x101010, 1.0); //color, intensity, distance
ambientLight.position = camera.position; //light follows camera
scene.add(ambientLight);
//Directional Light
let sunLight = new THREE.DirectionalLight(0xddddd, 1.0); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

let geometry = new THREE.BoxGeometry(1, 1, 1); //BoxGeometry is the shape of the object
let material = new THREE.MeshBasicMaterial({ color: "blue" }); //color of the object
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
//Render
renderer.render(scene, camera);
