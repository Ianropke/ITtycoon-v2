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
  // choiceHistory: Hvert trin -> { title: <string>, advanced: <boolean> }
  choiceHistory: [],
  // revisionCount: Sporer, hvor mange gange hvert trin er revideret (maks 1)
  revisionCount: [],
  revisionMode: false
};

// Saml alle opgaver fra tasks-filerne (antag at hospitalTasks, infrastrukturTasks og cybersikkerhedTasks er på window)
gameState.allTasks = [].concat(window.hospitalTasks, window.infrastrukturTasks, window.cybersikkerhedTasks);

// Bland opgaverne
shuffleArray(gameState.allTasks);

// Tag 7 opgaver som potentielle opgaver
gameState.tasks = gameState.allTasks.splice(0, 7);

// Chart.js - KPI
const ctx = document.getElementById('kpiChart').getContext('2d');
const kpiChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Tid', 'Sikkerhed', 'Udvikling'],
    datasets: [
      {
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
      }
    ]
  },
  options: {
    scales: {
      y: { beginAtZero: true }
    }
  }
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

// Lokationer i venstre side
const locationsList = [
  'hospital',
  'dokumentation',
  'leverandør',
  'infrastruktur',
  'it‑jura',
  'cybersikkerhed'
];

function renderLocations() {
  const locationsDiv = document.getElementById('locations');
  locationsDiv.innerHTML = '';
  locationsList.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + ' ' + getIcon(loc);
    btn.addEventListener('click', () => handleLocationClick(loc));
    locationsDiv.appendChild(btn);
  });
}
renderLocations();

// Hjælp-knap
document.getElementById('helpButton').addEventListener('click', showHelp);

