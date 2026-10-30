
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const planets = [
  { name:"Mercury", emoji:"☿", type:"Terrestrial planet", description:"The smallest planet and the closest world to the Sun. Its surface is covered with craters, much like our Moon.", fact:"A year on Mercury lasts just 88 Earth days.", distance:"57.9 million km", diameter:"4,879 km", year:"88 days", moons:"0", color:0x9a938d, radius:.38, orbit:6.5, speed:1.6 },
  { name:"Venus", emoji:"♀", type:"Terrestrial planet", description:"Venus is wrapped in thick clouds and has a scorching surface. Its atmosphere traps heat in an extreme greenhouse effect.", fact:"Venus is the hottest planet in our solar system.", distance:"108.2 million km", diameter:"12,104 km", year:"225 days", moons:"0", color:0xd7a66c, radius:.58, orbit:9.5, speed:1.15 },
  { name:"Earth", emoji:"🌍", type:"Terrestrial planet", description:"Our home planet is the only known world with liquid water on its surface and life. Its atmosphere helps protect living things.", fact:"Earth is about 4.5 billion years old.", distance:"149.6 million km", diameter:"12,742 km", year:"365 days", moons:"1", color:0x3b8ed0, radius:.62, orbit:12.5, speed:1 },
  { name:"Mars", emoji:"♂", type:"Terrestrial planet", description:"The Red Planet has rusty iron-rich dust, enormous volcanoes and evidence that liquid water once flowed across its surface.", fact:"Olympus Mons on Mars is the largest known volcano in the solar system.", distance:"227.9 million km", diameter:"6,779 km", year:"687 days", moons:"2", color:0xc96e4e, radius:.47, orbit:15.5, speed:.78 },
  { name:"Jupiter", emoji:"♃", type:"Gas giant", description:"Jupiter is the largest planet. It has colourful cloud bands, powerful storms and a famous storm called the Great Red Spot.", fact:"More than 1,300 Earths could fit inside Jupiter by volume.", distance:"778.6 million km", diameter:"139,820 km", year:"11.9 Earth years", moons:"95+", color:0xc99c72, radius:1.65, orbit:21, speed:.43 },
  { name:"Saturn", emoji:"♄", type:"Gas giant", description:"Saturn is famous for its spectacular rings, made mostly of countless pieces of ice and rocky material.", fact:"Saturn is less dense than water, on average.", distance:"1.43 billion km", diameter:"116,460 km", year:"29.4 Earth years", moons:"146+", color:0xd8c18e, radius:1.42, orbit:27, speed:.31 },
  { name:"Uranus", emoji:"♅", type:"Ice giant", description:"Uranus is a pale blue-green ice giant. It rotates on its side, giving it some of the most unusual seasons in the solar system.", fact:"Uranus takes about 84 Earth years to orbit the Sun.", distance:"2.87 billion km", diameter:"50,724 km", year:"84 Earth years", moons:"28", color:0x82c9cf, radius:1.02, orbit:33, speed:.22 },
  { name:"Neptune", emoji:"♆", type:"Ice giant", description:"Neptune is a distant, deep-blue world with supersonic winds and a cold atmosphere. It is the eighth planet from the Sun.", fact:"Neptune was the first planet located through mathematical predictions.", distance:"4.5 billion km", diameter:"49,244 km", year:"165 Earth years", moons:"16", color:0x456bd2, radius:.98, orbit:39, speed:.17 }
];

const sceneHost = document.querySelector("#solar-scene");
const loading = document.querySelector("#scene-loading");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080e1d, 0.0025);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 250);
camera.position.set(0, 31, 57);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

sceneHost.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 18;
controls.maxDistance = 95;
controls.maxPolarAngle = Math.PI * 0.88;

scene.add(new THREE.AmbientLight(0x9aaed4, 1.15));

const sunLight = new THREE.PointLight(0xffd29a, 1700, 150);
scene.add(sunLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2.8, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0xffc46b })
);

scene.add(sun);

const sunGlow = new THREE.Mesh(
  new THREE.SphereGeometry(3.45, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffa64d,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
  })
);

scene.add(sunGlow);

const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 1600; i++) {
  const radius = 65 + Math.random() * 90;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  starPositions.push(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starPositions, 3)
);

scene.add(
  new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xc5d7ff,
      size: 0.22,
      transparent: true,
      opacity: 0.8
    })
  )
);

const planetMeshes = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const orbitLines = [];

function makeOrbit(radius) {
  const points = [];

  for (let i = 0; i <= 180; i++) {
    const angle = (i / 180) * Math.PI * 2;

    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0x6c85b8,
      transparent: true,
      opacity: 0.19
    })
  );

  scene.add(line);
  orbitLines.push(line);
}

