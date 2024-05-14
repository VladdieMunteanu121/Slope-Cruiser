import * as THREE from 'three';


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'



const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(WIDTH, HEIGHT);
const startButton = document.querySelector('.startButton')
const gameScreenDiv = document.querySelector('.gameScreen')
gameScreenDiv.appendChild(renderer.domElement);
const difficultyButtons = document.querySelectorAll('.difficultySelection button');
const characterButtons = document.querySelectorAll('.characterSelection button');
const trackButtons = document.querySelectorAll('.trackSelection button');

difficultyButtons.forEach(button => {
    button.addEventListener('click', function() {
        spawnRate(this.classList[0]);
    });
});

let difficultySelection = 0;
function spawnRate(difficulty){
    // console.log(difficulty);
    if(difficulty==="speed1") difficultySelection = 30;
    else if(difficulty==="speed2") difficultySelection = 20;
    else if(difficulty==="speed3") difficultySelection = 15;
}

// characterButtons.addEventListener('click', function(){
//     characterApperance(this.classList[0]);
// })

characterButtons.forEach(button => {
    button.addEventListener('click', function() {
        characterApperance(this.classList[0]);
    });
});
let texture;

function characterApperance(avatar){
    
    if (avatar === "style1")  riderObject.textureProfile = "https://t4.ftcdn.net/jpg/02/14/37/27/360_F_214372762_E33f93ocNklJ69MroxEambr3IKhUYnxd.jpg";
    else if (avatar === "style2") riderObject.textureProfile = "https://static.vecteezy.com/system/resources/previews/030/679/047/non_2x/red-texture-high-quality-free-photo.jpg";
    else if (avatar === "style3") riderObject.textureProfile = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/abcd5984-4ffb-45c5-a3a5-4a93386b71ad/d3d6vv5-fdcb4f13-751a-4aad-b01a-d317332d24d6.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2FiY2Q1OTg0LTRmZmItNDVjNS1hM2E1LTRhOTMzODZiNzFhZFwvZDNkNnZ2NS1mZGNiNGYxMy03NTFhLTRhYWQtYjAxYS1kMzE3MzMyZDI0ZDYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.e8qH8fv8scNh_HwHHh5xv-5YJMhTXSpgMe4T6Bzq4-U";

    if(riderObject.textureProfile){
        texture = textureLoader.load(riderObject.textureProfile);
    }else {
        texture = null;
    }

    riderObject.extrudeMaterial.map = texture;
    riderObject.extrudeMaterial.needsUpdate = true;
    //console.log(avatarApperance);
    // if(avatar === "jerrySteez")
}

trackButtons.forEach(button => {
    button.addEventListener('click', function(){
        trackSelection(this.classList[0]);
    })
})
let audio;
function trackSelection(track){
    if(audio){
        audio.pause();
        audio.currentTime = 0;
    }
    if (track === "track1"){
        audio = new Audio("audio/The-Black-Eyed-Peas-Boom-Boom-Pow-Instrumental-Prod.-By-will.i.am-DJ-Poet-Jean-Baptiste.mp3")
        startTimer(240000);
    }
    else if (track === "track2"){
        audio = new Audio("audio/Sean-Paul-Temperature-Instrumental-Prod.-By-Snowcone.mp3")
        startTimer(210000);
    }
    else if (track === "track3"){
        audio = new Audio("audio/The-Black-Eyed-Peas-Ring-A-Ling-Instrumental-Prod.-By-Keith-Harris.mp3")
        startTimer(260000);
    }

    if (audio){
        audio.play();
    }
}


startButton.addEventListener('click', () => {
    if(difficultySelection && texture && audio)
    gameScreenDiv.style.display = 'block';
    animate();
})

let wGame = false;
function startTimer(gameDuration){
    setTimeout(()=>{
        wonGame();
    }, gameDuration)
}
//const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();


//Feature Dev

