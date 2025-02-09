// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

// Global state
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
  choiceHistory: [],      // Hvert trin -> { title, advanced }
  revisionCount: [],      // Antal revideringer pr. trin
  revisionMode: false
};

// Saml opgaver (hospitalTasks, infrastrukturTasks, cybersikkerhedTasks ligger på window)
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);

// Bland opgaverne
shuffleArray(gameState.allTasks);

// Tag 7 som potentielle
gameState.tasks = gameState.allTasks.splice(0, 7);

// Chart.js til KPI
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
  options: { scales: { y: { beginAtZero: true } } }
});

function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [
    gameState.time,
    gameState.security,
    gameState.development
  ];
  kpiChart.update();
}

function updateTaskProgress() {
  document.getElementById('taskProgress').textContent = `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

// Render lokationer i venstre side
const locations = ["hospital","dokumentation","leverandør","infrastruktur","it‑jura","cybersikkerhed"];
function renderLocations() {
  const locDiv = document.getElementById('locations');
  locDiv.innerHTML = "";
  locations.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + " " + getIcon(loc);
    btn.addEventListener('click', () => handleLocationClick(loc));
    locDiv.appendChild(btn);
  });
}
renderLocations();

// Hjælp-knap
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const content = `
    <h2>Få Hjælp</h2>
    <p>Du er IT-forvalter og skal balancere Tid, Sikkerhed, og Udvikling. 
       Vælg opgaver klogt (knappen “Vælg ny opgave”), og gennemfør trin.
       Avancerede valg koster mere tid, men giver flere KPI-point.</p>
    <p>Efter alle trin i en opgave skal CAB godkende ændringerne.</p>
  `;
  openModal(content, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

// Intro / tutorial
function showIntro() {
  const introHTML = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du er IT-forvalter i en stor organisation. 
       Din opgave er at holde Sikkerhed og Udvikling højt (mindst 22), 
       mens du når 10 opgaver, inden tiden (30) løber ud!</p>
    <p>Venstre side: KPI-graf og lokationer. 
       Højre side: Aktiv opgave + knap “Vælg ny opgave”.</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

function showSprintGoal() {
  const sprintHTML = `
    <h2>PI Planning</h2>
    <p>Målet er at opnå mindst 22 i både Sikkerhed og Udvikling, 
       mens du løser 10 opgaver, før tiden (30) løber ud.</p>
  `;
  openModal(sprintHTML, `<button id="continueTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>Tryk på “Vælg ny opgave” for at se potentielle opgaver. 
       Hver opgave kan være markeret med kategori (“Hospital”, “Cyber” eller “Infra”) 
       og muligvis “Haster!”. 
       Forpligt opgaven og gennemfør trin ved at vælge lokation og løsning.</p>
    <p>Avanceret løsning: −2 tid, men + flere KPI. 
       Hurtig løsning: 0 tid, men + færre KPI.
       CAB evaluerer dine valg. Du kan gå tilbage og revidere, men kun én gang pr. trin.</p>
  `;
  openModal(tutHTML, `<button id="endTutorial" class="modern-btn">Luk</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

/**
 * Avanceret opgavevalg - modal
 */
function openTaskSelectionModal() {
  let body = `<h2>Vælg en opgave</h2><ul class="task-selection-list">`;
  
  gameState.tasks.forEach((task, index) => {
    // Viser hvem der har stillet opgaven (category) + “Haster!”
    let catBadge = task.category ? ` [${task.category.toUpperCase()}]` : "";
    let haste = task.isHastende ? `<span class="haster-badge">Haster!</span>` : "";
    body += `
      <li class="task-selection-item">
        <h3>${task.title}${catBadge} ${haste}</h3>
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
  body += '</ul>';
  
  const footer = `<button id="closeTaskSelection" class="modern-btn">Luk</button>`;
  
  openModal(body, footer);
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
           <p>${chosenTask.narrativeIntro || "Ingen ekstra info."}</p>`,
          `<button id="closeTaskHelp" class="modern-btn">Luk</button>`
        );
        document.getElementById('closeTaskHelp').addEventListener('click', () => closeModal());
      }
    });
  });
}

document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Start opgave
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  
  // Revisionsflow
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;
  
  renderActiveTask(task);
  closeModal(); // Luk opgavevalg-vinduet
}

function renderActiveTask(task) {
  const actDiv = document.getElementById('activeTask');
  actDiv.innerHTML = `<h2>${task.title}</h2><p>${task.shortDesc}</p>`;
  if (task.steps && task.steps.length > 0) {
    const ul = document.createElement('ul');
    ul.id = "taskLocations";
    task.steps.forEach((step, idx) => {
      const li = document.createElement('li');
      if (idx < gameState.currentStepIndex) {
        li.innerHTML = `${idx+1}. ${step.location.toUpperCase()} ${getIcon(step.location)} <span class="done">✔</span>`;
      } else {
        li.textContent = `${idx+1}. ${step.location.toUpperCase()} ${getIcon(step.location)}`;
      }
      ul.appendChild(li);
    });
    actDiv.appendChild(ul);

    const currentStep = task.steps[gameState.currentStepIndex];
    const instruction = document.createElement('p');
    instruction.innerHTML = `<strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}`;
    actDiv.appendChild(instruction);
  }
}

/**
 * Lokationsklik
 */
