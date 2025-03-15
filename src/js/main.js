import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';


const carouselInner = document.querySelector('.carousel-inner');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const slides = document.querySelectorAll('.carousel-slide');
let currentIndex = 0;

// Function to move the carousel
function moveCarousel() {
    const slideWidth = slides[0].clientWidth;
    carouselInner.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

// Next Slide
nextButton.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0; // Loop back to the first slide
    }
    moveCarousel();
});

// Previous Slide
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = slides.length - 1; // Loop to the last slide
    }
    moveCarousel();
});

// Handle Window Resize
window.addEventListener('resize', () => {
    moveCarousel(); // Recalculate slide position on resize
});

// Handle Window Resize
window.addEventListener('resize', () => {
    moveCarousel(); // Recalculate slide position on resize
});

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0A3069); // Black background
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.outputEncoding = THREE.sRGBEncoding;

const environment = new RoomEnvironment( renderer );
const pmremGenerator = new THREE.PMREMGenerator( renderer );
//scene.background = new THREE.Color( 0xbbbbbb );
scene.environment = pmremGenerator.fromScene( environment ).texture;
environment.dispose();
// Load the .glb file
const loader = new GLTFLoader();
let mixer; //to control animations
let model;
let model2;

loader.load(
    './model/rocket_ship.glb', // Ensure the path matches your file location
    (gltf) => {
        model = gltf.scene;

        scene.add(model);
        model.rotation.y = 60;
        model.rotation.x = 270;
        model.rotation.z = 50;

        model.position.x = -200;
        model.position.y = -100;
        
        console.log('Model loaded:', gltf);

        model.traverse(child => {
            if (child.material) {
                console.log(child.material);
                child.material.roughness = 0.2;
            }
        });
        // ✅ Step 2: Create an AnimationMixer
        mixer = new THREE.AnimationMixer(model);

        gltf.animations.forEach((clip, index) => {
            console.log(`Animation ${index}: ${clip.name}`);
        });

        // ✅ Step 3: Play the first animation (if exists)
        if (gltf.animations.length > 0) {
            console.log(model.animations)
            const action = mixer.clipAction(gltf.animations[0]); // Play first animation
            action.play();
        }

        animate();
    },
    (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading the model', error);
    }
);

loader.load(
    './model/the_ultimate_game-ready_robot_companion.glb', // Ensure the path matches your file location
    (gltf) => {
        model2 = gltf.scene;

        scene.add(model2);
        model2.position.z = 246;
        model2.position.x = 5;
        model2.rotation.y = -20;
        
        console.log('Model loaded:', gltf);

        model2.traverse(child => {
            if (child.material) {
                console.log(child.material);
                child.material.roughness = 0.2;
            }
        });
        // ✅ Step 2: Create an AnimationMixer
        mixer = new THREE.AnimationMixer(model2);

        gltf.animations.forEach((clip, index) => {
            console.log(`Animation ${index}: ${clip.name}`);
        });

        // ✅ Step 3: Play the first animation (if exists)
        if (gltf.animations.length > 0) {
            console.log(model.animations)
            const action = mixer.clipAction(gltf.animations[0]); // Play first animation
            action.play();
        }

        animate();
    },
    (xhr) => {
        console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading the model', error);
    }
);

// Set up lighting
const light = new THREE.AmbientLight(0xffffff, 1);
const hemLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemLight);
scene.add(light);

// Create Stars
const starCount = 10000; // Number of stars
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];

for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 2000; // Random X position
    const y = (Math.random() - 0.5) * 2000; // Random Y position
    const z = (Math.random() - 0.5) * 2000; // Random Z position
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));

const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2, transparent: true, opacity: 1 });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

const positions = starField.geometry.attributes.position.array;
for (let i = 0; i < positions.length; i += 3) {
    const z = positions[i + 2];
    positions[i + 1] -= 0.1 * (1 - z / 1000); // Move stars slower if they're farther away
    if (positions[i + 1] < -1000) positions[i + 1] = 1000;
}

camera.position.z = 250; 

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Move stars (optional: add subtle movement)
    const positions = starField.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1; // Move stars downward
        if (positions[i + 1] < -10000) positions[i + 1] = 10000; // Reset star position
    }
    starField.geometry.attributes.position.needsUpdate = true;

    model.position.x += 0.01;
    model.position.y += 0.01;
    model.position.z -= 0.001;

    camera.position.y -= .0001; 

    model2.position.z -= 0.0001;
    model2.position.x += 0.0001; 

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});