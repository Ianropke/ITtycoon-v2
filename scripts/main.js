// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

/**
 * Global game state
 */
const gameState = {
  time: 40, // Starttid: 40
  security: 0,
  development: 0,
  currentTask: null,
  currentStepIndex: 0,
  tasksCompleted: 0,  // PI slutter når 5 opgaver er gennemført
  tasksDevelopment: 0,
  tasksSikkerhed: 0,
  missionGoals: { security: 22, development: 22 },
  architectHelpUsed: false,
  allTasks: [],
  tasks: [],
  choiceHistory: [],
  revisionCount: [],
  revisionMode: false
};

/**
 * Lokationsliste – tilgængelig for alle funktioner
 */
const locationList = ["hospital", "dokumentation", "leverandør", "infrastruktur", "it‑jura", "cybersikkerhed"];

/**
 * Saml opgaver fra task-filer og bland dem
 */
gameState.allTasks = [].concat(
  window.hospitalTasks,         // opgaver med fokus "udvikling"
  window.infrastrukturTasks,    // opgaver med fokus "sikkerhed"
  window.cybersikkerhedTasks    // opgaver med fokus "cybersikkerhed" (samles med "sikkerhed")
);
shuffleArray(gameState.allTasks);
// Træk 7 opgaver som de potentielle opgaver
gameState.tasks = gameState.allTasks.splice(0, 7);

/**
 * Tildel ca. 10% af opgaverne som hastende
 */
function assignRandomHastende(taskList) {
  taskList.forEach(task => {
    task.isHastende = (Math.random() < 0.1);
  });
}
assignRandomHastende(gameState.tasks);

/**
 * Chart.js – Initialiser KPI-grafen
 * Grafen viser "Tid" og en stacket "Score" (Sikkerhed + Udvikling)
 */
const ctx = document.getElementById('kpiChart').getContext('2d');
const kpiChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Tid', 'Score'],
    datasets: [
      {
        label: 'Tid',
        data: [gameState.time, 0],
        backgroundColor: '#f39c12',
        stack: 'time'
      },
      {
        label: 'Sikkerhed',
        data: [0, gameState.security],
        backgroundColor: '#27ae60',
        stack: 'score'
      },
      {
        label: 'Udvikling',
        data: [0, gameState.development],
        backgroundColor: '#9b59b6',
        stack: 'score'
      }
    ]
  },
  options: {
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    }
  }
});

/** Opdater KPI-grafen */
function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [gameState.time, 0];
  kpiChart.data.datasets[1].data = [0, gameState.security];
  kpiChart.data.datasets[2].data = [0, gameState.development];
  kpiChart.update();
  updateNarrative();
}

/** Opdater Task Progress */
function updateTaskProgress() {
  const progressEl = document.getElementById('taskProgress');
  if (progressEl) {
    progressEl.textContent = `Opgave ${gameState.tasksCompleted} / 5 - Udvikling: ${gameState.tasksDevelopment}, Sikkerhed: ${gameState.tasksSikkerhed}`;
  }
  updateNarrative();
}
updateTaskProgress();

/** Render KPI tooltips – til info om Tid, Udvikling og Sikkerhed */
function renderKpiTooltips() {
  const kpiInfo = document.getElementById('kpiInfo');
  if (kpiInfo) {
    kpiInfo.innerHTML = `
      <div class="tooltip-item">
        <i class="fas fa-clock" title="Din samlede Tid. Hver opgave koster 2 Tid."></i> Tid
      </div>
      <div class="tooltip-item">
        <i class="fas fa-code" title="Udviklingspoint: Point for opgaver med fokus på udvikling."></i> Udvikling
      </div>
      <div class="tooltip-item">
        <i class="fas fa-shield-alt" title="Sikkerhedspoint: Point for opgaver med fokus på sikkerhed."></i> Sikkerhed
      </div>
    `;
  }
}
renderKpiTooltips();

/** Render lokationer (venstre side) – med tooltips for hver lokation */
function renderLocations() {
  const locDiv = document.getElementById('locations');
  locDiv.innerHTML = "";
  locationList.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + " " + getIcon(loc);
    btn.title = `Info om ${loc}`;
    btn.addEventListener('click', () => handleLocationClick(loc));
    locDiv.appendChild(btn);
  });
}
renderLocations();

