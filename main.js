/*A bit of boilerplate for threejs*/
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

let donut;

let location;

let scrollLocation

let windowWidth = window.innerWidth;

let scrollChecker = new Boolean(false);

const splash = document.getElementById("splash");

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

let moonDistance = 30

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




camera.position.z = 24;
camera.position.x = -2;
camera.position.y = 0;

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
moon.position.setX(moonDistance);

const spaceBackgroundTexture = new THREE.TextureLoader().load(
  './spacebackground.jpg'
);
scene.background = spaceBackgroundTexture;
const redBackgroundTexture = new THREE.TextureLoader().load(
  './redbackground.jpg'
);

function topOfPage(){
  scene.background = spaceBackgroundTexture;
  scene.remove(donut);
}

function pageScroll() {
  //gets the distance the viewport is from the top of the page.
  location = document.body.getBoundingClientRect().top;



    scrollLocation = location * -0.035;

    moon.position.y = scrollLocation;
    torus.position.y = scrollLocation;
    avatar.position.y = scrollLocation;
    donut.position.y = -30 + scrollLocation;
    donut.rotation.x += 0.01;
    donut.rotation.y += 0.005;
    donut.rotation.z += 0.01;

    //console.log(location);
    if(location !== 8){
      scene.background = redBackgroundTexture;
      scene.add(donut);
    }
    else{
          //checks if the function has already been run
        if(scrollChecker == false){
        scene.add(donut);
        scrollChecker = true
      }else{
        topOfPage();
      }
    }

}
document.body.onscroll = pageScroll;

//Prerenderer

function preRender(){
  scene.background = redBackgroundTexture;
  renderer.render(scene,camera);
  setTimeout(topOfPage,100);
}

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

//makes the splash screen slide out of view
function closeSplash() {
  splash.style.animationName = "slideDown";
  splash.style.animationDuration = "2s";
  splash.style.animationDelay = "2s";
  splash.style.animationFillMode = "forwards";
  /*
    animation-name: slideDown;
    animation-duration: 2s;
    animation-delay:2s;
    animation-fill-mode:forwards;
  */
}

//for some reason, the donut constant only seems to work in the page scroll function, so the donut is prerendered in it.
setTimeout(pageScroll,30);
preRender();
animate();
//the splash screen is hidden only when the background begins to render
closeSplash();
window.addEventListener('resize', cameraResize);

