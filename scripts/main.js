// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

/**
 * GLOBAL STATE
 */
const gameState = {
  time: 30,
  security: 0,
  development: 0,
  currentTask: null,         // Den opgave, der er aktiv
  currentStepIndex: 0,
  tasksCompleted: 0,
  missionGoals: { security: 22, development: 22 },
  architectHelpUsed: false,
  allTasks: [],
  tasks: [],
  choiceHistory: [],         // fx. [{ title: 'Avanceret...', advanced: true }, ...]
  revisionCount: [],         // Antal revideringer pr. trin
  revisionMode: false
};

/**
 * HENT OPGAVER
 */
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
shuffleArray(gameState.allTasks);
gameState.tasks = gameState.allTasks.splice(0, 7);

/**
 * TILFÆLDIGT TILDELT "HASTENDE" (10% chance)
 */
function assignRandomHastende(taskArray) {
  taskArray.forEach(t => {
    t.isHastende = (Math.random() < 0.1);
  });
}
assignRandomHastende(gameState.tasks);

/**
 * CHART.JS – KPI GRAF
 */
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
  document.getElementById('taskProgress').textContent =
    `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

/**
 * RENDER LOKATIONER (venstre side)
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
 * 1) Introduktion – En grundig og levende introduktion
 */
function showIntro() {
  const introHTML = `
    <h2>Introduktion</h2>
    <p><em>Velkommen til IT‑Tycoon!</em> Du træder ind i rollen som IT‑forvalter i en verden, 
       hvor hospitaler, infrastruktur og cybersikkerhed smelter sammen under konstant pres. 
       Tiden er din mest knappe ressource, og hvert sekund tæller, når du skal sikre stabil drift, 
       høje sikkerhedsstandarder og innovative løsninger.</p>
    <p>Forestil dig et hospital, der vil have en ny patientjournal, en leverandør, der sender 
       kritiske sikkerhedsopdateringer, og en compliance-afdeling, der kræver dokumentation – alt imens 
       globale cyberangreb truer. Du skal balancere KPI’erne Tid, Sikkerhed og Udvikling og håndtere CAB-godkendelser. 
       Er du klar til at tage de rigtige valg?</p>
    <p>Kaffe i hånden, deadlines i sigte – lad os begynde!</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => 
    closeModal(() => showSprintGoal())
  );
}

/**
 * 2) Hjælpetekst – En grundig forklaring af mekanismer og logik
 */