planets.forEach((planet, index) => {
  makeOrbit(planet.orbit);

  const material = new THREE.MeshStandardMaterial({
    color: planet.color,
    roughness: 0.86,
    metalness: 0.02
  });

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(planet.radius, 32, 32),
    material
  );

  mesh.userData.planetIndex = index;
  scene.add(mesh);

  if (planet.name === "Saturn") {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(
        planet.radius * 1.35,
        planet.radius * 2.15,
        64
      ),
      new THREE.MeshBasicMaterial({
        color: 0xcdbb91,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72
      })
    );

    ring.rotation.x = -Math.PI / 2.35;
    mesh.add(ring);
  }

  planetMeshes.push(mesh);
});

function resizeScene() {
  const width = sceneHost.clientWidth;
  const height = sceneHost.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

new ResizeObserver(resizeScene).observe(sceneHost);
resizeScene();

loading?.remove();

let selectedPlanet = 2;
let paused = false;
let speedMultiplier = 1;

function selectPlanet(index) {
  selectedPlanet = index;

  const p = planets[index];

  document.querySelector("#planet-index").textContent =
    `${String(index + 1).padStart(2, "0")} / 08`;

  document.querySelector("#planet-symbol").textContent = p.emoji;
  document.querySelector("#planet-name").textContent = p.name;
  document.querySelector("#planet-type").textContent = p.type;
  document.querySelector("#planet-description").textContent = p.description;

  document.querySelector("#planet-fact").innerHTML =
    `<span>✦</span> ${p.fact}`;

  document.querySelector("#planet-distance").textContent = p.distance;
  document.querySelector("#planet-diameter").textContent = p.diameter;
  document.querySelector("#planet-year").textContent = p.year;
  document.querySelector("#planet-moons").textContent = p.moons;

  document.querySelectorAll(".planet-pick").forEach((button, i) => {
    button.classList.toggle("active", i === index);
  });

  document.querySelectorAll(".planet-card").forEach((card, i) => {
    card.classList.toggle("selected", i === index);
  });
}

const picker = document.querySelector("#planet-picker");
const cards = document.querySelector("#planet-cards");

planets.forEach((p, i) => {
  const button = document.createElement("button");

  button.className = "planet-pick";
  button.type = "button";
  button.textContent = String(i + 1);
  button.title = p.name;

  button.addEventListener("click", () => selectPlanet(i));

  picker.appendChild(button);

  const card = document.createElement("button");

  card.className = "planet-card";
  card.type = "button";

  card.innerHTML = `
    <div class="card-top">
      <span class="card-emoji">${p.emoji}</span>
      <span class="card-number">PLANET 0${i + 1}</span>
    </div>
    <h3>${p.name}</h3>
    <p>${p.type} · ${p.year} per orbit</p>
    <span class="card-link">EXPLORE PLANET ↗</span>
  `;

  card.addEventListener("click", () => {
    selectPlanet(i);
    document.querySelector("#explore").scrollIntoView({
      behavior: "smooth"
    });
  });

  cards.appendChild(card);
});

selectPlanet(selectedPlanet);

renderer.domElement.addEventListener("pointerdown", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(planetMeshes);

  if (hits.length) {
    selectPlanet(hits[0].object.userData.planetIndex);
  }
});

document.querySelector("#pause-btn").addEventListener("click", (event) => {
  paused = !paused;

  event.currentTarget.innerHTML = paused
    ? "▶ <span>Resume orbits</span>"
    : "Ⅱ <span>Pause orbits</span>";
});

document.querySelector("#speed-range").addEventListener("input", (event) => {
  speedMultiplier = Number(event.target.value);

  document.querySelector("#speed-value").textContent =
    `${speedMultiplier.toFixed(1)}×`;
});

