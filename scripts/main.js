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

// 1) Hent opgaver
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
// 2) Bland dem
shuffleArray(gameState.allTasks);
// 3) Tag 7
gameState.tasks = gameState.allTasks.splice(0, 7);
// 4) Giv 10% opgaver "isHastende: true"
assignRandomHastende(gameState.tasks);

function assignRandomHastende(opgListe) {
  opgListe.forEach(opg => {
    opg.isHastende = (Math.random() < 0.1);
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
  kpiChart.data.datasets[0].data = [
    gameState.time,
    gameState.security,
    gameState.development
  ];
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
 * Hjælp-knap i øverste højre
 */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpContent = `
    <h2>Få Hjælp</h2>
    <p>
      Balancér Tid, Sikkerhed og Udvikling. 
      Avancerede valg: koster 2 tid, men giver flere KPI. 
      Hurtige valg: 0 tid, færre KPI. 
      Løs 10 opgaver, nå mindst 22 i dine KPI’er, 
      før Tid (30) bliver 0.<br><br>
      Nogle opgaver er <em>hastende</em>. 
      Det giver +4 bonus i (sikkerhed/udvikling) hvis CAB godkender, 
      men samtidig +10% ekstra risiko for afvisning!
    </p>
  `;
  openModal(helpContent, `<button id="helpClose" class="modern-btn">Luk</button>`);
  document.getElementById('helpClose').addEventListener('click', () => closeModal());
}

/**
 * Intro, SprintGoal, Tutorial
 */
function showIntro() {
  const introHTML = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du er IT-forvalter i en stor organisation. 
       Nogle opgaver er hastende (giv bonus men øger afvisningsrisiko),
       og du har kun 30 tid. Sikkerhed og Udvikling skal over 22, 
       samtidig med at du løser 10 opgaver!</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

function showSprintGoal() {
  const sprintHTML = `
    <h2>PI Planning</h2>
    <p>Opnå mindst 22 i Sikkerhed og Udvikling, 
       gennemfør 10 opgaver før Tid (30) ender. 
       Avancerede valg koster mere tid men giver bedre KPI, 
       og hastende opgaver har 10% ekstra risiko for CAB-afvisning, 
       men giver +4 bonus i KPI ved succes.</p>
  `;
  openModal(sprintHTML, `<button id="toTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('toTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>
      1) “Vælg ny opgave” for at se liste<br>
      2) Forpligt en opgave<br>
      3) Gennemfør trin ved at klikke på lokationer 
         og vælge avanceret vs. hurtig løsning<br>
      4) CAB evaluerer dine ændringer
    </p>
    <p>Held og lykke!</p>
  `;
  openModal(tutHTML, `<button id="tutorialClose" class="modern-btn">Luk</button>`);
  document.getElementById('tutorialClose').addEventListener('click', () => closeModal());
}

/**
 * Opgavevalg – i en tabel. 
 * Hvis en opgave er hastende => spiller ser “Ja” i “Haster”-kolonnen.
 * Kan ikke åbnes hvis man allerede har en aktiv opgave.
 */
function openTaskSelectionModal() {
  // 1) Check om man allerede har en aktuel opgave
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave. Fuldfør den først!</p>", `<button id="activeWarn" class="modern-btn">OK</button>`);
    document.getElementById('activeWarn').addEventListener('click', () => closeModal());
    return;
  }

  // 2) Byg en table
  let tableRows = "";
  gameState.tasks.forEach((task, index) => {
    const type = (task.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hast = task.isHastende ? "Ja" : "Nej";

    tableRows += `
      <tr style="border-bottom:1px solid #ddd;">
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hast}</td>
        <td>
          <button class="commit-task-btn modern-btn" data-idx="${index}"><i class="fas fa-check"></i> Forpligt</button>
          <button class="help-task-btn modern-btn" data-idx="${index}"><i class="fas fa-info-circle"></i> Arkitekthjælp</button>
        </td>
      </tr>
    `;
  });

  let modalBody = `
    <h2>Vælg en opgave</h2>
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
        ${tableRows}
      </tbody>
    </table>
  `;

  openModal(modalBody, `<button id="closeOpgaveModal" class="modern-btn">Luk</button>`);

  document.getElementById('closeOpgaveModal').addEventListener('click', () => closeModal());

  // Forpligt og Arkitekthjælp
  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        startTask(chosenTask);
      }
    });
  });

  document.querySelectorAll('.help-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        // Lav en under-pop-up for Arkitekthjælp
        openModal(
          `<h2>Arkitekthjælp</h2>
           <p><strong>${chosenTask.title}</strong></p>
           <p>${chosenTask.narrativeIntro || "Ingen ekstra info"}</p>`,
          `<button id="closeArkHelp" class="modern-btn">Luk</button>`
        );
        document.getElementById('closeArkHelp').addEventListener('click', () => {
          closeModal(() => openTaskSelectionModal());
        });
      }
    });
  });
}

// “Vælg ny opgave”-knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * startTask
 */
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;

  closeModal(); // Luk opgavelisten
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
    const instr = document.createElement('p');
    instr.innerHTML = `<strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}`;
    activeDiv.appendChild(instr);
  }
}

/**
 * Lokationsklik
 */