function showHelp() {
  const helpContent = `
    <h2>Hjælp</h2>
    <p><strong>Velkommen til spillet!</strong> Her er, hvad du skal vide for at komme i gang:</p>
    <p><strong>Opgaver og Trin:</strong><br>
       Du vælger opgaver fra en liste. Hver opgave består af flere trin, og du skal finde den rigtige lokation 
       (fx hospital, infrastruktur, etc.). Når du vælger lokationen korrekt, står du over for to valg:
       <ul>
         <li><em>Avanceret løsning</em> – koster 2 tid, men giver større løft i KPI</li>
         <li><em>Hurtig løsning</em> – koster 0 tid, men giver et mindre løft</li>
       </ul>
    </p>
    <p><strong>Tid, Sikkerhed og Udvikling:</strong><br>
       Du starter med 30 tid. Avancerede valg bruger tid, men øger dine KPI. Målet er at opnå mindst 22 
       i Sikkerhed og Udvikling.</p>
    <p><strong>Hastende Opgaver:</strong><br>
       Nogle opgaver er markeret “Haster!”. Disse opgaver giver +4 bonus i KPI ved succesfuld CAB-godkendelse 
       men øger samtidig risikoen for afvisning med 10%.</p>
    <p><strong>CAB-godkendelse:</strong><br>
       Når opgaven er fuldført, evaluerer CAB dine ændringer. Avancerede valg øger godkendelseschancen, 
       men hastende opgaver sænker den en smule. Er dine valg solide, får du dine ændringer godkendt – ellers skal du lave rework.</p>
    <p><strong>Revidering:</strong><br>
       Du kan revidere ét trin én gang, hvis du ønsker at opgradere fra en hurtig løsning til en avanceret løsning.</p>
    <p>Held og lykke!</p>
  `;
  openModal(helpContent, `<button id="closeHelpBtn" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelpBtn').addEventListener('click', () => closeModal());
}

/**
 * 3) PI Planning – En levende forklaring af målsætninger
 */
function showSprintGoal() {
  const piText = `
    <h2>PI Planning</h2>
    <p>I SAFe-verdenen begynder alt med en PI Planning-session, hvor du sætter de overordnede mål. 
       Dit mål er at opnå mindst 22 i Sikkerhed og Udvikling, samtidig med at du gennemfører 10 opgaver, 
       før tiden (30) løber ud.</p>
    <p>Hospitalet vil have nye IT-systemer, cybersikkerhedsteamet skal beskytte dem, og infrastrukturfolkene vil styrke netværket. 
       Du skal beslutte, om du vil investere ekstra tid i avancerede løsninger eller vælge den hurtige vej med lavere KPI.</p>
    <p>Når alle opgaver er gennemført, evaluerer CAB dine ændringer – er du klar til udfordringen?</p>
  `;
  openModal(piText, `<button id="toTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('toTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>
      1) Klik “Vælg ny opgave” for at se opgavelisten.<br>
      2) Forpligt dig til en opgave, og gennemfør dens trin ved at vælge den rigtige lokation og løsning.<br>
      3) Avancerede valg koster 2 tid, men giver flere KPI-point – hurtige valg koster 0 tid.<br>
      4) Hastende opgaver giver +4 bonus i KPI ved succes, men øger risikoen for CAB-afvisning med 10%.<br>
      5) Når opgaven er færdig, evaluerer CAB dine valg. Du kan revidere ét trin én gang.
    </p>
    <p>God fornøjelse!</p>
  `;
  openModal(tutHTML, `<button id="closeTut" class="modern-btn">Luk</button>`);
  document.getElementById('closeTut').addEventListener('click', () => closeModal());
}

/**
 * Opgavevalg – i en tabel (uden "Opgiver"-kolonne)
 * Hvis der allerede er en aktiv opgave, vis en advarsel.
 * Hvis mindst én opgave er hastende, vises en note øverst.
 */
function openTaskSelectionModal() {
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave. Fuldfør den først!</p>", `<button id="warnBtn" class="modern-btn">OK</button>`);
    document.getElementById('warnBtn').addEventListener('click', () => closeModal());
    return;
  }

  let harHastende = false;
  let tableRows = "";
  gameState.tasks.forEach((task, idx) => {
    const type = (task.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hast = task.isHastende ? "Ja" : "Nej";
    if (task.isHastende) harHastende = true;
    tableRows += `
      <tr style="border-bottom:1px solid #ddd;">
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hast}</td>
        <td>
          <button class="commit-task-btn modern-btn" data-idx="${idx}">
            <i class="fas fa-check"></i> Forpligt
          </button>
          <button class="help-task-btn modern-btn" data-idx="${idx}">
            <i class="fas fa-info-circle"></i> Arkitekthjælp
          </button>
        </td>
      </tr>
    `;
  });
  let hastendeNote = harHastende
    ? `<div style="background-color:#ffe9e9; border:1px solid #f00; padding:1rem; margin-bottom:1rem;">
         <strong>Hastende Opgaver!</strong>
         <p>Der er mindst én hastende opgave – disse giver +4 bonus i KPI, men øger afvisningsrisikoen med 10%.</p>
       </div>`
    : "";
  const modalBody = `
    <h2>Vælg en opgave</h2>
    ${hastendeNote}
    <table class="task-table">
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
  openModal(modalBody, `<button id="closeTaskModal" class="modern-btn">Luk</button>`);
  document.getElementById('closeTaskModal').addEventListener('click', () => closeModal());

  // Forpligt
  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) startTask(chosenTask);
    });
  });
  // Arkitekthjælp i opgavevalgsmodalen
  document.querySelectorAll('.help-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const chosenTask = gameState.tasks[idx];
      if (chosenTask) {
        openModal(
          `<h2>Arkitekthjælp</h2>
           <p><strong>${chosenTask.title}</strong></p>
           <p>${chosenTask.narrativeIntro || "Ingen ekstra info."}</p>`,
          `<button id="closeArkHelp" class="modern-btn">Luk</button>`
        );
        // Når under-modal for arkitekthjælp lukkes, genskabes opgavevalgsmodalen
        document.getElementById('closeArkHelp').addEventListener('click', () => 
          closeModal(() => openTaskSelectionModal())
        );
      }
    });
  });
}

document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * startTask – sætter currentTask og lukker opgavevalgsmodalen
 */
function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;
  closeModal();
  renderActiveTask(task);
}