document.querySelector("#reset-view").addEventListener("click", () => {
  camera.position.set(0, 31, 57);
  controls.target.set(0, 0, 0);
  controls.update();
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (!paused) {
    planetMeshes.forEach((mesh, i) => {
      const p = planets[i];

      mesh.userData.angle =
        (mesh.userData.angle ?? Math.random() * Math.PI * 2) +
        delta * p.speed * speedMultiplier * 0.22;

      const angle = mesh.userData.angle;

      mesh.position.set(
        Math.cos(angle) * p.orbit,
        0,
        Math.sin(angle) * p.orbit
      );

      mesh.rotation.y += delta * 0.35;
    });

    sun.rotation.y += delta * 0.08;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

/* ---------------- QUIZ SECTION ---------------- */

const questions = [
  {
    q: "Which planet is known as the Red Planet?",
    a: ["Venus", "Mars", "Jupiter", "Mercury"],
    correct: 1,
    explain: "Mars looks reddish because iron-rich minerals in its soil have rusted."
  },
  {
    q: "Which planet has the most famous ring system?",
    a: ["Earth", "Neptune", "Saturn", "Mercury"],
    correct: 2,
    explain: "Saturn's rings are made of countless pieces of ice and rocky material."
  },
  {
    q: "Which is the largest planet in our solar system?",
    a: ["Jupiter", "Saturn", "Uranus", "Earth"],
    correct: 0,
    explain: "Jupiter is the largest planet by both diameter and mass."
  },
  {
    q: "Which planet is our home?",
    a: ["Venus", "Mars", "Earth", "Neptune"],
    correct: 2,
    explain: "Earth is our home and the only world currently known to support life."
  },
  {
    q: "Which planet is farthest from the Sun?",
    a: ["Uranus", "Saturn", "Jupiter", "Neptune"],
    correct: 3,
    explain: "Neptune is the eighth and most distant planet from the Sun."
  }
];

let questionIndex = 0;
let score = 0;
let answered = false;
let completed = false;

const questionText = document.querySelector("#question-text");
const answerList = document.querySelector("#answer-list");
const feedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#next-question");

function renderQuestion() {
  const q = questions[questionIndex];

  answered = false;
  completed = false;

  document.querySelector("#quiz-step").textContent =
    `QUESTION ${questionIndex + 1} OF ${questions.length}`;

  document.querySelector("#quiz-score").textContent = `SCORE: ${score}`;

  document.querySelector("#progress-fill").style.width =
    `${(questionIndex / questions.length) * 100}%`;

  questionText.textContent = q.q;
  feedback.textContent = "";
  feedback.style.color = "";

  document.querySelector("#quiz-hint").textContent =
    "Choose the best answer.";

  nextButton.disabled = true;

  nextButton.textContent =
    questionIndex === questions.length - 1
      ? "Finish mission →"
      : "Next question →";

  answerList.innerHTML = "";

  q.a.forEach((answer, i) => {
    const button = document.createElement("button");

    button.className = "answer-option";
    button.type = "button";

    button.textContent =
      `${String.fromCharCode(65 + i)}. ${answer}`;

    button.addEventListener("click", () => chooseAnswer(i));

    answerList.appendChild(button);
  });
}

function chooseAnswer(index) {
  if (answered || completed) return;

  answered = true;

  const q = questions[questionIndex];

  [...answerList.children].forEach((button, i) => {
    button.disabled = true;

    if (i === q.correct) {
      button.classList.add("correct");
    } else if (i === index) {
      button.classList.add("incorrect");
    }
  });

  if (index === q.correct) {
    score++;

    feedback.textContent = `Correct! ${q.explain}`;
    feedback.style.color = "#8de3bb";
  } else {
    feedback.textContent = `Not quite. ${q.explain}`;
    feedback.style.color = "#ffc0c0";
  }

  document.querySelector("#quiz-score").textContent =
    `SCORE: ${score}`;

  document.querySelector("#quiz-hint").textContent =
    "Answer recorded.";

  nextButton.disabled = false;
}

async function saveQuizResult() {
  feedback.textContent =
    "Mission complete! Saving your anonymous score to Azure…";

  feedback.style.color = "#a9c7ff";

  try {
    const response = await fetch("/api/quiz-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        score,
        totalQuestions: questions.length
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "The API returned an error.");
    }

    feedback.textContent =
      `Score saved in Azure Storage: ${score}/${questions.length}. ${result.message}`;

    feedback.style.color = "#8de3bb";

  } catch (error) {
    feedback.textContent =
      `Quiz complete: ${score}/${questions.length}. The score could not be saved yet. Check the Azure API deployment and storage settings, then try again.`;

    feedback.style.color = "#ffd18a";

    console.error("Quiz result submission failed:", error);

  } finally {
    nextButton.disabled = false;
    nextButton.textContent = "Try again ↻";

    document.querySelector("#quiz-hint").textContent =
      "Your score is not linked to a personal identity.";
  }
}

function finishQuiz() {
  completed = true;

  questionText.textContent =
    `Mission complete! You scored ${score} out of ${questions.length}.`;

  answerList.innerHTML = "";

  document.querySelector("#quiz-step").textContent =
    "MISSION COMPLETE";

  document.querySelector("#progress-fill").style.width = "100%";

  nextButton.disabled = true;
  nextButton.textContent = "Saving result…";

  saveQuizResult();
}

function resetQuiz() {
  questionIndex = 0;
  score = 0;
  renderQuestion();
}

nextButton.addEventListener("click", () => {
  if (completed) {
    return resetQuiz();
  }

  if (!answered) return;

  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

renderQuestion();

/* ---------------- FOOTER YEAR ---------------- */

document.querySelector("#year").textContent =
  new Date().getFullYear();
