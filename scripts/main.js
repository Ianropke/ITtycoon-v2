// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

/**
 * Global state
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
  choiceHistory: [],   // For hvert trin -> { title, advanced }
  revisionCount: [],   // Revision pr. trin
  revisionMode: false
};

// 1) Hent opgaver fra tasks-filerne (hospitalTasks, infrastrukturTasks, cybersikkerhedTasks på window)
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);

// 2) Bland opgaverne
shuffleArray(gameState.allTasks);

// 3) Tag 7 som potentielle
gameState.tasks = gameState.allTasks.splice(0, 7);

// 4) Giv 10% af de syv opgaver "isHastende: true" (tilfældigt)
assignRandomHastende(gameState.tasks);

/**
 * Hvis dine tasks-filer slet ikke har "category" eller "focus",
 * kan du selv tilføje dem i en random-ish måde. Men typisk har
 * du fx "task.focus = 'sikkerhed'" eller "task.focus = 'udvikling'".
 * Her antager vi, at tasks-filerne allerede har "focus" og "category".
 */
function assignRandomHastende(taskArray) {
  taskArray.forEach(t => {
    // 10% chance
    t.isHastende = (Math.random() < 0.1);
  });
}

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
  const prog = document.getElementById('taskProgress');
  prog.textContent = `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

/**
 * Render lokationer i venstre side
 */
const locationList = ["hospital","dokumentation","leverandør","infrastruktur","it‑jura","cybersikkerhed"];
function renderLocations() {
  const locDiv = document.getElementById('locations');
  locDiv.innerHTML = "";
  locationList.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + " " + getIcon(loc);
    btn.addEventListener('click', () => handleLocationClick(loc));
    locDiv.appendChild(btn);
  });
}
renderLocations();

/**
 * Få hjælp-knap i øverste højre hjørne
 */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpTxt = `
    <h2>Få Hjælp</h2>
    <p>Du er IT-forvalter, og hver opgave har flere trin. 
       Avancerede valg giver bedre KPI men koster 2 tid. 
       Hurtige valg koster 0 tid men giver færre KPI-point. 
       Opgaver kan være hastende (10% chance) – vær opmærksom på at du stadig har tid nok!</p>
  `;
  openModal(helpTxt, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/**
 * Intro, SprintGoal, Tutorial
 */
function showIntro() {
  const introHTML = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du er IT-forvalter: tid, sikkerhed og udvikling er dine KPI’er. 
       Opgaver kommer fra Hospital, Cyber eller Infra. 
       Løs 10 opgaver før tiden (30) løber ud, og fasthold KPI’erne over 22!</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

function showSprintGoal() {
  const sprintHTML = `
    <h2>PI Planning</h2>
    <p>Dine KPI-mål: Mindst 22 i sikkerhed og udvikling.
       Du starter med tid 30. Løs 10 opgaver, men husk: 
       Avancerede valg koster mere tid!</p>
  `;
  openModal(sprintHTML, `<button id="continueTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>Tryk "Vælg ny opgave" for at se opgavelisten. 
       Nogle er hastende (10% tilfældigt) – vælg med omhu. 
       Lokationsvalg pr. trin, 
       Avanceret valg: +flere KPI, −2 tid 
       Hurtigt valg: +færre KPI, 0 tid.
       CAB tjekker dine ændringer. Du kan revidere et trin én gang.</p>
  `;
  openModal(tutHTML, `<button id="endTutorial" class="modern-btn">Luk</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

/**
 * Opgavevalg i en tabel
 */
function openTaskSelectionModal() {
  let modalBody = `<h2>Vælg en opgave</h2>
  <table class="task-table" style="width:100%; border-collapse: collapse;">
    <thead>
      <tr>
        <th style="width:25%">Titel</th>
        <th style="width:15%">Opgiver</th>
        <th style="width:20%">Type</th>
        <th style="width:10%">Haster</th>
        <th style="width:30%">Valg</th>
      </tr>
    </thead>
    <tbody>`;

  gameState.tasks.forEach((task, index) => {
    // Opgiver er fx "Hospital", "Cyber", "Infra"
    const opgiver = mapCategoryToOpgiver(task.category);
    const type = (task.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hastende = task.isHastende ? "Ja" : "Nej";

    modalBody += `
      <tr style="border-bottom:1px solid #ddd">
        <td>${task.title}</td>
        <td>${opgiver}</td>
        <td>${type}</td>
        <td>${hastende}</td>
        <td>
          <button class="commit-task-btn modern-btn" data-taskindex="${index}">
            <i class="fas fa-check"></i> Forpligt
          </button>
          <button class="help-task-btn modern-btn" data-taskindex="${index}">
            <i class="fas fa-info-circle"></i> Arkitekthjælp
          </button>
        </td>
      </tr>
    `;
  });

  modalBody += `</tbody></table>`;

  const modalFooter = `<button id="closeTaskSelection" class="modern-btn">Luk</button>`;
  openModal(modalBody, modalFooter);

  // Luk
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

// Knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Kort mapper
function mapCategoryToOpgiver(cat) {
  if (!cat) return "Ukendt";
  switch(cat.toLowerCase()) {
    case 'hospital': return 'Hospital';
    case 'cyber': return 'Cybersikkerhed';
    case 'infra': return 'Infrastruktur';
    default: return 'Andet';
  }
}

// Start opgave
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;

  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;

  renderActiveTask(task);
  closeModal(); // Luk opgavevalgs-modal
}

/**
 * Viser den aktive opgave i højre side
 */
function renderActiveTask(task) {
  const activeTaskDiv = document.getElementById('activeTask');
  activeTaskDiv.innerHTML = `<h2>${task.title}</h2><p>${task.shortDesc}</p>`;

  if (task.steps && task.steps.length > 0) {
    const ul = document.createElement('ul');
    ul.id = 'taskLocations';
    task.steps.forEach((step, idx) => {
      const li = document.createElement('li');
      if (idx < gameState.currentStepIndex) {
        li.innerHTML = `${idx+1}. ${step.location.toUpperCase()} ${getIcon(step.location)} <span class="done">✔</span>`;
      } else {
        li.textContent = `${idx+1}. ${step.location.toUpperCase()} ${getIcon(step.location)}`;
      }
      ul.appendChild(li);
    });
    activeTaskDiv.appendChild(ul);

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
    openModal("<h2>Advarsel</h2><p>Ingen aktiv opgave – vælg en opgave først!</p>", `<button id="alertOk" class="modern-btn">OK</button>`);
    document.getElementById('alertOk').addEventListener('click', () => closeModal());
    return;
  }
  const step = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLocation.toLowerCase() === step.location.toLowerCase()) {
    showStepChoices(step);
  } else {
    openModal(
      `<h2>Forkert Lokation</h2><p>Du valgte ${clickedLocation.toUpperCase()}, men skal til ${step.location.toUpperCase()}.</p>`,
      `<button id="errOk" class="modern-btn">OK</button>`
    );
    document.getElementById('errOk').addEventListener('click', () => closeModal());
  }
}

