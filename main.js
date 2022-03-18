/*A bit of boilerplate for threejs*/
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


let donut;

const cssElement = document.getElementById("css");
/*small window detection
 *This changes the css when the window is less than 700 pixels wide.
*/
window.addEventListener('resize', cssChange);
function cssChange(){
  let windowWidth = window.innerWidth;
  let attribute = cssElement.getAttribute("href");
  if(windowWidth <= 700){
    if(attribute == "./style.css"){
      cssElement.href = "./mobile.css";
    }
  }
  if(windowWidth > 700){
    if(attribute == "./mobile.css"){
      cssElement.href = "./style.css";
    }
  }
 }

window.onload = cssChange();

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

/*Sets up the scene
 *torus, lighting, avatar, donut, moon
*/

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const torus = new THREE.Mesh(geometry, material);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);

const avatarTexture = new THREE.TextureLoader().load('avatar.png');

const avatar = new THREE.Mesh(
  new THREE.SphereGeometry(3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

const moonTexture = new THREE.TextureLoader().load('./moontexture.jpg');
const moonNormal = new THREE.TextureLoader().load('./moonnormal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormal })
);

scene.add(moon, avatar, pointLight, ambientLight, torus);

const donutLoader = new GLTFLoader();


  donutLoader.load( './donut.glb', function ( gltf ) {
  
  donut = gltf.scene
  donut.position.y = -20;

}, undefined, function ( error ) {

	console.error( error );

});


moon.position.z = -5;
moon.position.setX(50);

const spaceBackgroundTexture = new THREE.TextureLoader().load(
  './spacebackground.jpg'
);
scene.background = spaceBackgroundTexture;
const redBackgroundTexture = new THREE.TextureLoader().load(
  'redbackground.jpg'
);

function pageScroll() {
  //gets the distance the viewport is from the top of the page.
  const location = document.body.getBoundingClientRect().top;

    moon.position.y = location * -.035;
    torus.position.y = location * -.035;
    avatar.position.y = location * -.035;
    donut.position.y = -30 + location * -.035;
    donut.rotation.x += 0.01;
    donut.rotation.y += 0.005;
    donut.rotation.z += 0.01;

    if(location !== 8){
      scene.background = redBackgroundTexture;
      scene.add(donut);
    }
    else{
      scene.background = spaceBackgroundTexture;
      scene.remove(donut);
    }
}
window.onload = pageScroll;
document.body.onscroll = pageScroll;



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

  renderer.render(scene, camera);
}

animate();
window.addEventListener('resize', cameraResize, false);
