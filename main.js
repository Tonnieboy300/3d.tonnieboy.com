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

var cameraPosition = 12;
camera.position.z = cameraPosition;
camera.position.x = -cameraPosition;
camera.position.y = cameraPosition;

//objects

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

scene.add(pointLight, ambientLight);

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

//Array(200).fill().forEach(generateStar);

const spaceBackgroundTexture = new THREE.TextureLoader().load(
  "spacebackground.jpg"
);
scene.background = spaceBackgroundTexture;

//avatar mesh

const avatarTexture = new THREE.TextureLoader().load("avatar.png");

const avatar = new THREE.Mesh(
  new THREE.SphereGeometry(3),
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

moon.position.z = -5;
moon.position.setX(50);

function pageScroll() {
  //gets the distance the viewport is from the top of the page.
  const location = document.body.getBoundingClientRect().top;
  console.log(location);

  if (location >= 0) {
    moon.position.y = .007;
    torus.position.y = .007;
    avatar.position.y = .007;
  }
  else{
    moon.position.y = location * -.035;
    torus.position.y = location * -.035;
    avatar.position.y = location * -.035;
  }
  /*if (location < -180){
    scene.remove(moon, torus, avatar)
  }
  else{
    scene.add(moon, torus, avatar)
  }*/
}
window.onload = pageScroll;
document.body.onscroll = pageScroll;

const gridHelper = new THREE.GridHelper(200,50);
//cene.add(gridHelper);


function cameraResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render(scene, camera)
}
var moonRotation = .05
//each action in this function will occur each frame.
function animate() {
  //set framerate to 60 fps
  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 1000 / 60);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  avatar.rotation.x += -0.01;
  avatar.rotation.y += -0.005;
  avatar.rotation.z += -0.01;

  moon.rotation.y += moonRotation;

  controls.update();

  renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', cameraResize, false);