function showHelp() {
  const helpContent = `
    <h2>Få Hjælp</h2>
    <p><strong>Din Rolle som IT-forvalter</strong><br>
    Balancer Tid, Sikkerhed og Udvikling. Træf de rette beslutninger for at nå målet.</p>
    <p><strong>Spillets Struktur:</strong><br>
    Du har en knap "Vælg ny opgave", der åbner en modal med potentielle opgaver.</p>
  `;
  openModal(helpContent, `<button id="closeHelp">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

// Intro / tutorial
function showIntro() {
  const introContent = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du agerer IT-forvalter under SAFe. Venstre side: KPI-graf og lokationer, højre side: aktiv opgave og en knap til at vælge ny opgave.</p>
  `;
  openModal(introContent, `<button id="startGame">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

function showSprintGoal() {
  const sprintContent = `
    <h2>PI Planning</h2>
    <p>Målsætning: Opnå mindst ${gameState.missionGoals.security} i sikkerhed
      og ${gameState.missionGoals.development} i udvikling.</p>
  `;
  openModal(sprintContent, `<button id="continueTutorial">Fortsæt</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutorialContent = `
    <h2>Tutorial</h2>
    <p>Tryk på "Vælg ny opgave" for at se potentielle opgaver. 
    Når du forpligter en opgave, vælger du trin-lokationer, laver valg (komplet vs. hurtig), 
    og til sidst evaluerer CAB dig.</p>
  `;
  openModal(tutorialContent, `<button id="endTutorial">OK</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

// Modal til at vælge ny opgave
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
  modalBodyContent += '</ul>';
  
  const modalFooterContent = `<button id="closeTaskSelection">Luk</button>`;
  
  openModal(modalBodyContent, modalFooterContent);
  document.getElementById('closeTaskSelection').addEventListener('click', () => closeModal());
  
  // Forpligt opgave
  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const taskIndex = e.target.getAttribute('data-taskindex');
      const task = gameState.tasks[taskIndex];
      if (task) {
        startTask(task);
      }
    });
  });

  // Arkitekthjælp
  document.querySelectorAll('.help-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const taskIndex = e.target.getAttribute('data-taskindex');
      const task = gameState.tasks[taskIndex];
      if (task) {
        openModal(
          `<h2>Arkitekthjælp</h2><p>${task.narrativeIntro || "Ingen ekstra info..."}</p>`,
          `<button id="closeTaskHelp">Luk</button>`
        );
        document.getElementById('closeTaskHelp').addEventListener('click', () => closeModal());
      }
    });
  });
}

// Knap "Vælg ny opgave"
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Start en opgave
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  // For revisionsflow
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;
  renderActiveTask(task);
}

// Viser den aktive opgave (defineret -> kan eksporteres)
function renderActiveTask(task) {
  const activeTaskDiv = document.getElementById('activeTask');
  activeTaskDiv.innerHTML = `<h2>${task.title}</h2><p>${task.shortDesc}</p>`;
  if (task.steps && task.steps.length > 0) {
    const locationsListElem = document.createElement('ul');
    locationsListElem.id = 'taskLocations';
    task.steps.forEach((step, idx) => {
      const li = document.createElement('li');
      if (idx < gameState.currentStepIndex) {
        li.innerHTML = `${idx + 1}. ${step.location.toUpperCase()} ${getIcon(step.location)} <span class="done">✔</span>`;
      } else {
        li.textContent = `${idx + 1}. ${step.location.toUpperCase()} ${getIcon(step.location)}`;
      }
      locationsListElem.appendChild(li);
    });
    activeTaskDiv.appendChild(locationsListElem);
    const currentStep = task.steps[gameState.currentStepIndex];
    const instruction = document.createElement('p');
    instruction.innerHTML = `<strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}`;
    activeTaskDiv.appendChild(instruction);
  }
}

// Lokationsklik
function handleLocationClick(clickedLocation) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Vælg en opgave først!</p>", `<button id="alertOk">OK</button>`);
    document.getElementById('alertOk').addEventListener('click', () => closeModal());
    return;
  }
  const currentStep = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLocation.toLowerCase() === currentStep.location.toLowerCase()) {
    showStepChoices(currentStep);
  } else {
    openModal(
      `<h2>Fejl</h2><p>Forkert lokation. Du valgte ${clickedLocation.toUpperCase()}, men "${currentStep.location.toUpperCase()}" er korrekt.</p>`,
      `<button id="errorOk">OK</button>`
    );
    document.getElementById('errorOk').addEventListener('click', () => closeModal());
  }
}

// Vælg trin-løsning
function showStepChoices(step) {
  const bodyContent = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  
  let choiceAText = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let choiceBText = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === 'sikkerhed') {
    choiceAText = choiceAText.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    choiceBText = choiceBText.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }
  
  let footerContent = `
    <button id="choiceA">${step.choiceA.label} (${choiceAText})</button>
    <button id="choiceB">${step.choiceB.label} (${choiceBText})</button>
    <button id="architectHelp">${gameState.architectHelpUsed ? 'Arkitekthjælp brugt' : 'Brug Arkitekthjælp'}</button>
  `;
  // Fortryd kun hvis revisionCount endnu ikke brugt
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footerContent += ` <button id="undoChoice">Fortryd</button>`;
  }

  openModal(bodyContent, footerContent);
  
  // Fortryd
  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
      // Markér revision
      gameState.revisionMode = true;
      closeModal(() => showStepChoices(step));
    });
  }
  
  // Choice A
  document.getElementById('choiceA').addEventListener('click', () => {
    const modifiedChoice = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(modifiedChoice);
    gameState.choiceHistory[gameState.currentStepIndex] = { title: step.choiceA.label, advanced: true };
    closeModal(() => {
      if (gameState.revisionMode) {
        gameState.revisionMode = false;
        cabApproval();
      } else {
        if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
          cabApproval();
        } else {
          proceedToNextStep();
        }
      }
    });
  });
  
  // Choice B
  document.getElementById('choiceB').addEventListener('click', () => {
    const modifiedChoice = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(modifiedChoice);
    gameState.choiceHistory[gameState.currentStepIndex] = { title: step.choiceB.label, advanced: false };
    closeModal(() => {
      if (gameState.revisionMode) {
        gameState.revisionMode = false;
        cabApproval();
      } else {
        if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
          cabApproval();
        } else {
          proceedToNextStep();
        }
      }
    });
  });
  
  // Arkitekthjælp
  document.getElementById('architectHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      let hint = "Denne opgave understøtter Sikkerhed.";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="closeArchitectHelp">Luk</button>`
      );
      document.getElementById('closeArchitectHelp').addEventListener('click', () => {
        closeModal(() => showStepChoices(step));
      });
    }
  });
}

// Anvend valg
function applyChoice(choice) {
  gameState.time -= choice.applyEffect.timeCost;
  if (gameState.time < 0) gameState.time = 0;
  if (choice.applyEffect.statChange.security) {
    gameState.security += choice.applyEffect.statChange.security;
  }
  if (choice.applyEffect.statChange.development) {
    gameState.development += choice.applyEffect.statChange.development;
  }
  updateDashboard();
  if (gameState.time <= 0) {
    checkGameOverCondition();
  }
}

