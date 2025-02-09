// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

/** 
 * Global game state
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
  choiceHistory: [],
  revisionCount: [],
  revisionMode: false
};

/**
 * Saml og bland opgaver
 */
gameState.allTasks = [].concat(
  window.hospitalTasks,         // 10 opgaver med focus="udvikling"
  window.infrastrukturTasks,    // 10 opgaver med focus="sikkerhed"
  window.cybersikkerhedTasks    // 10 opgaver med focus="cybersikkerhed" (underforstået "sikkerhed")
);

// Bland dem vilkårligt
shuffleArray(gameState.allTasks);

// Start med at trække 7 styk til “mulige opgaver”
gameState.tasks = gameState.allTasks.splice(0, 7);

/**
 * Tildel ~10% “isHastende” 
 */
function assignRandomHastende(opgListe) {
  opgListe.forEach(t => {
    t.isHastende = (Math.random() < 0.1); 
  });
}
assignRandomHastende(gameState.tasks);

/**
 * Chart.js
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
 * Hjælp-knap
 */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpHTML = `
    <h2>Hjælp</h2>
    <p>
      <strong>Overordnet Spilkoncept:</strong><br/>
      I IT‑Tycoon navigerer du i et omfattende IT-landskab. Hver opgave har 
      3-6 trin med unikke lokationer og til sidst et dokumentations-trin. 
      Du starter med 30 i Tid og skal balancere dine valg: 
      Avancerede valg (Choice A) giver større KPI-gevinst, men koster 2 i Tid; 
      Hurtige valg (Choice B) koster ingen tid, men giver mindre KPI-stigning.
    </p>
    <p>
      <strong>Spillets Struktur:</strong><br/>
      - Opgaver: Vælg en opgave, gennemfør trin ved korrekt lokation.<br/>
      - Avanceret valg (Choice A): koster 2 tid, men giver flere KPI.<br/>
      - Hurtigt valg (Choice B): koster 0 tid, men giver færre KPI.<br/>
      - Hastende Opgaver: +4 bonus hvis succes, men +10% ekstra risiko for CAB-afvisning.<br/>
      - Rework-straf: 1 tid, hvis en opgave afvises af CAB.
    </p>
    <p>
      <strong>Flow & Arkitekthjælp:</strong><br/>
      Du kan klikke “Vælg ny opgave” for at se potentielle opgaver. 
      Når du forpligter dig til en opgave, skal du gennemføre alle trin. 
      Arkitekthjælp viser anbefalede valg og om opgaven er “udvikling” eller “sikkerhed”. 
      Husk dog at arkitekthjælp kun kan bruges én gang per opgave.
    </p>
    <p>
      <strong>Tips:</strong><br/>
      - Hold øje med Tiden (30). Avanceret valg bruger 2 tid.<br/>
      - Du skal gennemføre 10 opgaver og nå 22 i både Sikkerhed og Udvikling 
        inden tiden løber ud.<br/>
      - Hvis CAB afviser en opgave, mister du 1 tid til rework, 
        så vælg dine trin med omhu!
    </p>
    <p>
      God fornøjelse med IT‑Tycoon!
    </p>
  `;
  openModal(helpHTML, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/**
 * 1) Intro
 */
function showIntro() {
  const introText = `
    <h2>Introduktion</h2>
    <p>
      <em>Velkommen til IT‑Tycoon!</em><br/>
      I dette spil agerer du IT‑forvalter under SAFe-metodens principper, 
      hvor du skal balancere tre primære KPI’er: Tid, Sikkerhed og Udvikling. 
      Din opgave er at nå mindst 22 i både Sikkerhed og Udvikling,
      og samtidig gennemføre 10 opgaver, inden din Tid (30) løber tør.
    </p>
    <p>
      Undervejs kan du møde Hastende opgaver, som giver en ekstra bonus 
      på +4 i den pågældende KPI, men også en øget risiko (+10%) for 
      at opgaven afvises af CAB. Hvis opgaven afvises, skal du bruge 1 
      ekstra tid på rework. 
    </p>
    <p>
      Hver opgave har trin, hvor du skal vælge korrekt lokation og 
      dernæst beslutte om du tager et Avanceret (2 tid) eller Hurtigt (0 tid) valg. 
      Avanceret valg giver større KPI, men bruger mere Tid.
      Hurtigt valg sparer Tid, men giver mindre KPI. 
      Efter du gennemfører alle trin i en opgave, vil CAB enten godkende 
      eller afvise dine ændringer.
    </p>
    <p>Klar til at starte rejsen? Held og lykke!</p>
  `;
  openModal(introText, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

/**
 * 2) Sprintmål (PI Planning)
 */
function showSprintGoal() {
  const piHTML = `
    <h2>PI Planning</h2>
    <p>
      Under PI Planning fastsætter du dine mål og prioriteringer 
      for den kommende udviklings- og sikkerhedsindsats.
      Du skal nå mindst 22 i både Sikkerhed og Udvikling, 
      inden tiden (30) når 0. 
      Derudover skal du gennemføre 10 opgaver, hvoraf nogle 
      kan være mærket som Hastende, hvilket giver +4 bonus i KPI 
      men også +10% øget risiko for at blive afvist af CAB.
    </p>
    <p>
      Hver opgave er inddelt i trin, hvor du skal vælge den korrekte lokation
      (fx hospital, infrastruktur, cybersikkerhed, osv.) 
      og beslutte mellem et Avanceret (2 tid) eller et Hurtigt (0 tid) valg.
      Avanceret valg bidrager mere til dine KPI’er, mens hurtige valg 
      er bedre, hvis du vil spare tid.
    </p>
    <p>
      Når du er klar, fortsætter du til tutorial, hvor du kan se 
      den konkrete gennemgang af spillets trin. 
      God planlægning og fokus på balancen mellem Tid og KPI’er 
      bliver afgørende for din succes.
    </p>
  `;
  openModal(piHTML, `<button id="toTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('toTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

/**
 * 3) Tutorial
 */
function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>
      1) Klik på “Vælg ny opgave” for at se opgavelisten.<br/>
      2) Når du forpligter en opgave, skal du gennemføre dens trin 
         i rækkefølge. Hvert trin kræver et klik på en bestemt 
         lokation (hospital, infrastruktur, it-jura m.fl.).<br/>
      3) For hvert trin vælger du enten et Avanceret valg (2 tid, 
         større KPI) eller et Hurtigt valg (0 tid, lavere KPI).<br/>
      4) Efter alle trin er afsluttet, skal CAB (Change Advisory Board) 
         enten godkende eller afvise. Hvis afvist, bruger du 1 tid på rework.
    </p>
    <p>
      Du kan bruge Arkitekthjælp én gang pr. opgave for at se, 
      om opgaven er fokuseret på Sikkerhed eller Udvikling, 
      og få en anbefaling til valget i trin. 
      Men pas på ikke at spilde hjælpen på uvæsentlige opgaver!
    </p>
    <p>
      På grafen i venstre side ser du din aktuelle Tid, Sikkerhed og 
      Udvikling. Du starter med 30 tid, 0 i Sikkerhed og 0 i Udvikling, 
      og skal nå mindst 22 i både Sikkerhed og Udvikling, samt gennemføre 
      10 opgaver. 
    </p>
    <p>
      Klar? Luk denne tutorial og klik “Vælg ny opgave” for at komme i gang!
    </p>
  `;
  openModal(tutHTML, `<button id="closeTut" class="modern-btn">Luk</button>`);
  document.getElementById('closeTut').addEventListener('click', () => closeModal());
}

/**
 * Opgavevalg – i en modal
 */
function openTaskSelectionModal() {
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave!</p>", `<button id="activeWarn" class="modern-btn">OK</button>`);
    document.getElementById('activeWarn').addEventListener('click', () => closeModal());
    return;
  }

  let hasHastende = false;
  let tableRows = "";
  gameState.tasks.forEach((taskObj, index) => {
    if (taskObj.isHastende) hasHastende = true;
    const type = (taskObj.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hast = taskObj.isHastende ? "Ja" : "Nej";
    tableRows += `
      <tr>
        <td>${taskObj.title}</td>
        <td>${type}</td>
        <td>${hast}</td>
        <td>
          <button class="commit-task-btn modern-btn" data-idx="${index}">
            Forpligt
          </button>
          <button class="help-task-btn modern-btn" data-idx="${index}">
            Arkitekthjælp
          </button>
        </td>
      </tr>
    `;
  });

  const hastendeNote = hasHastende 
    ? `<div style="background-color:#ffe9e9; border:1px solid red; padding:0.5rem;">
         <strong>Hastende opgaver i listen!</strong> 
         (+4 KPI ved succes, men +10% ekstra risiko for CAB-afvisning)
       </div>` 
    : "";

  const modalBody = `
    <h2>Vælg en opgave</h2>
    ${hastendeNote}
    <table class="task-table">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Type</th>
          <th>Haster</th>
          <th>Valg</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
  
  openModal(modalBody, `<button id="closeTaskModal" class="modern-btn">Luk</button>`);
  document.getElementById('closeTaskModal').addEventListener('click', () => closeModal());

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
        openModal(
          `<h2>Arkitekthjælp</h2>
           <p><strong>${chosenTask.title}</strong><br>
           ${chosenTask.narrativeIntro || ""}</p>
           <p><em>Fokus:</em> 
           ${chosenTask.focus === "sikkerhed" ? "Sikkerhedsopgave" : "Udviklingsopgave"}</p>`,
          `<button id="arkHelpClose" class="modern-btn">Luk</button>`
        );
        document.getElementById('arkHelpClose').addEventListener('click', () => {
          closeModal(() => openTaskSelectionModal());
        });
      }
    });
  });
}

document.getElementById('newTaskBtn')?.addEventListener('click', openTaskSelectionModal);

/**
 * Start Opgave
 */
function startTask(taskObj) {
  gameState.currentTask = taskObj;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  gameState.choiceHistory = new Array(taskObj.steps.length);
  gameState.revisionCount = new Array(taskObj.steps.length).fill(0);
  gameState.revisionMode = false;

  closeModal();
  renderActiveTask(taskObj);
}

function renderActiveTask(taskObj) {
  const activeDiv = document.getElementById('activeTask');
  activeDiv.innerHTML = `<h2>${taskObj.title}</h2><p>${taskObj.shortDesc}</p>`;
  if (taskObj.steps && taskObj.steps.length > 0) {
    let stepsHTML = "<p style='text-align:left;'>";
    taskObj.steps.forEach((st, idx) => {
      if (idx < gameState.currentStepIndex) {
        stepsHTML += `${idx+1}. ${st.location.toUpperCase()} ${getIcon(st.location)} <span class="done">✔</span><br>`;
      } else {
        stepsHTML += `${idx+1}. ${st.location.toUpperCase()} ${getIcon(st.location)}<br>`;
      }
    });
    stepsHTML += "</p>";

    activeDiv.innerHTML += stepsHTML;

    const currentStep = taskObj.steps[gameState.currentStepIndex];
    activeDiv.innerHTML += `
      <p><strong>Vælg lokation:</strong> 
        ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}
      </p>
    `;
  }
}

function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Vælg en opgave og forpligt dig først!</p>", `<button class="modern-btn" id="noTaskOK">OK</button>`);
    document.getElementById('noTaskOK').addEventListener('click', () => closeModal());
    return;
  }

  const st = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLoc.toLowerCase() === st.location.toLowerCase()) {
    showStepChoices(st);
  } else {
    openModal(
      `<h2>Forkert lokation</h2>
       <p>Du valgte ${clickedLoc.toUpperCase()}, men skal bruge ${st.location.toUpperCase()}.</p>`,
      `<button id="locWrong" class="modern-btn">OK</button>`
    );
    document.getElementById('locWrong').addEventListener('click', () => closeModal());
  }
}

function showStepChoices(step) {
  const bodyHTML = `<h2>${step.stepDescription}</h2>${step.stepContext || ""}`;
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>-2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");

  let footHTML = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
    <button id="archHelpStep" class="modern-btn">
      ${gameState.architectHelpUsed ? "Arkitekthjælp brugt" : "Brug Arkitekthjælp"}
    </button>
  `;
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footHTML += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }

  openModal(bodyHTML, footHTML);

  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
      gameState.revisionMode = true;
      closeModal(() => showStepChoices(step));
    });
  }

  document.getElementById('choiceA').addEventListener('click', () => {
    const advChoice = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(advChoice);
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

  document.getElementById('archHelpStep').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p>`,
        `<button id="archCloseBtn" class="modern-btn">Luk</button>`
      );
      document.getElementById('archCloseBtn').addEventListener('click', () => 
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

/**
 * checkGameOverCondition
 */
function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      gameState.security >= gameState.missionGoals.security &&
      gameState.development >= gameState.missionGoals.development) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du nåede KPI-målene, men ikke 10 opgaver.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Du har gennemført 10 opgaver, men KPI-målene er ikke nået.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security ||
              gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Både antal opgaver og KPI er utilstrækkeligt.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter nu!</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB Approvement
 * Rework-straffen = 1
 */
function cabApproval() {
  closeModal(() => {
    const t = gameState.currentTask;
    let focusKPI, missionGoal;
    if (t.focus === 'sikkerhed' || t.focus === 'cybersikkerhed') {
      focusKPI = gameState.security;
      missionGoal = gameState.missionGoals.security;
    } else {
      focusKPI = gameState.development;
      missionGoal = gameState.missionGoals.development;
    }

    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);

    // +10% risiko ved isHastende
    let extraNote = "";
    if (t.isHastende) {
      chance -= 0.1;
      if (chance < 0) chance = 0;
      extraNote = `<p style="color:red;">Hastende opgave: +10% risiko for afvisning, +4 bonus i KPI ved succes.</p>`;
    }
    const approvalPct = Math.floor(chance * 100);
    const riskPct = 100 - approvalPct;

    const cabHTML = `
      <h2>CAB (Change Advisory Board)</h2>
      ${extraNote}
      <p>Godkendelsesprocent: ${approvalPct}%</p>
      <p>Risiko for afvisning: ${riskPct}%</p>
    `;
    let footHTML = `<button id="evaluateCAB" class="modern-btn">Evaluér nu</button>`;
    if (!allAdvanced) {
      footHTML += ` <button id="goBackCAB" class="modern-btn">Gå tilbage</button>`;
    }

    openModal(cabHTML, footHTML);

    document.getElementById('evaluateCAB').addEventListener('click', () => {
      if (Math.random() < chance) {
        showTaskSummary();
      } else {
        openModal("<h2>CAB Afvisning</h2><p>Rework er påkrævet, og du mister 1 tid.</p>", `<button id="reworkBtn" class="modern-btn">OK</button>`);
        document.getElementById('reworkBtn').addEventListener('click', () => {
          gameState.time -= 1;
          if (gameState.time < 0) gameState.time = 0;
          updateDashboard();
          closeModal(() => cabApproval());
        });
      }
    });

    if (!allAdvanced) {
      document.getElementById('goBackCAB').addEventListener('click', () => showRevisionOptions());
    }
  });
}

/**
 * Revision Options
 */
function showRevisionOptions() {
  let revisableIndices = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisableIndices.push(i);
    }
  }
  if (revisableIndices.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er avancerede eller allerede revideret.</p>", `<button id="noRev" class="modern-btn">OK</button>`);
    document.getElementById('noRev').addEventListener('click', () => 
      closeModal(() => cabApproval())
    );
    return;
  }
  let listHTML = "<h2>Vælg et trin at revidere</h2><ul>";
  revisableIndices.forEach(idx => {
    let stDesc = gameState.currentTask.steps[idx].stepDescription;
    listHTML += `<li><button class="revisionBtn modern-btn" data-idx="${idx}">Trin ${idx+1}: ${stDesc}</button></li>`;
  });
  listHTML += "</ul>";
  
  openModal(listHTML, "");
  document.querySelectorAll('.revisionBtn').forEach(b => {
    b.addEventListener('click', e => {
      let chosenIdx = parseInt(e.target.getAttribute('data-idx'));
      gameState.revisionCount[chosenIdx]++;
      gameState.revisionMode = true;
      closeModal(() => {
        gameState.currentStepIndex = chosenIdx;
        showStepChoices(gameState.currentTask.steps[chosenIdx]);
      });
    });
  });
}

/**
 * Task summary
 */
function showTaskSummary() {
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === "sikkerhed" || gameState.currentTask.focus === "cybersikkerhed") {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Sikkerhed!</p>`;
    } else {
      gameState.development += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Udvikling!</p>`;
    }
    updateDashboard();
  }

  let summaryHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      summaryHTML += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  summaryHTML += "</ul>" + bonusNote;

  openModal(summaryHTML, `<button id="afterSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('afterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

/**
 * Finish Task
 */
function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="taskDone" class="modern-btn">OK</button>`);
  document.getElementById('taskDone').addEventListener('click', () => {
    closeModal(() => {
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      const newOnes = gameState.allTasks.splice(0,2);
      assignRandomHastende(newOnes);
      gameState.tasks = gameState.tasks.concat(newOnes);

      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
      renderPotentialTasks();
    });
  });
}

function renderPotentialTasks() {
  const potDiv = document.getElementById('potentialTasks');
  potDiv.innerHTML = `<h2>Potentielle Opgaver</h2>`;
  gameState.tasks.forEach((taskObj, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'task-item';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';
    const labelType = (taskObj.focus === 'sikkerhed' || taskObj.focus === 'cybersikkerhed')
      ? 'Sikkerhedsopgave'
      : 'Udviklingsopgave';
    const hast = taskObj.isHastende ? '<span style="color:red;">(Haster!)</span>' : '';
    infoDiv.innerHTML = `<h3>${taskObj.title} ${hast}</h3><p>${taskObj.shortDesc}</p><p>${labelType}</p>`;
    wrap.appendChild(infoDiv);

    const commitBtn = document.createElement('button');
    commitBtn.textContent = "Forpligt opgave";
    commitBtn.className = "modern-btn";
    commitBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (gameState.currentTask) {
        openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave!</p>", `<button class="modern-btn" id="alertOk">OK</button>`);
        document.getElementById('alertOk').addEventListener('click', () => closeModal());
        return;
      }
      startTask(taskObj);
    });

    const helpBtn = document.createElement('button');
    helpBtn.className = "modern-btn";
    helpBtn.textContent = "Arkitekthjælp";
    helpBtn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(
        `<h2>Arkitekthjælp</h2><p><strong>${taskObj.title}</strong><br>${taskObj.narrativeIntro || ""}</p>`,
        `<button class="modern-btn" id="archClose2">Luk</button>`
      );
      document.getElementById('archClose2').addEventListener('click', () => 
        closeModal(() => renderPotentialTasks())
      );
    });

    wrap.appendChild(commitBtn);
    wrap.appendChild(helpBtn);
    potDiv.appendChild(wrap);
  });
}

/**
 * showIntro() ved start
 */
showIntro();

export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
