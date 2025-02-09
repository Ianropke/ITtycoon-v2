// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

// Global gameState
const gameState = {
  time: 30,
  security: 0,
  development: 0,
  currentTask: null,
  currentStepIndex: 0,
  tasksCompleted: 0,
  missionGoals: { security: 22, development: 22 },
  architectHelpUsed: false,
  allTasks: [],
  tasks: [],
  // choiceHistory gemmer for hvert trin et objekt: { title: <string>, advanced: <boolean> }
  choiceHistory: [],
  // revisionCount sporer, hvor mange gange hvert trin er revideret (maks. 1 pr. trin)
  revisionCount: [],
  revisionMode: false
};

// Saml alle opgaver fra de tre task-filer
gameState.allTasks = [].concat(window.hospitalTasks, window.infrastrukturTasks, window.cybersikkerhedTasks);

// Bland opgaverne tilfældigt
shuffleArray(gameState.allTasks);

// Tag de første 7 opgaver som de potentielle opgaver
gameState.tasks = gameState.allTasks.splice(0, 7);

// Initialiser Chart.js-dashboardet
const ctx = document.getElementById('kpiChart').getContext('2d');
const kpiChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Tid', 'Sikkerhed', 'Udvikling'],
    datasets: [{
      label: 'KPI',
      data: [gameState.time, gameState.security, gameState.development],
      backgroundColor: ['#f39c12', '#27ae60', '#8e44ad']
    },
    {
      label: 'Sprintmål',
      data: [null, gameState.missionGoals.security, gameState.missionGoals.development],
      type: 'line',
      borderColor: 'red',
      borderWidth: 2,
      fill: false,
      pointRadius: 0
    }]
  },
  options: { scales: { y: { beginAtZero: true } } }
});

function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [gameState.time, gameState.security, gameState.development];
  kpiChart.update();
}

function updateTaskProgress() {
  const progressElement = document.getElementById('taskProgress');
  progressElement.textContent = `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

/////////////////////////
// Render lokationer
/////////////////////////
const locationsList = ["hospital", "dokumentation", "leverandør", "infrastruktur", "it‑jura", "cybersikkerhed"];
function renderLocations() {
  const locationsDiv = document.getElementById('locations');
  locationsDiv.innerHTML = "";
  locationsList.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + " " + getIcon(loc);
    btn.addEventListener('click', () => handleLocationClick(loc));
    locationsDiv.appendChild(btn);
  });
}
renderLocations();

/////////////////////////
// Hjælpefunktioner (f.eks. Hjælp-knap)
/////////////////////////
document.getElementById('helpButton').addEventListener('click', showHelp);

function showHelp() {
  const helpContent = `
    <h2>Få Hjælp</h2>
    <p><strong>Din Rolle som IT-forvalter</strong><br>
       Balancer KPI’erne Tid, Sikkerhed og Udvikling. Træf de rette beslutninger for at optimere din organisations sikkerhed og udvikling, mens du holder øje med din tid.</p>
    <p><strong>Spillets Struktur:</strong><br>
       Hver opgave består af flere trin med to muligheder – komplet løsning (2 tidspoint, større bonus) og hurtig løsning (0 tidspoint, mindre bonus). Dashboardet viser din tid og opgaveprogress (f.eks. "Opgave 3/10").</p>
    <p>Held og lykke!</p>
  `;
  openModal(helpContent, `<button id="closeHelp">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/////////////////////////
// Intro og Tutorial
/////////////////////////
function showIntro() {
  const introContent = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du agerer IT‑forvalter under SAFe og starter med PI Planning, hvor målsætningen for udvikling og sikkerhed fastsættes.</p>
    <p>Venstre side viser din KPI-graf og en liste med lokationer; højre side viser den aktive opgave.</p>
    <p>For at vælge en ny opgave, tryk på knappen "Vælg ny opgave" i højre side.</p>
    <p>Hvert valg i et trin viser sin tidsomkostning – komplet løsning koster 2 tidspoint og giver en større bonus; hurtig løsning koster 0 tidspoint og giver en mindre bonus.</p>
  `;
  const modalContent = document.querySelector('.modal-content');
  modalContent.style.height = '48vh';
  openModal(introContent, `<button id="startGame">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => {
    modalContent.style.height = '40vh';
    closeModal(() => showSprintGoal());
  });
}