// Check Game Over
function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      gameState.security >= gameState.missionGoals.security &&
      gameState.development >= gameState.missionGoals.development) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du manglede stadig at gennemføre 10 opgaver, selvom dine KPI’er er nået.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security || gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du gennemførte 10 opgaver, men KPI’erne er ikke nået.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security || gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Både antal opgaver og KPI’er er utilstrækkelige.</p>");
  } else {
    openModal("<h2>Din tid er opbrugt!</h2><p>Spillet slutter, fordi du løb tør for tid.</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

// Proceed
function proceedToNextStep() {
  const task = gameState.currentTask;
  if (gameState.currentStepIndex < task.steps.length - 1) {
    gameState.currentStepIndex++;
    renderActiveTask(task);
  } else {
    cabApproval();
  }
}

// CAB
function cabApproval() {
  closeModal(() => {
    let focusKPI, missionGoal;
    if (gameState.currentTask.focus === 'sikkerhed') {
      focusKPI = gameState.security;
      missionGoal = gameState.missionGoals.security;
    } else {
      focusKPI = gameState.development;
      missionGoal = gameState.missionGoals.development;
    }
    const allComprehensive = gameState.choiceHistory.every(ch => ch && ch.advanced === true);
    const approvalPercentage = allComprehensive ? 100 : Math.floor((focusKPI) / missionGoal * 100);
    const riskPercentage = 100 - approvalPercentage;
    
    const cabExplanation = `
      <h2>CAB (Change Advisory Board)</h2>
      <p>Godkendelsesprocent: ${approvalPercentage}%</p>
      <p>Risiko for afvisning: ${riskPercentage}%</p>
    `;
    
    let buttonsHTML = `<button id="evaluateCAB">Evaluér nu</button>`;
    if (!allComprehensive) {
      // Gør det muligt at revidere trin
      buttonsHTML += ` <button id="goBackCAB">Gå tilbage</button>`;
    }
    
    openModal(cabExplanation, buttonsHTML);
    
    document.getElementById('evaluateCAB').addEventListener('click', () => {
      let chance = allComprehensive ? 1 : Math.min(1, (focusKPI) / missionGoal);
      if (Math.random() < chance) {
        showTaskSummary();
      } else {
        // Afvist, rework
        openModal("<h2>CAB Afvisning</h2><p>Rework påkrævet. Du mister 3 tidspoint.</p>", `<button id="continueRework">OK</button>`);
        document.getElementById('continueRework').addEventListener('click', () => {
          gameState.time -= 3;
          if (gameState.time < 0) gameState.time = 0;
          updateDashboard();
          closeModal(() => cabApproval());
        });
      }
    });
    // Gå tilbage for at revidere
    if (!allComprehensive) {
      document.getElementById('goBackCAB').addEventListener('click', () => showRevisionOptions());
    }
  });
}

// Revisionsmenu
function showRevisionOptions() {
  let revisableIndices = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    // Kun trin der er false (hurtig løsning) og ikke revideret
    if (gameState.choiceHistory[i] && gameState.choiceHistory[i].advanced === false && gameState.revisionCount[i] < 1) {
      revisableIndices.push(i);
    }
  }
  if (revisableIndices.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRevisionOk">OK</button>`);
    document.getElementById('noRevisionOk').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  let revisionList = "<h2>Vælg et trin at revidere</h2><ul>";
  revisableIndices.forEach(idx => {
    let stepTitle = gameState.currentTask.steps[idx].stepDescription;
    revisionList += `<li><button class="revisionBtn" data-index="${idx}">Trin ${idx + 1}: ${stepTitle}</button></li>`;
  });
  revisionList += "</ul>";
  
  openModal(revisionList, "");
  document.querySelectorAll('.revisionBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const chosenIndex = parseInt(e.target.getAttribute('data-index'));
      // Markér revision
      gameState.revisionMode = true;
      gameState.revisionCount[chosenIndex]++;
      closeModal(() => {
        // Gå til det valgte trin
        gameState.currentStepIndex = chosenIndex;
        showStepChoices(gameState.currentTask.steps[chosenIndex]);
      });
    });
  });
}

// Opsummering
function showTaskSummary() {
  let summaryHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((choice, idx) => {
    if (choice) {
      summaryHTML += `<li>Trin ${idx + 1}: ${choice.title}</li>`;
    }
  });
  summaryHTML += "</ul>";
  
  openModal(summaryHTML, `<button id="continueAfterSummary">Fortsæt</button>`);
  document.getElementById('continueAfterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

// Opgave afsluttes
function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="continueAfterFinish">OK</button>`);
  document.getElementById('continueAfterFinish').addEventListener('click', () => {
    closeModal(() => {
      // Fjern opgaven fra tasks
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      // Tilføj op til 2 nye opgaver
      const newTasks = gameState.allTasks.splice(0, 2);
      gameState.tasks = gameState.tasks.concat(newTasks);

      // Ryd skærmen
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

// "Vælg ny opgave"-knappen
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Starter spillet med intro
showIntro();

// Eksport – Bemærk at “renderActiveTask” nu er defineret
export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