/** Dynamisk narrativ opdatering – vis feedback til spilleren */
function updateNarrative() {
  const narrativeEl = document.getElementById('narrativeUpdate');
  if (!narrativeEl) return;
  let narrative = "";
  const progress = gameState.tasksCompleted / 5;
  if (progress >= 0.6 && progress < 0.8) {
    narrative = "Du er nu 60% af vejen til at gennemføre PI!";
  } else if (progress >= 0.8) {
    narrative = "Du nærmer dig målet for denne PI – godt klaret!";
  } else {
    narrative = "Fortsæt med at gennemføre opgaver for at øge din score.";
  }
  const total = gameState.tasksDevelopment + gameState.tasksSikkerhed;
  if (total > 0) {
    const ratioDev = gameState.tasksDevelopment / total;
    const ratioSec = gameState.tasksSikkerhed / total;
    if (ratioDev > 0.8) {
      narrative += " CAB advarer: Overdreven fokus på udvikling kan øge risikoen for afvisning!";
    } else if (ratioSec > 0.8) {
      narrative += " CAB advarer: Overdreven fokus på sikkerhed kan øge risikoen for afvisning!";
    }
  }
  narrativeEl.innerHTML = narrative;
}

/** Hjælp-knap */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpHTML = `
    <h2>Hjælp</h2>
    <p>
      <strong>Spillets Koncept:</strong><br/>
      Gennemfør opgaver for at maksimere din samlede score – antallet af opgaver plus dine point (Udvikling + Sikkerhed).
      Du starter med 50 Tid, og hver opgave koster 2 Tid.
    </p>
    <ul>
      <li>Opgaver med fokus på Udvikling giver +3 Udvikling.</li>
      <li>Opgaver med fokus på Sikkerhed giver +3 Sikkerhed.</li>
      <li>Hastende opgaver giver en bonus på +4 point ved succes, men øger CAB-risiko med 10%.</li>
      <li>En ubalanceret opgavefordeling øger risikoen for CAB-afvisning i næste PI.</li>
    </ul>
    <p>Din strategi skal balancere opgavegennemførelse og tidsstyring.</p>
    <p>God fornøjelse med IT‑Tycoon!</p>
  `;
  openModal(helpHTML, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/** 1) Intro – stemningsfuld introduktionstekst */
function showIntro() {
  const introText = `
    <h2>Velkommen til IT‑Tycoon!</h2>
    <p>
      Forestil dig en travl mandag morgen, hvor du træder ind i kontrolrummet for en stor, kompleks organisation. Servere surrer, telefonerne ringer, og tekniske udfordringer venter på at blive løst. Som IT‑forvalter er det dit ansvar at holde systemerne kørende, implementere nye løsninger og sikre, at alting sker inden for en stram tidsramme.
    </p>
    <p>
      Dit mål? At gennemføre så mange opgaver som muligt, før tiden løber ud. Du har 50 Tid til rådighed, og hver opgave koster 2 Tid. Hver opgave, du gennemfører, giver dig point – enten i Udvikling eller i Sikkerhed. Din samlede score er antallet af gennemførte opgaver plus summen af dine point (Udvikling + Sikkerhed).
    </p>
    <p>
      Men pas på! Hvis du kun fokuserer på én type opgave, kan du risikere problemer med CAB-godkendelsen i næste sprint. Nogle opgaver kan også være hastende og give ekstra bonus, men øger samtidig din risiko.
    </p>
    <p>Klar til at starte? Klik "Start Spillet" for at begynde!</p>
  `;
  openModal(introText, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () =>
    closeModal(() => showSprintGoal())
  );
}

/** 2) Sprintmål (PI Planning) – nu med 5 opgaver */
function showSprintGoal() {
  const piHTML = `
    <h2>PI Planning</h2>
    <p>
      Dine primære mål for denne PI er at gennemføre 5 opgaver og opnå en høj samlet score 
      (Score = Udvikling + Sikkerhed) inden for den tilgængelige Tid (50).
    </p>
    <p>
      Husk: Hver opgave koster 2 Tid, og dine valg påvirker, hvor mange point du opnår.
      Ensidige valg øger risikoen for CAB-afvisning i næste PI.
    </p>
    <p>Tryk "Fortsæt" for at gå videre til tutorial.</p>
  `;
  openModal(piHTML, `<button id="toTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('toTutorial').addEventListener('click', () =>
    closeModal(() => startTutorial())
  );
}

/** 3) Tutorial */
function startTutorial() {
  const tutHTML = `
    <h2>Tutorial</h2>
    <p>1. Klik på “Vælg ny opgave” for at åbne opgavelisten.</p>
    <p>2. Vælg en opgave – hver opgave koster 2 Tid og giver +3 point, afhængigt af opgavens fokus.</p>
    <p>3. Din samlede score udgøres af antallet af opgaver plus summen af dine point (Udvikling + Sikkerhed).</p>
    <p>4. Ensidige valg øger risikoen for CAB-afvisning i næste PI.</p>
    <p>5. Hastende opgaver giver +4 bonus, men medfører +10% ekstra risiko.</p>
    <p>Afslut tutorialen ved at klikke "Luk" og begynd at vælge opgaver!</p>
  `;
  openModal(tutHTML, `<button id="closeTut" class="modern-btn">Luk</button>`);
  document.getElementById('closeTut').addEventListener('click', () => closeModal());
}

/** Opgavevalg – vis potentielle opgaver i en modal */
function openTaskSelectionModal() {
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave!</p>", `<button id="activeWarn" class="modern-btn">OK</button>`);
    document.getElementById('activeWarn').addEventListener('click', () => closeModal());
    return;
  }
  let hasHastende = false;
  let tableRows = "";
  gameState.tasks.forEach((task, index) => {
    if (task.isHastende) hasHastende = true;
    const type = (task.focus === 'udvikling') ? "Udviklingsopgave" : "Sikkerhedsopgave";
    const hast = task.isHastende ? "Ja" : "Nej";
    tableRows += `
      <tr>
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hast}</td>
        <td><button class="commit-task-btn modern-btn" data-idx="${index}">Forpligt</button></td>
      </tr>
    `;
  });
  const hastendeNote = hasHastende 
    ? `<div style="background-color:#ffe9e9; border:1px solid red; padding:0.5rem;">
         <strong>Hastende opgaver!</strong> (+4 bonus ved succes, +10% ekstra risiko)
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
      if (chosenTask) startTask(chosenTask);
    });
  });
}