function showSprintGoal() {
  const sprintContent = `
    <h2>PI Planning</h2>
    <p>Målsætning: Opnå mindst ${gameState.missionGoals.security} i sikkerhed og ${gameState.missionGoals.development} i udvikling inden for sprintet.</p>
  `;
  openModal(sprintContent, `<button id="continueTutorial">Fortsæt til Tutorial</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutorialContent = `
    <h2>Tutorial</h2>
    <p><strong>Spillets Koncept:</strong><br>
       Du navigerer komplekse IT-systemer og balancerer KPI’erne Tid, Sikkerhed og Udvikling. Dit mål er at nå sprintmålsætningen, som du kan følge i grafen.</p>
    <p><strong>UI-Layout:</strong><br>
       Venstre side: KPI-graf og lokationer<br>
       Højre side: Den aktive opgave og "Vælg ny opgave" knappen</p>
    <p><strong>Spillets Mekanik:</strong><br>
       Når du forpligter en opgave, gennemfører du hvert trin ved at vælge den korrekte lokation. Komplet løsning koster 2 tidspoint og giver en større bonus; hurtig løsning koster 0 tidspoint og giver en mindre bonus.</p>
    <p><strong>Efter alle trin:</strong><br>
       Dine ændringer sendes til CAB for evaluering. Hvis målene opfyldes, godkender CAB dem; hvis ikke, afviser de dem, og du skal udføre rework – hvilket trækker ekstra tid. Brug CAB-feedbacken til at justere din strategi.</p>
  `;
  openModal(tutorialContent, `<button id="endTutorial">Næste</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

/////////////////////////
// Opgavevalg: Avanceret via modal
/////////////////////////
function openTaskSelectionModal() {
  let modalBodyContent = `<h2>Vælg en opgave</h2><ul class="task-selection-list">`;
  
  gameState.tasks.forEach((task, index) => {
    modalBodyContent += `
      <li class="task-selection-item">
        <h3>${task.title}</h3>
        <p>${task.shortDesc}</p>
        <button class="commit-task-btn" data-taskindex="${index}">
          <i class="fas fa-check"></i> Forpligt opgave
        </button>
        <button class="help-task-btn" data-taskindex="${index}">
          <i class="fas fa-info-circle"></i> Arkitekthjælp
        </button>
      </li>
    `;
  });
  modalBodyContent += `</ul>`;
  
  const modalFooterContent = `<button id="closeTaskSelection">Luk</button>`;
  
  openModal(modalBodyContent, modalFooterContent);
  
  document.getElementById('closeTaskSelection').addEventListener('click', () => closeModal());
  
  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskIndex = e.target.getAttribute('data-taskindex');
      const task = gameState.tasks[taskIndex];
      if (task) {
        startTask(task);
      }
    });
  });
  
  document.querySelectorAll('.help-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskIndex = e.target.getAttribute('data-taskindex');
      const task = gameState.tasks[taskIndex];
      if (task) {
        openModal(
          `<h2>Arkitekthjælp</h2><p>${task.narrativeIntro || "Ingen ekstra info tilgængelig."}</p>`,
          `<button id="closeTaskHelp">Luk</button>`
        );
        document.getElementById('closeTaskHelp').addEventListener('click', () => closeModal());
      }
    });
  });
}

document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/////////////////////////
// Start Opgave
/////////////////////////
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  gameState.choiceHistory = new Array(task.steps.length);
  renderActiveTask(task);
}

/* ... Resten af koden (handleLocationClick, showStepChoices, proceedToNextStep, CAB, rework, etc.)
   er præcis som i den forrige version. ... */

/////////////////////////
// Start Spillet
/////////////////////////
showIntro();

export { gameState, updateDashboard, openModal, closeModal, renderActiveTask };
