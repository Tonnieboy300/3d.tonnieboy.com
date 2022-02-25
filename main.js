import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const locationStart = document.body.getBoundingClientRect().top;
camera.position.z = locationStart * 0.01 + 5;
camera.position.x = locationStart * 0.005 + 5;
camera.position.y = locationStart * 0.005 + 5;

//objects
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

scene.add(pointLight, ambientLight);

//const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200,50);
//scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function generateStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xf9f9d9 });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(generateStar);

const spaceBackgroundTexture = new THREE.TextureLoader().load(
  "spacebackground.jpg"
);
scene.background = spaceBackgroundTexture;

//avatar mesh

const avatarTexture = new THREE.TextureLoader().load("avatar.png");

const avatar = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

scene.add(avatar);

//moon

const moonTexture = new THREE.TextureLoader().load("moontexture.jpg");
const moonNormal = new THREE.TextureLoader().load("moonnormal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormal })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function cameraMove() {
  //gets the distance the viewport is from the top of the page.
  const location = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.z = location * 0.01 + 5;
  camera.position.x = location * 0.005 + 5;
  camera.position.y = location * 0.005 + 5;
}

document.body.onscroll = cameraMove;

//each action in this function will occur each frame.
function animate() {
  //set framerate to 60 fps
  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 1000 / 60);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //avatar.rotation.x += -0.01;
  //avatar.rotation.y += -0.005;
  //avatar.rotation.z += -0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