/**
 * renderActiveTask – viser den aktive opgave i højre kolonne
 */
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
 * handleLocationClick – håndterer klik på lokationer
 */
function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Ingen aktiv opgave</h2><p>Vælg en opgave først!</p>", `<button id="noTaskBtn" class="modern-btn">OK</button>`);
    document.getElementById('noTaskBtn').addEventListener('click', () => closeModal());
    return;
  }
  const step = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLoc.toLowerCase() === step.location.toLowerCase()) {
    showStepChoices(step);
  } else {
    openModal(
      `<h2>Forkert lokation</h2><p>Du valgte ${clickedLoc.toUpperCase()}, men skal bruge ${step.location.toUpperCase()}.</p>`,
      `<button id="locErrBtn" class="modern-btn">OK</button>`
    );
    document.getElementById('locErrBtn').addEventListener('click', () => closeModal());
  }
}

/**
 * showStepChoices – håndterer valg for hvert trin
 */
function showStepChoices(step) {
  let body = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === 'sikkerhed') {
    cATxt = cATxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
    cBTxt = cBTxt.replace(/[\+\-]?\d+\s*udvikling/gi, '').trim();
  }
  let foot = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
    <button id="archHelp" class="modern-btn">${gameState.architectHelpUsed ? "Arkitekthjælp brugt" : "Brug Arkitekthjælp"}</button>
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
  document.getElementById('archHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      const hint = "Avanceret valg giver bedre KPI, men koster 2 tid.";
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
    openModal("<h2>Tiden er opbrugt!</h2><p>KPI-målene er nået, men du mangler at fuldføre 10 opgaver.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du fuldførte 10 opgaver, men KPI-målene blev ikke opfyldt.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Både opgavemængde og KPI er utilstrækkelige.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter nu.</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB-approval med rework
 * Hvis opgaven er hastende: -10% chance og +4 bonus i KPI ved succes.
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
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);
    let hastNote = "";
    if (t.isHastende) {
      chance -= 0.1;  // 10% ekstra risiko
      if (chance < 0) chance = 0;
      hastNote = `<p style="color:red;">Hastende opgave: +10% ekstra risiko for CAB-afvisning, men giver +4 bonus i KPI ved succes.</p>`;
    }
    const approvalPct = Math.floor(chance * 100);
    const riskPct = 100 - approvalPct;
    const cabHTML = `
      <h2>CAB (Change Advisory Board)</h2>
      ${hastNote}
      <p>Godkendelsesprocent: ${approvalPct}%</p>
      <p>Risiko for afvisning: ${riskPct}%</p>
    `;
    let foot = `<button id="evaluateCAB" class="modern-btn">Evaluér nu</button>`;
    if (!allAdvanced) {
      foot += ` <button id="goBackCAB" class="modern-btn">Gå tilbage</button>`;
    }
    openModal(cabHTML, foot);
    document.getElementById('evaluateCAB').addEventListener('click', () => {
      if (Math.random() < chance) {
        showTaskSummary();
      } else {
        openModal("<h2>CAB Afvisning</h2><p>Rework koster 3 tidspoint.</p>", `<button id="cabRework" class="modern-btn">OK</button>`);
        document.getElementById('cabRework').addEventListener('click', () => {
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
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er avancerede eller allerede revideret.</p>", `<button id="revNone" class="modern-btn">OK</button>`);
    document.getElementById('revNone').addEventListener('click', () => closeModal(() => cabApproval()));
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
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === 'sikkerhed') {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende Bonus: +4 Sikkerhed</p>`;
    } else {
      gameState.development += 4;
      bonusNote = `<p style="color:green;">Hastende Bonus: +4 Udvikling</p>`;
    }
    updateDashboard();
  }
  let sumHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      sumHTML += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  sumHTML += "</ul>" + bonusNote;
  openModal(sumHTML, `<button id="summaryOk" class="modern-btn">Fortsæt</button>`);
  document.getElementById('summaryOk').addEventListener('click', () => closeModal(() => finishTask()));
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="finOk" class="modern-btn">OK</button>`);
  document.getElementById('finOk').addEventListener('click', () => {
    closeModal(() => {
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      const newTasks = gameState.allTasks.splice(0, 2);
      gameState.tasks = gameState.tasks.concat(newTasks);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

/**
 * Event Listeners for knapper i header og venstre side
 */
document.getElementById('helpButton')?.addEventListener('click', showHelp);
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * START SPILLET: Kør intro
 */
showIntro();

export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