const textureLoader = new THREE.TextureLoader();
//Parent Class
class GameEntity{
    constructor({width, height, depth, textureProfile, posX, posY, posZ, velocity = { x: 0, y: 0, z: 0 }, zAcceleration = false} ){
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.posX = posX;
    this.posY = posY;
    this.posZ = posZ;
    this.velocity = velocity;
    this.gravity = -0.008
    this.zAcceleration = zAcceleration
    

    this.extrudeGeometry = new THREE.BoxGeometry( width, height, depth);
    const texture = textureLoader.load (textureProfile)
    this.extrudeMaterial = new THREE.MeshStandardMaterial( { map: texture });
    this.extrudeMesh = new THREE.Mesh(this.extrudeGeometry, this.extrudeMaterial)
    this.position = this.extrudeMesh.position.set(posX,posY,posZ)

    this.top = this.extrudeMesh.position.y + (this.height/2)
    this.bottom = this.extrudeMesh.position.y - (this.height/2)

    this.rightSide = this.extrudeMesh.position.x + (this.width/2)
    this.leftSide = this.extrudeMesh.position.x - (this.width/2)

    this.front = this.extrudeMesh.position.z - (this.depth/2)
    this.back = this.extrudeMesh.position.z + (this.depth/2)

    }

    updatePos(platformObject){
        
        this.updateSidePos()
        
        if (this.zAcceleration) this.velocity.z += 0.0001;
        this.extrudeMesh.position.x += this.velocity.x;
        this.extrudeMesh.position.z += this.velocity.z;
        //game initiation
        this.gameInitiation(platformObject);
    }

    updateSidePos(){
        this.top = this.extrudeMesh.position.y + (this.height/2)
        this.bottom = this.extrudeMesh.position.y - (this.height/2)
        this.rightSide = this.extrudeMesh.position.x + (this.width/2)
        this.leftSide = this.extrudeMesh.position.x - (this.width/2)
        this.front = this.extrudeMesh.position.z - (this.depth/2)
        this.back = this.extrudeMesh.position.z + (this.depth/2)
    }
    // this function takes care of the application of gravity at the beginning of the game!!! Once the user presses start, the cube will drop to the surface and the game will begin
    gameInitiation(platformObject){
        this.velocity.y += this.gravity
        
        // this tracks all collisions between the platform and the rider (x-collisions and z-collisions(for drop effect off the platform) and y-collisions (for bounce effect))
        if(this.bottom + this.velocity.y <= platformObject.top && this.rightSide >= platformObject.leftSide && this.leftSide <= platformObject.rightSide && this.back >= platformObject.front && this.front <= platformObject.back){
            this.velocity.y *= 0.8
            this.velocity.y = (-this.velocity.y)
        }
        else {
            this.extrudeMesh.position.y += this.velocity.y
            this.extrudeMesh.position.z += this.velocity.z
        }
    }

}


//Child Classes
class Rider extends GameEntity {
    constructor ({width, height, depth, textureProfile, posX, posY, posZ, velocity}){
        super({width, height, depth, textureProfile, posX, posY, posZ, velocity});
        this.casShadow = true;
    }
}

class Platform extends GameEntity{
    constructor({width, height, depth, textureProfile, posX, posY, posZ}){
        super({width, height, depth, textureProfile, posX, posY, posZ});
        this.receiveShadow = true;
    }
}

class Obstacle extends GameEntity{
    constructor({width, height, depth, textureProfile, posX, posY, posZ, velocity, zAcceleration}){
        super({width, height, depth, textureProfile, posX, posY, posZ, velocity, zAcceleration});
        this.receiveShadow = true;
    }
}

//Object Instantiation
const riderObject = new Rider({
    width: 1, 
    height: 1, 
    depth: 1,
    posX: 0,
    posY: 0,
    posZ: 9,
    textureProfile: null,
    velocity: {
        x: 0,
        y: -0.02,
        z: 0
    }

});
const riderRender = riderObject.extrudeMesh;
riderRender.castShadow= true;
scene.add(riderRender);

const platformObject = new Platform({
    width: 8,
    height: 1,
    depth: 20,
    posX: 0,
    posY: -2,
    posZ: 0,
    textureProfile: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/04e84a3f-c29f-421d-bd85-fd81e9abf04d/d4iyucf-8992375d-a59a-467a-88e5-56501eb62dc1.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzA0ZTg0YTNmLWMyOWYtNDIxZC1iZDg1LWZkODFlOWFiZjA0ZFwvZDRpeXVjZi04OTkyMzc1ZC1hNTlhLTQ2N2EtODhlNS01NjUwMWViNjJkYzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.5fum68HJCMcCN5QT72o-lG51f62GtbJldbTimumAQGk"
});
const platformRender = platformObject.extrudeMesh;
platformRender.receiveShadow= true;
scene.add(platformRender);

