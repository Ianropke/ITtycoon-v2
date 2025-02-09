// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

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
  choiceHistory: [],
  revisionCount: [],
  revisionMode: false
};

// 1) Saml opgaver
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
// 2) Bland
shuffleArray(gameState.allTasks);
// 3) Tag 7
gameState.tasks = gameState.allTasks.splice(0, 7);
// 4) Tildel 10% opgaver "isHastende"
assignRandomHastende(gameState.tasks);

function assignRandomHastende(opgListe) {
  opgListe.forEach(opg => {
    // 10% chance
    opg.isHastende = Math.random() < 0.1;
  });
}

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
  options: { scales: { y: { beginAtZero: true } } }
});

function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [gameState.time, gameState.security, gameState.development];
  kpiChart.update();
}

function updateTaskProgress() {
  document.getElementById('taskProgress').textContent = `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

/**
 * Render lokationer (venstre side)
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
 * Hjælp-knap (øverste højre)
 */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpTxt = `
    <h2>Få Hjælp</h2>
    <p>Balancér Tid (30), Sikkerhed og Udvikling. 
       Vælg opgaver med omhu. 
       Avancerede valg: −2 tid, +flere KPI. 
       Hurtige valg: 0 tid, +færre KPI.  
       Opnå 10 opgaver, mindst 22 i KPI før tiden udløber!</p>
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
    <p>Du er IT-forvalter i en kompleks organisation. 
       Nogle opgaver er hastende, men du har kun 30 tid. 
       Sikkerhed og Udvikling skal helst over 22, 
       og du skal nå 10 opgaver.</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

function showSprintGoal() {
  const sprintHTML = `
    <h2>PI Planning</h2>
    <p>Når du løser en opgave, skal du vælge trin-lokation. 
       Avanceret valg giver bedre KPI men koster tid. 
       Hurtige valg sparer tid, men giver færre KPI. 
       Du har brug for 10 opgaver og mindst 22 i Sikkerhed/ Udvikling.</p>
  `;
  openModal(sprintHTML, `<button id="continueTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>1) Klik “Vælg ny opgave”. 
       2) Forpligt dig til en opgave, 
       3) Gennemfør trin ved at klikke på lokationer. 
       4) Til sidst evaluerer CAB dine ændringer.</p>
    <p>Du kan revidere et trin én gang, hvis du valgte den hurtige løsning men fortryder.</p>
  `;
  openModal(tutHTML, `<button id="endTutorial" class="modern-btn">Luk</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

/**
 * Opgavevalg i en tabel. 
 * Hvis man allerede har en opgave, afvises "ny opgave".
 * Hvis mindst én opgave er hastende, vises en note øverst.
 * Tryk på "Arkitekthjælp" åbner en sub-pop op, 
 * hvorefter vi genskaber opgavevalgslisten.
 */
function openTaskSelectionModal() {
  // Tjek om man allerede har forpligtet sig:
  if (gameState.currentTask) {
    openModal(
      "<h2>Advarsel</h2><p>Du har allerede en aktiv opgave. Fuldfør den først!</p>",
      `<button id="alertOpgave" class="modern-btn">OK</button>`
    );
    document.getElementById('alertOpgave').addEventListener('click', () => closeModal());
    return;
  }

  // Byg tabellen
  let harHastende = false;
  let tableBody = "";
  gameState.tasks.forEach((task, index) => {
    const type = (task.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hastTxt = task.isHastende ? "Ja" : "Nej";
    if (task.isHastende) harHastende = true;

    tableBody += `
      <tr style="border-bottom:1px solid #ddd;">
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hastTxt}</td>
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

  let hastendeNote = harHastende ? `
    <div style="background-color:#ffe9e9; border:1px solid #f00; padding:1rem; margin-bottom:1rem;">
      <strong>Hastende Opgaver!</strong>
      <p>Der er mindst én hastende opgave i listen. 
         Det kan være vigtigt at reagere i tide, men husk at dit tidforbrug ikke må løbe løbsk.</p>
    </div>
  ` : "";

  // Indhold i modalen
  let modalBody = `
    <h2>Vælg en opgave</h2>
    ${hastendeNote}
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr>
          <th style="width:25%">Titel</th>
          <th style="width:25%">Type</th>
          <th style="width:10%">Haster</th>
          <th style="width:40%">Valg</th>
        </tr>
      </thead>
      <tbody>
        ${tableBody}
      </tbody>
    </table>
  `;

  openModal(modalBody, `<button id="closeTaskModal" class="modern-btn">Luk</button>`);

  document.getElementById('closeTaskModal').addEventListener('click', () => closeModal());

  // Forpligt + Arkitekthjælp
  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-taskindex');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        startTask(chosenTask);
      }
    });
  });

  document.querySelectorAll('.help-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-taskindex');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        // Vis Arkitekthjælp i en "under-popup"
        openModal(
          `<h2>Arkitekthjælp</h2>
           <p><strong>${chosenTask.title}</strong></p>
           <p>${chosenTask.narrativeIntro || "Ingen ekstra info"}</p>`,
          `<button id="closeHelpModal" class="modern-btn">Luk</button>`
        );
        document.getElementById('closeHelpModal').addEventListener('click', () => {
          // Luk "under-pop up" og genskab opgavelisten
          closeModal(() => {
            openTaskSelectionModal();
          });
        });
      }
    });
  });
}

// Knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * Start en opgave
 */
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;

  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;

  closeModal(); // Luk opgavevalgsmodal
  renderActiveTask(task);
}

function renderActiveTask(task) {
  const activeDiv = document.getElementById('activeTask');
  activeDiv.innerHTML = `<h2>${task.title}</h2><p>${task.shortDesc}</p>`;

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
    activeDiv.appendChild(ul);

    const currentStep = task.steps[gameState.currentStepIndex];
    const instruction = document.createElement('p');
    instruction.innerHTML = `<strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}`;
    activeDiv.appendChild(instruction);
  }
}

/**
 * Lokationsklik
 */
function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Ingen aktiv opgave</h2><p>Vælg først en opgave.</p>", `<button id="noOpgBtn" class="modern-btn">OK</button>`);
    document.getElementById('noOpgBtn').addEventListener('click', () => closeModal());
    return;
  }
  const step = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLoc.toLowerCase() === step.location.toLowerCase()) {
    showStepChoices(step);
  } else {
    openModal(
      `<h2>Forkert Lokation</h2><p>Du valgte ${clickedLoc.toUpperCase()}, men ${step.location.toUpperCase()} kræves.</p>`,
      `<button id="wrongLocBtn" class="modern-btn">OK</button>`
    );
    document.getElementById('wrongLocBtn').addEventListener('click', () => closeModal());
  }
}

/**
 * Stepvalg
 */
function showStepChoices(step) {
  let body = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");

  if (gameState.currentTask.focus === 'sikkerhed') {
    cATxt = cATxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    cBTxt = cBTxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }

  let footer = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
    <button id="architectHelp" class="modern-btn">${gameState.architectHelpUsed ? "Arkitekthjælp brugt" : "Brug Arkitekthjælp"}</button>
  `;
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footer += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }

  openModal(body, footer);

  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
      gameState.revisionMode = true;
      closeModal(() => showStepChoices(step));
    });
  }
  document.getElementById('choiceA').addEventListener('click', () => {
    const advancedChoice = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(advancedChoice);
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
  document.getElementById('choiceB').addEventListener('click', () => {
    const quickChoice = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(quickChoice);
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
  document.getElementById('architectHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      const hint = "Den avancerede løsning er bedst for KPI, men koster tid (2).";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="closeArch" class="modern-btn">Luk</button>`
      );
      document.getElementById('closeArch').addEventListener('click', () => closeModal(() => showStepChoices(step)));
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

/**
 * proceedToNextStep
 */
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
    openModal("<h2>Tiden er opbrugt!</h2><p>Men du mangler stadig 10 opgaver.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du klarede 10 opgaver, men KPI’erne er ikke nået.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>For få opgaver og KPI’er for lavt.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter her!</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB + rework
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

function showRevisionOptions() {
  let revisable = [];
  for (let i=0; i<gameState.choiceHistory.length; i++){
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er avancerede eller revideret.</p>", `<button id="revOk" class="modern-btn">OK</button>`);
    document.getElementById('revOk').addEventListener('click', () => closeModal(() => cabApproval()));
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

function showTaskSummary() {
  let sumHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      sumHTML += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  sumHTML += "</ul>";

  openModal(sumHTML, `<button id="afterSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('afterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="finOk" class="modern-btn">OK</button>`);
  document.getElementById('finOk').addEventListener('click', () => {
    closeModal(() => {
      // Fjern opgaven
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      // Tilføj 1-2 nye
      const newOnes = gameState.allTasks.splice(0,2);
      gameState.tasks = gameState.tasks.concat(newOnes);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

// Knap "Vælg ny opgave"
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Start spillet
showIntro();

// Eksporter – hvis du bruger det i andre filer
export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
