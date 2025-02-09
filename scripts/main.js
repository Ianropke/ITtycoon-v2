// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

/**
 * gameState holder alle globale variabler.
 * tasks, rework, revision, KPI, tid, alt sammen.
 */
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
  // For at håndtere valg pr. trin: { title: string, advanced: boolean }
  choiceHistory: [],
  // For at begrænse revision til maks 1 revidering pr. trin
  revisionCount: [],
  // Markør for, om vi er i revidering. Hvis true, vender vi tilbage til CAB efter valg
  revisionMode: false
};

// Saml opgaver fra tasks-filer (antag hospitalTasks, infrastrukturTasks, cybersikkerhedTasks i window)
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);

// Bland opgaverne
shuffleArray(gameState.allTasks);

// Tag 7 styk til at starte med
gameState.tasks = gameState.allTasks.splice(0, 7);

// Chart.js
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

/** 
 * Render lokationer i venstre side
 */
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

/**
 * Hjælp-knappen
 */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpContent = `
    <h2>Få Hjælp</h2>
    <p><strong>Din Rolle:</strong> Du er IT-forvalter, ansvarlig for at balancere Tid, Sikkerhed og Udvikling.</p>
    <p>Brug “Vælg ny opgave” for at finde nye opgaver. 
       Hver opgave har flere trin; vælg lokation og løsning (komplet vs. hurtig).
       Pas på tiden!</p>
  `;
  openModal(helpContent, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/**
 * Start af spil – Intro og tutorial
 */
function showIntro() {
  const introHTML = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du er IT-forvalter i en stor organisation, der arbejder efter SAFe. 
       Venstre side: KPI-graf og lokationer. Højre side: aktiv opgave og knappen “Vælg ny opgave”.</p>
    <p>Brug tiden fornuftigt, og nå 10 opgaver, mens du holder 
       Sikkerhed og Udvikling over ${gameState.missionGoals.security} og ${gameState.missionGoals.development}!</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

// Sæt sprintmål
function showSprintGoal() {
  const sprintHTML = `
    <h2>PI Planning</h2>
    <p>Målsætning: Du skal opnå mindst ${gameState.missionGoals.security} i sikkerhed
      og ${gameState.missionGoals.development} i udvikling, 
      inden du har gennemført 10 opgaver, eller før tiden (30) løber ud.</p>
  `;
  openModal(sprintHTML, `<button id="continueTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

// Tutorial
function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p><strong>Trin:</strong> 
       1) Tryk “Vælg ny opgave” for at se potentielle opgaver. 
       2) Forpligt opgave. 
       3) Gennemfør trin ved at vælge lokation og løsning. 
       4) CAB evaluerer dine ændringer.</p>
    <p>Avancerede løsninger giver bedre KPI men koster mere tid. 
       Hurtige løsninger giver mindre KPI men sparer tid.</p>
  `;
  openModal(tutHTML, `<button id="endTutorial" class="modern-btn">Luk</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

/**
 * Avanceret opgavevalg – vis i en modal
 * Her kan vi se category og isHastende properties i en opgave.
 */
function openTaskSelectionModal() {
  let modalBody = `<h2>Vælg en opgave</h2><ul class="task-selection-list">`;
  
  gameState.tasks.forEach((task, index) => {
    let categoryBadge = task.category ? ` <span class="category-badge">[${task.category.toUpperCase()}]</span>` : '';
    let hasteBadge = task.isHastende ? `<span class="haster-badge">Haster!</span>` : '';
    
    modalBody += `
      <li class="task-selection-item">
        <h3>${task.title}${categoryBadge} ${hasteBadge}</h3>
        <p>${task.shortDesc}</p>
        <button class="commit-task-btn modern-btn" data-taskindex="${index}">
          <i class="fas fa-check"></i> Forpligt opgave
        </button>
        <button class="help-task-btn modern-btn" data-taskindex="${index}">
          <i class="fas fa-info-circle"></i> Arkitekthjælp
        </button>
      </li>
    `;
  });
  modalBody += '</ul>';
  
  const modalFooter = `<button id="closeTaskSelection" class="modern-btn">Luk</button>`;
  
  openModal(modalBody, modalFooter);
  
  document.getElementById('closeTaskSelection').addEventListener('click', () => closeModal());
  
  // Forpligt
  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-taskindex');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        startTask(chosenTask);
      }
    });
  });
  
  // Arkitekthjælp
  document.querySelectorAll('.help-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-taskindex');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        openModal(
          `<h2>Arkitekthjælp</h2>
           <p><strong>${chosenTask.title}</strong></p>
           <p>${chosenTask.narrativeIntro || "Ingen ekstra info tilgængelig."}</p>`,
          `<button id="closeTaskHelp" class="modern-btn">Luk</button>`
        );
        document.getElementById('closeTaskHelp').addEventListener('click', () => closeModal());
      }
    });
  });
}

// Knap "Vælg ny opgave"
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * Start en opgave
 */
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  
  // Revisionsflow
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;
  
  renderActiveTask(task);
  closeModal(); // Luk opgavevalg-modal, hvis åben
}

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

/**
 * Lokationsklik
 */
function handleLocationClick(clickedLocation) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Ingen aktiv opgave!</p>", `<button id="alertOk" class="modern-btn">OK</button>`);
    document.getElementById('alertOk').addEventListener('click', () => closeModal());
    return;
  }
  const currentStep = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLocation.toLowerCase() === currentStep.location.toLowerCase()) {
    showStepChoices(currentStep);
  } else {
    openModal(
      `<h2>Fejl</h2><p>Du valgte ${clickedLocation.toUpperCase()}, men 
       ${currentStep.location.toUpperCase()} kræves.</p>`,
      `<button id="errorOk" class="modern-btn">OK</button>`
    );
    document.getElementById('errorOk').addEventListener('click', () => closeModal());
  }
}

/**
 * Valg pr. trin
 */
function showStepChoices(step) {
  const bodyContent = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  
  let choiceAText = step.choiceA.text.replace(/-?\d+\s*tid/, `<span style='color:#800000;'>−2 tid</span>`);
  let choiceBText = step.choiceB.text.replace(/-?\d+\s*tid/, `<span style='color:#006400;'>0 tid</span>`);
  
  if (gameState.currentTask.focus === 'sikkerhed') {
    choiceAText = choiceAText.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    choiceBText = choiceBText.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }
  
  let footer = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${choiceAText})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${choiceBText})</button>
    <button id="architectHelp" class="modern-btn">${gameState.architectHelpUsed ? 'Arkitekthjælp brugt' : 'Brug Arkitekthjælp'}</button>
  `;
  
  // Fortryd kun hvis revisionCount < 1 for currentStep
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footer += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }
  
  openModal(bodyContent, footer);

  // Undo
  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      // Markér en revision
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
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
      } else if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
        cabApproval();
      } else {
        proceedToNextStep();
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
      } else if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
        cabApproval();
      } else {
        proceedToNextStep();
      }
    });
  });

  // Arkitekthjælp
  document.getElementById('architectHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      let hint = "Dette trin understøtter bedre sikkerhed ved en komplet løsning.";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="closeArchitectHelp" class="modern-btn">Luk</button>`
      );
      document.getElementById('closeArchitectHelp').addEventListener('click', () => {
        closeModal(() => showStepChoices(step));
      });
    }
  });
}

