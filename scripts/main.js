// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

/**
 * gameState holder al global data.
 */
const gameState = {
  time: 30,
  security: 0,
  development: 0,
  currentTask: null,         // Den opgave man pt. er i gang med
  currentStepIndex: 0,
  tasksCompleted: 0,
  missionGoals: { security: 22, development: 22 },
  architectHelpUsed: false,
  allTasks: [],
  tasks: [],                 // De opgaver, der kan vælges i opgavevalg
  choiceHistory: [],         // For hvert trin -> { title, advanced }
  revisionCount: [],         // Antal revideringer pr. trin
  revisionMode: false,
};

// 1) Hent opgaver fra tasks-filer
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
// 2) Bland opgaverne
shuffleArray(gameState.allTasks);
// 3) Tag 7 styk
gameState.tasks = gameState.allTasks.splice(0, 7);
// 4) Giv 10% af opgaverne "isHastende: true"
assignRandomHastende(gameState.tasks);

function assignRandomHastende(opgListe) {
  opgListe.forEach(opg => {
    // 10% chance
    opg.isHastende = Math.random() < 0.1;
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
 * Hjælp-knap i øverste højre
 */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpContent = `
    <h2>Få Hjælp</h2>
    <p>Du er IT-forvalter. Tid (30), sikkerhed, og udvikling skal balanceres.</p>
    <p>Vælg opgaver via "Vælg ny opgave". 
       Nogle er hastende (10% tilfældigt). 
       Avanceret valg: -2 tid, giver flere KPI. 
       Hurtig valg: 0 tid, giver færre KPI.</p>
  `;
  openModal(helpContent, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/**
 * Intro + tutorial
 */
function showIntro() {
  const introHTML = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Din rolle: IT-forvalter under SAFe. 
       Opnå mindst 22 i Sikkerhed og Udvikling, 
       og gennemfør 10 opgaver før Tid (30) løber ud!</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

function showSprintGoal() {
  const sprintHTML = `
    <h2>PI Planning</h2>
    <p>Målsætning: Mindst 22 i Sikkerhed og Udvikling, 
       10 opgaver gennemført, 
       før Tid (30) bliver 0.</p>
  `;
  openModal(sprintHTML, `<button id="continueTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>Tryk "Vælg ny opgave" for at se potentielle opgaver. 
       Hvis en opgave er hastende, vises "Haster!" – vær opmærksom på dit tidforbrug. 
       Avancerede valg koster 2 tid, men giver bedre KPI. 
       CAB godkender til sidst. 
       Du kan revidere et trin én gang.</p>
  `;
  openModal(tutHTML, `<button id="endTutorial" class="modern-btn">Luk</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal());
}

/**
 * Opgavevalg i en tabel
 */
function openTaskSelectionModal() {
  // 1) Tjek om vi allerede har en currentTask.
  //    Hvis ja, spilleren må IKKE få ny opgave:
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede forpligtet dig til en opgave. Fuldfør den først!</p>", `<button id="okWarn" class="modern-btn">OK</button>`);
    document.getElementById('okWarn').addEventListener('click', () => closeModal());
    return;  
  }

  // 2) Konstruer tabellen
  let modalBody = `
    <h2>Vælg en opgave</h2>
    <table class="task-table" style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="width:25%">Titel</th>
          <th style="width:25%">Type</th>
          <th style="width:10%">Haster</th>
          <th style="width:40%">Valg</th>
        </tr>
      </thead>
      <tbody>
  `;

  let harHastende = false; // Tjek om mindst én opgave er hastende

  gameState.tasks.forEach((task, index) => {
    // F.eks. "Sikkerhedsopgave" vs. "Udviklingsopgave"
    const type = (task.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hastendeTekst = task.isHastende ? "Ja" : "Nej";
    if (task.isHastende) {
      harHastende = true;
    }

    modalBody += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hastendeTekst}</td>
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

  document.getElementById('closeTaskSelection').addEventListener('click', () => closeModal());

  // 3) Tjek om der er hastende opgaver -> popup med forklaring
  if (harHastende) {
    openModal(
      `<h2>Hastende Opgaver</h2>
       <p>Der er mindst én hastende opgave i listen. Hastende opgaver kan være vigtige at håndtere hurtigt,
          men pas på at du ikke bruger for meget tid.</p>`,
      `<button id="hastOk" class="modern-btn">OK</button>`
    );
    document.getElementById('hastOk').addEventListener('click', () => closeModal(() => {
      // Returnér til opgavevalgsmodalen
      // Simpel måde: kald openTaskSelectionModal() igen
      // men i dette eksempel vil du blot lukke popuppen,
      // og "baggrundsmodalen" er stadig åben,
      // så intet ekstra kald er nødvendigt
    }));
  }

  // 4) Arkitekthjælp og Forpligt
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
        openModal(
          `<h2>Arkitekthjælp</h2>
           <p><strong>${chosenTask.title}</strong></p>
           <p>${chosenTask.narrativeIntro || "Ingen ekstra info."}</p>`,
          `<button id="closeTaskHelp" class="modern-btn">Luk</button>`
        );
        // *Behold opgavevalgsmodalen åben* – 
        // Vi lukker sub-modal med arkitekthjælp, og gendanner opgavevalgsmodalen
        document.getElementById('closeTaskHelp').addEventListener('click', () =>
          closeModal(() => {
            // Genvind opgavevalgsmodalen
            openTaskSelectionModal();
          })
        );
      }
    });
  });
}

// "Vælg ny opgave"-knap
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * Start en opgave
 */
function startTask(task) {
  // Sæt currentTask, opret choiceHistory mv.
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;

  // Luk opgavevalgmodalen
  closeModal();
  renderActiveTask(task);
}

/**
 * Vis den aktive opgave i højre side
 */
function renderActiveTask(task) {
  const actDiv = document.getElementById('activeTask');
  actDiv.innerHTML = `<h2>${task.title}</h2><p>${task.shortDesc}</p>`;

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
function handleLocationClick(clickedLocation) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har ingen aktiv opgave. Vælg en først!</p>", `<button id="alertNoOpgave" class="modern-btn">OK</button>`);
    document.getElementById('alertNoOpgave').addEventListener('click', () => closeModal());
    return;
  }
  const step = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLocation.toLowerCase() === step.location.toLowerCase()) {
    showStepChoices(step);
  } else {
    openModal(
      `<h2>Fejl</h2><p>Du valgte ${clickedLocation.toUpperCase()}, men der kræves ${step.location.toUpperCase()}.</p>`,
      `<button id="wrongLoc" class="modern-btn">OK</button>`
    );
    document.getElementById('wrongLoc').addEventListener('click', () => closeModal());
  }
}

/**
 * Step-valg
 */
function showStepChoices(step) {
  // Samme logik som før, men for fuldstændighed:
  const body = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === 'sikkerhed') {
    cATxt = cATxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    cBTxt = cBTxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }

  let foot = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
    <button id="architectHelp" class="modern-btn">${gameState.architectHelpUsed ? 'Arkitekthjælp brugt' : 'Brug Arkitekthjælp'}</button>
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
    const cA = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(cA);
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
    const cB = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(cB);
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
      const hint = "Avanceret giver bedre KPI men koster tid (2).";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="closeArch" class="modern-btn">Luk</button>`
      );
      document.getElementById('closeArch').addEventListener('click', () => {
        closeModal(() => showStepChoices(step));
      });
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
    openModal("<h2>Tiden er opbrugt!</h2><p>Men du mangler stadig 10 opgaver.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du nåede 10 opgaver, men KPI’erne er ikke nok.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>For få opgaver og utilstrækkelige KPI’er.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter.</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB med rework
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
    const approvalPct = allAdvanced ? 100 : Math.floor((focusKPI / missionGoal) * 100);
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
        // Afvis
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
    if (gameState.choiceHistory[i] &&
        !gameState.choiceHistory[i].advanced &&
        gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="revNoneOk" class="modern-btn">OK</button>`);
    document.getElementById('revNoneOk').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  let listHTML = "<h2>Vælg et trin at revidere</h2><ul>";
  revisable.forEach(idx => {
    let sDesc = gameState.currentTask.steps[idx].stepDescription;
    listHTML += `<li><button class="revisionBtn modern-btn" data-idx="${idx}">Trin ${idx+1}: ${sDesc}</button></li>`;
  });
  listHTML += "</ul>";

  openModal(listHTML, "");
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
 * Opsummering + finish
 */
function showTaskSummary() {
  let sum = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      sum += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  sum += "</ul>";
  openModal(sum, `<button id="continueSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="finishOk" class="modern-btn">OK</button>`);
  document.getElementById('finishOk').addEventListener('click', () => {
    closeModal(() => {
      // Fjern opgaven
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      // Tag 1-2 nye
      const newOnes = gameState.allTasks.splice(0,2);
      gameState.tasks = gameState.tasks.concat(newOnes);

      // Ryd skærmen
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

// Knap "Vælg ny opgave"
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

// Kør intro
showIntro();

export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