// Viser step-valg
function showStepChoices(step) {
  // ...
  // (Koden for showStepChoices fra tidligere – med Fortryd, Arkitekthjælp, Choice A/B)
  // Bare for at alt er samlet, gentager vi:
  const body = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  
  let choiceATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let choiceBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === 'sikkerhed') {
    choiceATxt = choiceATxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    choiceBTxt = choiceBTxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }
  
  let footer = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${choiceATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${choiceBTxt})</button>
    <button id="architectHelp" class="modern-btn">${gameState.architectHelpUsed ? 'Arkitekthjælp brugt' : 'Brug Arkitekthjælp'}</button>
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
    const modA = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(modA);
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
    const modB = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(modB);
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
      let hint = "Avanceret valg giver bedre KPI men koster mere tid (2).";
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

function proceedToNextStep() {
  const t = gameState.currentTask;
  if (gameState.currentStepIndex < t.steps.length - 1) {
    gameState.currentStepIndex++;
    renderActiveTask(t);
  } else {
    cabApproval();
  }
}

function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      gameState.security >= gameState.missionGoals.security &&
      gameState.development >= gameState.missionGoals.development) {
    openModal("<h2>Tiden er opbrugt!</h2><p>KPI-mål er nået, men du mangler 10 opgaver.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du nåede 10 opgaver, men KPI’erne er ikke nået.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Både opgaver og KPI’er er utilstrækkelige.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter.</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB - med rework
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
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced === true);
    const approvalPct = allAdvanced ? 100 : Math.floor((focusKPI / missionGoal)*100);
    const riskPct = 100 - approvalPct;

    const cabHTML = `
      <h2>CAB (Change Advisory Board)</h2>
      <p>Godkendelsesprocent: ${approvalPct}%</p>
      <p>Risiko for afvisning: ${riskPct}%</p>
    `;
    let btns = `<button id="evaluateCAB" class="modern-btn">Evaluér nu</button>`;
    if (!allAdvanced) {
      btns += ` <button id="goBackCAB" class="modern-btn">Gå tilbage</button>`;
    }
    openModal(cabHTML, btns);

    document.getElementById('evaluateCAB').addEventListener('click', () => {
      let chance = allAdvanced ? 1 : Math.min(1, focusKPI/missionGoal);
      if (Math.random() < chance) {
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
    if (!allAdvanced) {
      document.getElementById('goBackCAB').addEventListener('click', showRevisionOptions);
    }
  });
}

// Revision
function showRevisionOptions() {
  let revisable = [];
  for (let i=0; i<gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] &&
        gameState.choiceHistory[i].advanced === false &&
        gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRevOk" class="modern-btn">OK</button>`);
    document.getElementById('noRevOk').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  let revHTML = "<h2>Vælg et trin at revidere</h2><ul>";
  revisable.forEach(idx => {
    let desc = gameState.currentTask.steps[idx].stepDescription;
    revHTML += `<li><button class="revisionBtn modern-btn" data-idx="${idx}">Trin ${idx+1}: ${desc}</button></li>`;
  });
  revHTML += "</ul>";

  openModal(revHTML, "");
  document.querySelectorAll('.revisionBtn').forEach(btn => {
    btn.addEventListener('click', e => {
      let chosen = parseInt(e.target.getAttribute('data-idx'));
      gameState.revisionMode = true;
      gameState.revisionCount[chosen]++;
      closeModal(() => {
        gameState.currentStepIndex = chosen;
        showStepChoices(gameState.currentTask.steps[chosen]);
      });
    });
  });
}

/**
 * Opsummering - slut
 */
function showTaskSummary() {
  let sumHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      sumHTML += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  sumHTML += "</ul>";
  openModal(sumHTML, `<button id="continueAfterSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueAfterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="finishOk" class="modern-btn">OK</button>`);
  document.getElementById('finishOk').addEventListener('click', () => {
    closeModal(() => {
      // Fjern opgaven
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      // Tilføj 1-2 nye
      const newly = gameState.allTasks.splice(0,2);
      gameState.tasks = gameState.tasks.concat(newly);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

// "Vælg ny opgave"-knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Start spil – Intro
showIntro();

// Eksporter alt, hvis du skal bruge det i andre moduler
export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