/**
 * applyChoice
 */
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

/**
 * proceedToNextStep
 */
function proceedToNextStep() {
  const task = gameState.currentTask;
  if (gameState.currentStepIndex < task.steps.length - 1) {
    gameState.currentStepIndex++;
    renderActiveTask(task);
  } else {
    cabApproval();
  }
}

/**
 * checkGameOverCondition
 */
function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      gameState.security >= gameState.missionGoals.security &&
      gameState.development >= gameState.missionGoals.development) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du nåede KPI’erne men ikke 10 opgaver!</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security || gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du klarede 10 opgaver, men KPI’erne er ikke nået.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security || gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Både opgaver og KPI’er er utilstrækkelige.</p>");
  } else {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du har klaret kravene, men løb alligevel tør for tid.</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB Approval
 */
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
    
    let buttonsHTML = `<button id="evaluateCAB" class="modern-btn">Evaluér nu</button>`;
    if (!allComprehensive) {
      buttonsHTML += ` <button id="goBackCAB" class="modern-btn">Gå tilbage</button>`;
    }
    
    openModal(cabExplanation, buttonsHTML);
    
    document.getElementById('evaluateCAB').addEventListener('click', () => {
      let chance = allComprehensive ? 1 : Math.min(1, focusKPI / missionGoal);
      if (Math.random() < chance) {
        // Godkendt -> opsummering
        showTaskSummary();
      } else {
        // Afvisning
        openModal("<h2>CAB Afvisning</h2><p>Rework koster 3 tidspoint.</p>", `<button id="continueRework" class="modern-btn">OK</button>`);
        document.getElementById('continueRework').addEventListener('click', () => {
          gameState.time -= 3;
          if (gameState.time < 0) gameState.time = 0;
          updateDashboard();
          closeModal(() => cabApproval());
        });
      }
    });
    
    if (!allComprehensive) {
      document.getElementById('goBackCAB').addEventListener('click', showRevisionOptions);
    }
  });
}

/**
 * showRevisionOptions
 */
function showRevisionOptions() {
  let revisableIndices = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] &&
        gameState.choiceHistory[i].advanced === false &&
        gameState.revisionCount[i] < 1) {
      revisableIndices.push(i);
    }
  }
  if (revisableIndices.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRevisionOk" class="modern-btn">OK</button>`);
    document.getElementById('noRevisionOk').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  
  let revisionList = "<h2>Vælg et trin at revidere</h2><ul>";
  revisableIndices.forEach(idx => {
    let stepTitle = gameState.currentTask.steps[idx].stepDescription;
    revisionList += `<li><button class="revisionBtn modern-btn" data-index="${idx}">Trin ${idx + 1}: ${stepTitle}</button></li>`;
  });
  revisionList += "</ul>";
  
  openModal(revisionList, "");
  document.querySelectorAll('.revisionBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      const chosenIndex = parseInt(e.target.getAttribute('data-index'));
      gameState.revisionMode = true;
      gameState.revisionCount[chosenIndex]++;
      closeModal(() => {
        gameState.currentStepIndex = chosenIndex;
        showStepChoices(gameState.currentTask.steps[chosenIndex]);
      });
    });
  });
}

/**
 * showTaskSummary
 */
function showTaskSummary() {
  let summaryHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, idx) => {
    if (ch) {
      summaryHTML += `<li>Trin ${idx + 1}: ${ch.title}</li>`;
    }
  });
  summaryHTML += "</ul>";
  
  openModal(summaryHTML, `<button id="continueAfterSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueAfterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

/**
 * finishTask
 */
function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="continueAfterFinish" class="modern-btn">OK</button>`);
  document.getElementById('continueAfterFinish').addEventListener('click', () => {
    closeModal(() => {
      // Fjern opgaven fra tasks
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      // Tilføj 1-2 nye opgaver
      const newTasks = gameState.allTasks.splice(0, 2);
      gameState.tasks = gameState.tasks.concat(newTasks);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

// "Vælg ny opgave"-knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Kør intro
showIntro();

// Eksporter alt, hvis du vil importere i en anden fil
export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
