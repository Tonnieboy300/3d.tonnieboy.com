/*A bit of boilerplate for threejs*/
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
let pageNum = 1;

//this variable should equal the total number of pages
let totalPages = 4;

//page elements
const page1element = document.getElementById("header1");
const page2element = document.getElementById("page2");
const page3element = document.getElementById("page3");
const page4element = document.getElementById("page4");

//for touchscreen support
var touchXStart = null
var touchYStart = null
var touchXEnd = null
var touchYEnd = null


const splash = document.getElementById("splash");

let moonDistance = 30

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

const avatarTexture = new THREE.TextureLoader().load('./assets/avatar.png');

const avatar = new THREE.Mesh(
  new THREE.SphereGeometry(3),
  new THREE.MeshBasicMaterial({ map: avatarTexture })
);

const moonTexture = new THREE.TextureLoader().load('./assets/moontexture.jpg');
const moonNormal = new THREE.TextureLoader().load('./assets/moonnormal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormal })
);

var donut = new THREE.Object3D();
const donutLoader = new GLTFLoader();

donutLoader.load( './assets/donut.glb', function ( gltf ) {
  
  const donutLoad = gltf.scene;
  scene.add(donutLoad);
  donut.model = gltf.scene;
  donut.add(donut.model);
}, undefined, function ( error ) {

  console.error( error );

});

var mine = new THREE.Object3D();
const mineLoader = new GLTFLoader();

mineLoader.load( './assets/skin.gltf', function ( gltf ) {
  
  const mineLoad = gltf.scene;
  scene.add(mineLoad);
  mine.model = gltf.scene;
  mine.add(mine.model);
}, undefined, function ( error ) {

  console.error( error );

});

const mineGroup = new THREE.Group();
mineGroup.add(mine)

mine.translateY(-10)

scene.add(moon, avatar, pointLight, ambientLight, torus, donut, mineGroup);

moon.position.z = -5;
moon.position.setX(moonDistance);

mine.scale.set(12,12,12);
mine.position.set(0,-10,-3);

const spaceBackgroundTexture = new THREE.TextureLoader().load(
  './assets/spacebackground.jpg'
);
scene.background = spaceBackgroundTexture;
const redBackgroundTexture = new THREE.TextureLoader().load(
  './assets/redbackground.jpg'
);

//toggles page elements 
function pageShow(page){
  let visElement = "page" + page;
  document.getElementById(visElement).classList.remove("invisible")
  

}

function pageHide(page){
    //removes the last and next pages
    let lastpage = page - 1
    let lastElement = "page" + lastpage;
    if(lastpage > 0){
      document.getElementById(lastElement).classList.add("invisible");
    }

    let nextpage = page + 1
    let nextElement = "page" + nextpage;

    if (nextpage <= totalPages){
      document.getElementById(nextElement).classList.add("invisible");
    }

}

function pageSwitch(page){

 //put code for each page here
  switch (page){
    case 1:
      scene.background = spaceBackgroundTexture;
      scene.remove(donut);
      scene.remove(mineGroup);
      scene.add(avatar);
      scene.add(torus);
      scene.add(moon);
      pageShow(page);
      page1element.scrollIntoView({behavior: "smooth", block:"center"});
      pageHide(page);
      break;
    case 2:
      scene.background = redBackgroundTexture;
      scene.remove(torus);
      scene.remove(avatar);
      scene.remove(moon);
      scene.remove(mineGroup);
      scene.add(donut);
      pageShow(page);
      page2element.scrollIntoView({behavior: "smooth", block:"center"});
      pageHide(page);
      break;
    case 3:
      scene.background = redBackgroundTexture;
      scene.remove(donut);
      scene.add(mineGroup);
      pageShow(page);
      page3element.scrollIntoView({behavior: "smooth", block:"center"});
      pageHide(page);
      break;
    case 4:
      scene.background = redBackgroundTexture;
      pageShow(page);
      page4element.scrollIntoView({behavior: "smooth", block:"center"});
      pageHide(page);
      break;
  }
}

function pageTurn(){
  if (pageNum < totalPages){
    pageNum = pageNum + 1;
  }
  pageSwitch(pageNum);
}

function pageTurnBack(){
  if (pageNum > 1){
    pageNum = pageNum - 1;
  }
  pageSwitch(pageNum);
}

//Prerenderer

function preRender(){
  scene.background = redBackgroundTexture;
  renderer.render(scene,camera);
 setTimeout(function() {pageSwitch(pageNum)},200);
}

function cameraResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render(scene, camera)
//to ensure the text is centered and isnt off screen
  switch (pageNum){
    case 1:
      page1element.scrollIntoView({behavior: "smooth", block:"center"});
      break;
    case 2:
      page2element.scrollIntoView({behavior: "smooth", block:"center"});
      break;
    case 3:
      page3element.scrollIntoView({behavior: "smooth", block:"center"});
      break;
    case 4:
      page4element.scrollIntoView({behavior: "smooth", block:"center"});
      break;
}
}

//detects touch inputs and their direction

const body = document.getElementById("body");

function detectSwipeDirection(){
  if(Math.abs(touchYStart - touchYEnd) > 50){
    if(touchYStart > touchYEnd){
      console.log("swipe up");
    }
    if(touchYStart < touchYEnd){
      console.log("swipe down");
    }
  }
/* not needed for up and down detection
  if(Math.abs(touchXStart - touchXEnd) > 50){
    if(touchXStart < touchXEnd){
      console.log("swipe right");
    }
    if(touchXStart > touchXEnd){
      console.log("swipe left");
    }
  }
  */
}

body.addEventListener("touchstart",function(event){
  touchXStart = event.changedTouches[0].screenX;
  touchYStart = event.changedTouches[0].screenY;
},false)

body.addEventListener("touchend",function(event){
  touchXEnd = event.changedTouches[0].screenX;
  touchYEnd = event.changedTouches[0].screenY;
  detectSwipeDirection();
})



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

  mineGroup.rotation.x += 0.01;
  mineGroup.rotation.y += 0.005;
  mineGroup.rotation.z += 0.01;

 donut.rotation.x += 0.01;
 donut.rotation.y += 0.005;
 donut.rotation.z += 0.01;

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

//ensures the page always loads at page 1
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

const mobileStyle = document.createElement("link");
mobileStyle.rel = "stylesheet";
mobileStyle.href = "./css/mobile.css";
mobileStyle.id = "mobileCSS"

const desktopStyle = document.createElement("link");
desktopStyle.rel = "stylesheet";
desktopStyle.href = "./css/desktop.css";
desktopStyle.id = "desktopCSS"

let mobileMode = false;

function mobile(){
  if(window.innerWidth <= 700){
    if(document.getElementById("desktopCSS") != null){
      document.getElementById("desktopCSS").remove();
    }
    document.head.appendChild(mobileStyle);
    mobileMode = true;
    console.log("mobile on")
  }else{
    if(mobileMode == true) {
      if(document.getElementById("mobileCSS") != null){
        document.getElementById("mobileCSS").remove();
      }
      document.head.appendChild(desktopStyle);
      mobileMode=false;
      console.log("mobile off")
    }
  }

}

preRender();
animate();
//the splash screen is hidden only when the background begins to render
closeSplash();
window.addEventListener('resize', cameraResize);
window.addEventListener('resize', mobile);
//check if mobile mode should be on
mobile();

//document.getElementById("nextButton").addEventListener("mousedown", pageTurn);
//document.getElementById("backButton").addEventListener("mousedown", pageTurnBack);