function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Ingen aktiv opgave!</p>", `<button id="alertOk" class="modern-btn">OK</button>`);
    document.getElementById('alertOk').addEventListener('click', () => closeModal());
    return;
  }
  const curStep = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLoc.toLowerCase() === curStep.location.toLowerCase()) {
    showStepChoices(curStep);
  } else {
    openModal(
      `<h2>Fejl</h2>
       <p>Du valgte ${clickedLoc.toUpperCase()}, men ${curStep.location.toUpperCase()} kræves.</p>`,
      `<button id="errorOk" class="modern-btn">OK</button>`
    );
    document.getElementById('errorOk').addEventListener('click', () => closeModal());
  }
}

/**
 * showStepChoices
 */
function showStepChoices(step) {
  const body = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  
  let choiceAText = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let choiceBText = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  
  if (gameState.currentTask.focus === 'sikkerhed') {
    // Skjul +udvikling
    choiceAText = choiceAText.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    choiceBText = choiceBText.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }
  
  let footer = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${choiceAText})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${choiceBText})</button>
    <button id="architectHelp" class="modern-btn">${gameState.architectHelpUsed ? "Arkitekthjælp brugt" : "Brug Arkitekthjælp"}</button>
  `;
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footer += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }
  openModal(body, footer);

  // Fortryd
  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
      gameState.revisionMode = true;
      closeModal(() => showStepChoices(step));
    });
  }

  // Choice A
  document.getElementById('choiceA').addEventListener('click', () => {
    const modChoice = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(modChoice);
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
    const modChoice = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(modChoice);
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
      let hint = "Avanceret valg giver bedre KPI men koster tid";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="closeArchitect" class="modern-btn">Luk</button>`
      );
      document.getElementById('closeArchitect').addEventListener('click', () =>
        closeModal(() => showStepChoices(step))
      );
    }
  });
}

// applyChoice
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

// proceedToNextStep
function proceedToNextStep() {
  const task = gameState.currentTask;
  if (gameState.currentStepIndex < task.steps.length - 1) {
    gameState.currentStepIndex++;
    renderActiveTask(task);
  } else {
    cabApproval();
  }
}

// checkGameOverCondition
function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      gameState.security >= gameState.missionGoals.security &&
      gameState.development >= gameState.missionGoals.development) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Men du nåede ikke 10 opgaver!</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du nåede 10 opgaver, men KPI'erne ikke!</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Både antal opgaver og KPI’er er utilstrækkelige.</p>");
  } else {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du nåede målet, men sluttede på tiden alligevel!</p>");
  }
  setTimeout(() => location.reload(), 4000);
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
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced === true);
    const approvalPct = allAdvanced ? 100 : Math.floor((focusKPI / missionGoal) * 100);
    const riskPct = 100 - approvalPct;
    
    const cabHTML = `
      <h2>CAB (Change Advisory Board)</h2>
      <p>Godkendelsesprocent: ${approvalPct}%</p>
      <p>Risiko for afvisning: ${riskPct}%</p>
    `;
    let buttons = `<button id="evaluateCAB" class="modern-btn">Evaluér nu</button>`;
    if (!allAdvanced) {
      buttons += ` <button id="goBackCAB" class="modern-btn">Gå tilbage</button>`;
    }

    openModal(cabHTML, buttons);
    
    document.getElementById('evaluateCAB').addEventListener('click', () => {
      let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);
      if (Math.random() < chance) {
        showTaskSummary();
      } else {
        openModal("<h2>CAB Afvisning</h2><p>Rework koster 3 tidspoint.</p>", `<button id="continueRework" class="modern-btn">OK</button>`);
        document.getElementById('continueRework').addEventListener('click', () => {
          gameState.time -= 3;
          if (gameState.time < 0) gameState.time = 0;
          updateDashboard();
          closeModal(() => cabApproval());
        });
      }
    });
    if (!allAdvanced) {
      document.getElementById('goBackCAB').addEventListener('click', showRevisionOptions);
    }
  });
}

// Revision
function showRevisionOptions() {
  let revisable = [];
  for (let i=0; i<gameState.choiceHistory.length; i++){
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1){
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Enten er alle trin allerede avancerede eller revideret.</p>", `<button id="noRevOk" class="modern-btn">OK</button>`);
    document.getElementById('noRevOk').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  let revList = "<h2>Vælg et trin at revidere</h2><ul>";
  revisable.forEach(idx => {
    let title = gameState.currentTask.steps[idx].stepDescription;
    revList += `<li><button class="revisionBtn modern-btn" data-idx="${idx}">Trin ${idx+1}: ${title}</button></li>`;
  });
  revList += "</ul>";

  openModal(revList, "");
  document.querySelectorAll('.revisionBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      let chosenIdx = parseInt(e.target.getAttribute('data-idx'));
      gameState.revisionMode = true;
      gameState.revisionCount[chosenIdx]++;
      closeModal(() => {
        gameState.currentStepIndex = chosenIdx;
        showStepChoices(gameState.currentTask.steps[chosenIdx]);
      });
    });
  });
}

// Opsummering
function showTaskSummary() {
  let summary = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      summary += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  summary += "</ul>";
  
  openModal(summary, `<button id="continueAfterSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueAfterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

// Afslut opgave
function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="finishOk" class="modern-btn">OK</button>`);
  document.getElementById('finishOk').addEventListener('click', () => {
    closeModal(() => {
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      const newOnes = gameState.allTasks.splice(0,2);
      gameState.tasks = gameState.tasks.concat(newOnes);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

// “Vælg ny opgave”-knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Start spil
showIntro();

// Eksporter alt, hvis nødvendigt
export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