function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Ingen aktiv opgave</h2><p>Vælg en opgave først!</p>", `<button id="noTaskBtn" class="modern-btn">OK</button>`);
    document.getElementById('noTaskBtn').addEventListener('click', () => closeModal());
    return;
  }
  const st = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLoc.toLowerCase() === st.location.toLowerCase()) {
    showStepChoices(st);
  } else {
    openModal(
      `<h2>Forkert lokation</h2><p>Du valgte ${clickedLoc.toUpperCase()}, men skal bruge ${st.location.toUpperCase()}.</p>`,
      `<button id="locErrBtn" class="modern-btn">OK</button>`
    );
    document.getElementById('locErrBtn').addEventListener('click', () => closeModal());
  }
}

/**
 * Step-valg
 */
function showStepChoices(step) {
  let body = `<h2>${step.stepDescription}</h2>${step.stepContext || ''}`;
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === 'sikkerhed') {
    cATxt = cATxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    cBTxt = cBTxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }

  let foot = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
    <button id="architectHelp" class="modern-btn">${gameState.architectHelpUsed ? "Arkitekthjælp brugt" : "Brug Arkitekthjælp"}</button>
  `;
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    foot += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }

  openModal(body, foot);

  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
      gameState.revisionMode = true;
      closeModal(() => showStepChoices(step));
    });
  }
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
  document.getElementById('architectHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      const hint = "Avanceret valg giver bedre KPI men koster tid.";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="archClose" class="modern-btn">Luk</button>`
      );
      document.getElementById('archClose').addEventListener('click', () => closeModal(() => showStepChoices(step)));
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

/**
 * checkGameOverCondition
 */
function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      (gameState.security >= gameState.missionGoals.security) &&
      (gameState.development >= gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Men du mangler stadig at fuldføre 10 opgaver.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             ((gameState.security < gameState.missionGoals.security) ||
              (gameState.development < gameState.missionGoals.development))) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du nåede 10 opgaver, men KPI’erne er ikke tilstrækkelige.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             ((gameState.security < gameState.missionGoals.security) ||
              (gameState.development < gameState.missionGoals.development))) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Både antallet af opgaver og KPI er utilstrækkeligt.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter nu!</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB + rework
 * - 10% ekstra risiko hvis isHastende
 */
function cabApproval() {
  closeModal(() => {
    const t = gameState.currentTask;
    let focusKPI, missionGoal;
    if (t.focus === 'sikkerhed') {
      focusKPI = gameState.security;
      missionGoal = gameState.missionGoals.security;
    } else {
      focusKPI = gameState.development;
      missionGoal = gameState.missionGoals.development;
    }
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced === true);

    // Normal chance for godkendelse
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);

    // Hastende? => 10% ekstra risiko => chance -= 0.1
    let extraRiskNote = "";
    if (t.isHastende) {
      chance -= 0.1;  // 10% ekstra risiko
      if (chance < 0) chance = 0;
      extraRiskNote = `<p style="color:red;">Denne opgave er HASTENDE: +10% afvisningsrisiko men giver +4 bonus i KPI ved succes!</p>`;
    }
    const approvalPct = Math.floor(chance * 100);
    const riskPct = 100 - approvalPct;

    const cabHTML = `
      <h2>CAB (Change Advisory Board)</h2>
      ${extraRiskNote}
      <p>Godkendelsesprocent: ${approvalPct}%</p>
      <p>Risiko for afvisning: ${riskPct}%</p>
    `;
    let btns = `<button id="evaluateCAB" class="modern-btn">Evaluér nu</button>`;
    if (!allAdvanced) {
      btns += ` <button id="goBackCAB" class="modern-btn">Gå tilbage</button>`;
    }

    openModal(cabHTML, btns);

    document.getElementById('evaluateCAB').addEventListener('click', () => {
      if (Math.random() < chance) {
        showTaskSummary();
      } else {
        openModal("<h2>CAB Afvisning</h2><p>Rework koster 3 tidspoint.</p>", `<button id="reworkTime" class="modern-btn">OK</button>`);
        document.getElementById('reworkTime').addEventListener('click', () => {
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
  for (let i=0; i<gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er avancerede eller allerede revideret.</p>", `<button id="noRev" class="modern-btn">OK</button>`);
    document.getElementById('noRev').addEventListener('click', () => closeModal(() => cabApproval()));
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

/**
 * showTaskSummary
 * - Tilføj bonus +4 i KPI, hvis isHastende og godkendt.
 */
function showTaskSummary() {
  // Hvis opgaven er hastende, giv +4 i relevant KPI
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === 'sikkerhed') {
      gameState.security += 4;
      bonusNote = "<p style='color:green;'>Hastende bonus: +4 Sikkerhed!</p>";
    } else {
      gameState.development += 4;
      bonusNote = "<p style='color:green;'>Hastende bonus: +4 Udvikling!</p>";
    }
    updateDashboard();
  }

  let sumHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      sumHTML += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  sumHTML += "</ul>";
  sumHTML += bonusNote; // Vis bonus for hastende

  openModal(sumHTML, `<button id="finishTask" class="modern-btn">Fortsæt</button>`);
  document.getElementById('finishTask').addEventListener('click', () => closeModal(() => finishTask()));
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="finOk" class="modern-btn">OK</button>`);
  document.getElementById('finOk').addEventListener('click', () => {
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

// Start spillet
showIntro();

export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
