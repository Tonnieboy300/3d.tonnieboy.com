import "./style.css";
import * as THREE from "three";

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



//objects

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

torus.position.x=0;
torus.position.z=0;

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

scene.add(pointLight, ambientLight);

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
avatar.position.x=0;
avatar.position.z=0;

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


const redBackground = new THREE.TextureLoader().load(
  "redbackground.jpg"
);
function pageScroll() {
  //gets the distance the viewport is from the top of the page.
  const location = document.body.getBoundingClientRect().top;
  console.log(location);

  moon.position.y = location * -.035;
  torus.position.y = location * -.035;
  avatar.position.y = location * -.035;

  if(location !== 8){
    scene.background = redBackground;
  }
  else{
    scene.background = spaceBackgroundTexture;
  }
  
}
window.onload = pageScroll;
document.body.onscroll = pageScroll;

const gridHelper = new THREE.GridHelper(200,50);
//scene.add(gridHelper);


function cameraResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render(scene, camera)
}
var cameraPosition = 12;
camera.position.z = cameraPosition;
camera.position.x = -cameraPosition;
camera.position.y = cameraPosition;
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


  renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', cameraResize, false);