// const obstacleObject = new Obstacle({
//     width: 1, 
//     height: 1, 
//     depth: 1,
//     posX: 0,
//     posY: 0,
//     posZ: -9,
//     textureProfile: "https://static.vecteezy.com/system/resources/previews/030/679/047/non_2x/red-texture-high-quality-free-photo.jpg",
//     velocity: {
//         x: 0,
//         y: 0,
//         z: 0.07
//     },
//     zAcceleration: true

// });
// const obstacleRender = obstacleObject.extrudeMesh;
// obstacleRender.castShadow= true;
// scene.add(obstacleRender);

const obstacles =[];




//Lighting Settings
const ambiantLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambiantLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(0,6,10)
dirLight.castShadow = true;
scene.add(dirLight);




camera.position.set(0,2,13)
camera.rotation.set(-0.5,0,0)

// riderMotion is a function that changes the spacial motion of the rider
//type = 0 (rider is spinning), type = 1 (rider is stationary)
function riderMotion(type){
    if(!type){
        riderRender.rotation.x += 0.01;
	    riderRender.rotation.y += 0.01;
    } else{}   
}

    const keys = {
        left: {
            pressed: false
        },
        right: {
            pressed: false
        },
        p: {
            pressed: false
        }
    }
window. addEventListener('keydown', (event) => {
    // console.log(event) //used this to get information on the specific buttons I intended to use in the application (ArrowRight, ArrowLeft, Space)
    switch(event.code){
        case('ArrowLeft'):
        keys.left.pressed = true;
        // console.log("pressed left arrow");
        break

        case('ArrowRight'):
        keys.right.pressed = true;
        // console.log("pressed right arrow");
        break

        //pressing the spacebar should lead to a pause screen!!!!
        case('KeyP'):
        keys.p.pressed = true;
        console.log("keyP was pressed");
        break

    }
})

window. addEventListener('keyup', (event) => {
    // console.log(event) //used this to get information on the specific buttons I intended to use in the application (ArrowRight, ArrowLeft, Space)
    switch(event.code){
        case('ArrowLeft'):
            keys.left.pressed = false;
            riderObject.velocity.x = -0.01
            break

        case('ArrowRight'):
            keys.right.pressed = false;
            riderObject.velocity.x = 0.01
            break
        case('KeyP'):
            keys.p.pressed = false
            break
    }
})

let obstacleSpawn = 0;
// initializes rendering in the browser!!!! 
// this is the section that allows you to create animations
function animate() {
	const animationID = requestAnimationFrame(animate);

    //motionTracker 
    riderObject.velocity.x = 0;

    //Adjust the speed of the rider 
    if (keys.left.pressed) riderObject.velocity.x = -0.1;
    else if(keys.right.pressed) riderObject.velocity.x = 0.1

    riderMotion(1);
    riderObject.updatePos(platformObject);
    obstacles.forEach(obstacleObject => {
        obstacleObject.updatePos(platformObject)
        if (riderObject.rightSide >= obstacleObject.leftSide && riderObject.leftSide <= obstacleObject.rightSide && riderObject.back >= obstacleObject.front && riderObject.front <= obstacleObject.back){
            lostGame();
            window.cancelAnimationFrame(animationID)
        }
        if(wGame === true){
            window.cancelAnimationFrame(animationID);
        }
    })



	renderer.render(scene, camera );
    // this part of the logic essentially states the following: every 75 iterations of the obstacle spawn variable, add another obstacle to the scene!!!
    if(obstacleSpawn % difficultySelection === 0){
        const obstacleObject = new Obstacle({
            width: 1, 
            height: 1, 
            depth: 1,
            posX: Math.floor(Math.random()*(platformObject.rightSide - platformObject.leftSide) + platformObject.leftSide),
            posY: 0,
            posZ: -9,
            textureProfile: "https://images.pexels.com/photos/2519175/pexels-photo-2519175.jpeg?cs=srgb&dl=pexels-mihir-koral-s-838411-2519175.jpg&fm=jpg",
            velocity: {
                x: 0,
                y: 0,
                z: 0.07
            },
            zAcceleration: true
        
        });
        const obstacleRender = obstacleObject.extrudeMesh;
        obstacleRender.castShadow= true;
        scene.add(obstacleRender);
        obstacles.push(obstacleObject);
    }
    obstacleSpawn++;
}

function lostGame(){
    alert("OH SHUCKS...YOU LOST...Refresh to Retry")
    audio.pause();
    audio.currentTime = 0;
}
function wonGame(){
    alert("WOHOOOO...YOU WON...Refresh to GO AGAIN")
    wGame = true;
    audio.pause();
    audio.currentTime = 0;
}

