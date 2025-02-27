import * as THREE from 'three';

document.querySelector('.btn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#videos-area').scrollIntoView({ behavior: 'smooth' });
});

const carouselInner = document.querySelector('.carousel-inner');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const slides = document.querySelectorAll('.carousel-item');
let currentIndex = 0;

// Function to move the carousel
function moveCarousel() {
    const slideWidth = slides[0].clientWidth; // Width of one slide
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

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('threejs-canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Black background

// Create Stars
const starCount = 1000; // Number of stars
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

camera.position.z = 1000; // Move camera back to see the stars

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Move stars (optional: add subtle movement)
    const positions = starField.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1; // Move stars downward
        if (positions[i + 1] < -1000) positions[i + 1] = 1000; // Reset star position
    }
    starField.geometry.attributes.position.needsUpdate = true;

    // Twinkle stars
    const opacity = Math.sin(Date.now() * 0.0005) * 0.5 + 0.5; // Oscillate opacity
    starsMaterial.opacity = opacity;

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});