/** Start opgave – initialiser task-state */
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

/** Render aktiv opgave – behold overskriften "Aktiv Opgave" i et fast område */
function renderActiveTask(task) {
  const activeDiv = document.getElementById('activeTask');
  activeDiv.innerHTML = `<h2>Aktiv Opgave</h2>`;
  if (task) {
    activeDiv.innerHTML += `<h3>${task.title}</h3><p>${task.shortDesc}</p>`;
    if (task.steps && task.steps.length > 0) {
      let stepsHTML = "<p style='text-align:left;'>";
      task.steps.forEach((st, idx) => {
        if (idx < gameState.currentStepIndex) {
          stepsHTML += `${idx+1}. ${st.location.toUpperCase()} ${getIcon(st.location)} <span class="done">✔</span><br>`;
        } else {
          stepsHTML += `${idx+1}. ${st.location.toUpperCase()} ${getIcon(st.location)}<br>`;
        }
      });
      stepsHTML += "</p>";
      activeDiv.innerHTML += stepsHTML;
      const currentStep = task.steps[gameState.currentStepIndex];
      activeDiv.innerHTML += `<p><strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}</p>`;
    }
  }
}

/** Håndter lokationsklik */
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

/** Vis trinvalg – modal med valg af avanceret eller hurtig løsning */
function showStepChoices(step) {
  const bodyHTML = `<h2>${step.stepDescription}</h2>${step.stepContext || ""}`;
  
  let cATxt = step.choiceA.text.replace(
    /-?\d+\s*tid/,
    `<span style='color:#f44336; font-weight:bold;'>-2 tid</span>`
  );
  let cBTxt = step.choiceB.text.replace(
    /-?\d+\s*tid/,
    `<span style='color:#43A047; font-weight:bold;'>0 tid</span>`
  );
  
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
  
  const undoBtn = document.getElementById('undoChoice');
  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
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

/** Anvend valg – opdater KPI og Tid */
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

/** Gå videre til næste trin */
function proceedToNextStep() {
  const t = gameState.currentTask;
  if (gameState.currentStepIndex < t.steps.length - 1) {
    gameState.currentStepIndex++;
    renderActiveTask(t);
  } else {
    cabApproval();
  }
}

/** Tjek game over – spillet slutter, når Tid = 0 eller 5 opgaver er gennemført */
function checkGameOverCondition() {
  if (gameState.time <= 0) {
    let message = "Tiden er opbrugt!";
    const totalPoints = gameState.security + gameState.development;
    message += `<br>Samlet score: ${totalPoints} point<br>Fordeling: Udvikling: ${gameState.tasksDevelopment}, Sikkerhed: ${gameState.tasksSikkerhed}`;
    openModal(`<h2>Spillet er slut</h2><p>${message}</p>`, "");
    setTimeout(() => location.reload(), 4000);
  } else if (gameState.tasksCompleted >= 5) {
    showPIFeedback();
  }
}

/** PI Feedback – vis spændende feedback, når 5 opgaver er gennemført */
function showPIFeedback() {
  const totalPoints = gameState.security + gameState.development;
  const feedbackHTML = `
    <h2>PI Feedback</h2>
    <p>Fantastisk arbejde! Du har gennemført 5 opgaver.</p>
    <p>Din samlede score er ${totalPoints} point.</p>
    <p>Du har vist, at du kan balancere opgaver og tid – en kritisk egenskab for en succesfuld IT‑forvalter.</p>
    <p>Forbered dig nu på næste PI – justér din strategi og sæt nye mål!</p>
  `;
  openModal(feedbackHTML, `<button id="continuePI" class="modern-btn">Start Næste PI</button>`);
  document.getElementById('continuePI').addEventListener('click', () => {
    closeModal(() => {
      // Nulstil for næste PI
      gameState.tasksCompleted = 0;
      gameState.time = 40;
      updateDashboard();
      updateTaskProgress();
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
      renderPotentialTasks();
    });
  });
}

/** CAB Approvement – vurdering af opgavens kvalitet, med rework-straffen på 1 Tid */
function cabApproval() {
  closeModal(() => {
    const t = gameState.currentTask;
    let focusKPI, missionGoal;
    if (t.focus === 'udvikling') {
      focusKPI = gameState.development;
      missionGoal = gameState.missionGoals.development;
    } else {
      focusKPI = gameState.security;
      missionGoal = gameState.missionGoals.security;
    }
    
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);
    
    let extraNote = "";
    if (t.isHastende) {
      chance -= 0.1;
      if (chance < 0) chance = 0;
      extraNote += `<p style="color:red;">Hastende opgave: +10% risiko for afvisning, +4 bonus ved succes.</p>`;
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
        openModal("<h2>CAB Afvisning</h2><p>Rework er påkrævet, og du mister 1 Tid.</p>", `<button id="reworkBtn" class="modern-btn">OK</button>`);
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

/** Revision Options – mulighed for at fortryde valg (kun for ikke-avancerede valg) */
function showRevisionOptions() {
  let revisableIndices = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisableIndices.push(i);
    }
  }
  if (revisableIndices.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRev" class="modern-btn">OK</button>`);
    document.getElementById('noRev').addEventListener('click', () => closeModal(() => cabApproval()));
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

/** Task Summary – opsummering af dine valg og evt. hastende bonus */
function showTaskSummary() {
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === "udvikling") {
      gameState.development += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Udvikling!</p>`;
    } else {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Sikkerhed!</p>`;
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

/** Finish Task – afslut opgaven og tilføj nye opgaver */
function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  if (gameState.tasksCompleted < 5) {
    openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="taskDone" class="modern-btn">OK</button>`);
    document.getElementById('taskDone').addEventListener('click', () => {
      closeModal(() => {
        gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
        const newOnes = gameState.allTasks.splice(0, 2);
        assignRandomHastende(newOnes);
        gameState.tasks = gameState.tasks.concat(newOnes);
      
        document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
        gameState.currentTask = null;
        gameState.currentStepIndex = 0;
        renderPotentialTasks();
        checkGameOverCondition();
      });
    });
  } else {
    showPIFeedback();
  }
}

/** PI Feedback – spændende feedback når 5 opgaver er gennemført */
function showPIFeedback() {
  const totalPoints = gameState.security + gameState.development;
  const feedbackHTML = `
    <h2>PI Feedback</h2>
    <p>Fantastisk arbejde! Du har gennemført 5 opgaver.</p>
    <p>Din samlede score er ${totalPoints} point.</p>
    <p>Du har vist, at du kan balancere opgaver og tid – en kritisk egenskab for en succesfuld IT‑forvalter.</p>
    <p>Forbered dig nu på næste PI – justér din strategi og sæt nye mål!</p>
  `;
  openModal(feedbackHTML, `<button id="continuePI" class="modern-btn">Start Næste PI</button>`);
  document.getElementById('continuePI').addEventListener('click', () => {
    closeModal(() => {
      // Nulstil til næste PI
      gameState.tasksCompleted = 0;
      gameState.time = 40;
      updateDashboard();
      updateTaskProgress();
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
      renderPotentialTasks();
    });
  });
}

/** CAB Approvement – vurdering af opgavens kvalitet med rework-straffen på 1 Tid */
function cabApproval() {
  closeModal(() => {
    const t = gameState.currentTask;
    let focusKPI, missionGoal;
    if (t.focus === 'udvikling') {
      focusKPI = gameState.development;
      missionGoal = gameState.missionGoals.development;
    } else {
      focusKPI = gameState.security;
      missionGoal = gameState.missionGoals.security;
    }
    
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);
    
    let extraNote = "";
    if (t.isHastende) {
      chance -= 0.1;
      if (chance < 0) chance = 0;
      extraNote += `<p style="color:red;">Hastende opgave: +10% risiko for afvisning, +4 bonus ved succes.</p>`;
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
        openModal("<h2>CAB Afvisning</h2><p>Rework er påkrævet, og du mister 1 Tid.</p>", `<button id="reworkBtn" class="modern-btn">OK</button>`);
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

/** Revision Options – mulighed for at fortryde valg for ikke-avancerede trin */
function showRevisionOptions() {
  let revisableIndices = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisableIndices.push(i);
    }
  }
  if (revisableIndices.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRev" class="modern-btn">OK</button>`);
    document.getElementById('noRev').addEventListener('click', () => closeModal(() => cabApproval()));
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

/** Task Summary – opsummering af dine valg med evt. hastende bonus */
function showTaskSummary() {
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === "udvikling") {
      gameState.development += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Udvikling!</p>`;
    } else {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Sikkerhed!</p>`;
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

/** Finish Task – afslut opgaven, opdater score og tilføj nye opgaver */
function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  if (gameState.tasksCompleted < 5) {
    openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="taskDone" class="modern-btn">OK</button>`);
    document.getElementById('taskDone').addEventListener('click', () => {
      closeModal(() => {
        gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
        const newOnes = gameState.allTasks.splice(0, 2);
        assignRandomHastende(newOnes);
        gameState.tasks = gameState.tasks.concat(newOnes);
      
        document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
        gameState.currentTask = null;
        gameState.currentStepIndex = 0;
        renderPotentialTasks();
        checkGameOverCondition();
      });
    });
  } else {
    showPIFeedback();
  }
}

/** Render potentielle opgaver – vises i højre kolonne */
function renderPotentialTasks() {
  const potDiv = document.getElementById('potentialTasks');
  if (!potDiv) return;
  potDiv.innerHTML = `<h2>Potentielle Opgaver</h2>`;
  gameState.tasks.forEach((task, idx) => {
    const div = document.createElement('div');
    div.className = 'task-item';
    const type = (task.focus === 'udvikling') ? "Udviklingsopgave" : "Sikkerhedsopgave";
    const hast = task.isHastende ? '<span class="haster-badge">Haster!</span>' : '';
    div.innerHTML = `<h3>${task.title} ${hast}</h3><p>${task.shortDesc}</p><p>${type}</p>`;
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
      startTask(task);
    });
    div.appendChild(commitBtn);
    potDiv.appendChild(div);
  });
}

/** Event listener til "Vælg ny opgave"-knappen */
document.getElementById('newTaskBtn')?.addEventListener('click', openTaskSelectionModal);

/** Vis Intro ved spillets start */
showIntro();

export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderPotentialTasks
};
