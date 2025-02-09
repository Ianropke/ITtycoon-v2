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
  currentTask: null,
  currentStepIndex: 0,
  tasksCompleted: 0,
  missionGoals: { security: 22, development: 22 },
  architectHelpUsed: false,
  allTasks: [],
  tasks: [],
  // For rework/revision
  choiceHistory: [],   // fx. [{title: "Avanceret...", advanced: true},...]
  revisionCount: [],   // Antal gange et trin er revideret
  revisionMode: false
};

/**
 * 1) HENT OPGAVER FRA tasks-FILER
 *   (antag hospitalTasks, infrastrukturTasks, cybersikkerhedTasks på window)
 */
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);

// 2) Bland opgaver
shuffleArray(gameState.allTasks);

// 3) Tag 7 styk
gameState.tasks = gameState.allTasks.splice(0, 7);

// 4) Giv 10% af opgaverne "isHastende"
function assignRandomHastende(taskArray) {
  taskArray.forEach(t => {
    t.isHastende = (Math.random() < 0.1);  // 10% chance
  });
}
assignRandomHastende(gameState.tasks);

/**
 * CHART.JS til KPI
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
  options: { 
    scales: { y: { beginAtZero: true } } 
  }
});

function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [gameState.time, gameState.security, gameState.development];
  kpiChart.update();
}
function updateTaskProgress() {
  const progElement = document.getElementById('taskProgress');
  progElement.textContent = `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

/** 
 * RENDER LOKATIONER (venstre side)
 */
const locList = ["hospital","dokumentation","leverandør","infrastruktur","it‑jura","cybersikkerhed"];
function renderLocations() {
  const locationsDiv = document.getElementById('locations');
  locationsDiv.innerHTML = "";
  locList.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + " " + getIcon(loc);
    btn.addEventListener('click', () => handleLocationClick(loc));
    locationsDiv.appendChild(btn);
  });
}
renderLocations();

/** 
 * 1) “En grundig og levende introduktion” 
 * showIntro
 */
function showIntro() {
  const introHTML = `
    <h2>Introduktion</h2>
    <p><em>Velkommen til IT‑Tycoon!</em> 
       Du træder ind i rollen som IT‑forvalter i en verden, 
       hvor hospitaler, infrastruktur og cybersikkerhed smelter sammen under konstant pres. 
       Tiden er din mest knappe ressource, og hvert sekund tæller, 
       når du skal sikre stabil drift, høje sikkerhedsstandarder og innovative løsninger.</p>
    <p>Forestil dig et hospital, der vil have en ny patientjournal, 
       en leverandør, der sender sikkerhedsopdateringer, 
       og en compliance-afdeling, der kræver dokumentation. 
       Alt imens globale cyberangreb truer. 
       Som IT-forvalter balancerer du KPI’erne Tid, Sikkerhed og Udvikling, 
       håndterer CAB-godkendelse og bevarer overblikket. 
       Vil du tage grundige løsninger, der koster ekstra tid, 
       eller springe på hurtige løsninger?</p>
    <p>Er du klar til at prøve kræfter med en kompleks IT-organisation? 
       Kaffe i hånden, deadlines i sigte — lad os begynde!</p>
  `;
  openModal(introHTML, `<button id="startGame" class="modern-btn">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => closeModal(() => showSprintGoal()));
}

/**
 * 2) “En levende forklaring af PI Planning og målsætninger”
 * showSprintGoal
 */
function showSprintGoal() {
  const piText = `
    <h2>PI Planning</h2>
    <p>
      I SAFe-verdenen begynder alt med en PI Planning‑session, 
      hvor du sætter de overordnede mål for Sikkerhed og Udvikling. 
      F.eks. at KPI’erne skal nå 22, og du skal klare 10 opgaver, før du løber tør for tid (30).
    </p>
    <p>
      Hospitalet vil have nye IT-systemer, cybersikkerhedsteamet vil beskytte dem, 
      og infrastrukturfolkene vil styrke netværket. 
      Leverandøren har måske en akut patch. 
      Som IT-forvalter planlægger du: 
      Hvilke opgaver tager du først? 
      Vil du ofre ekstra tid for en avanceret løsning, 
      eller spare tid men få færre KPI-point?
    </p>
    <p>
      Når alt er sat i gang, vil CAB afgøre, om dine ændringer lever op til kravene. 
      Du kan få rework, hvis du ikke har valgt godt. 
      Er du klar til at balancere drift, sikkerhed og udvikling?
    </p>
  `;
  openModal(piText, `<button id="toTutorial" class="modern-btn">Fortsæt</button>`);
  document.getElementById('toTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

/**
 * 3) Evt. en tutorial
 */
function startTutorial() {
  const tut = `
    <h2>Tutorial</h2>
    <p>1) Klik “Vælg ny opgave” for at se listen.<br>
       2) Forpligt opgave og vælg løsninger ved lokationer (avanceret vs. hurtig).<br>
       3) CAB evaluerer dine ændringer til sidst.</p>
    <p>
       Husk du kan revidere et trin én gang. 
       Nogle opgaver er “Hastende” (giver +4 KPI, men +10% ekstra risiko).<br>
       Held og lykke!
    </p>
  `;
  openModal(tut, `<button id="closeTutorial" class="modern-btn">Luk</button>`);
  document.getElementById('closeTutorial').addEventListener('click', () => closeModal());
}

/**
 * 4) “En grundig hjælpetekst” 
 * (når man klikker #helpButton i header)
 */
function showHelp() {
  const helpContent = `
    <h2>Hjælp</h2>
    <p>
      <strong>Velkommen til spillet!</strong>  
      Her er, hvad du skal vide for at komme i gang:
    </p>
    <p><strong>Opgaver og Trin:</strong><br>
       Vælg en opgave fra listen, gennemfør trin ved at klikke på lokation. 
       Avanceret valg koster 2 tid og giver flere KPI. 
       Hurtig valg koster 0 tid og giver færre KPI.</p>
    <p><strong>Tid, Sikkerhed og Udvikling:</strong><br>
       Du starter med 30 tid. Hvis du løber tør, taber du. 
       Du skal opnå mindst 22 i Sikkerhed og Udvikling.</p>
    <p><strong>Hastende Opgaver:</strong><br>
       De giver en bonus på +4 i KPI (sikkerhed/udvikling), 
       men øger afvisningsrisikoen ved CAB med 10%. 
       Overvej om du har tid til at påtage dig dem.</p>
    <p><strong>CAB-godkendelse:</strong><br>
       Når opgaven er fuldført, evaluerer CAB dine ændringer. 
       Avancerede valg øger godkendelseschancen, 
       men hastende opgaver sænker den lidt. 
       Hvis CAB afviser, skal du bruge ekstra tid i rework.</p>
    <p><strong>Revidering:</strong><br>
       Du kan revidere ét trin én gang, 
       hvis du vil opgradere fra hurtig løsning til avanceret.</p>
    <p>God fornøjelse!</p>
  `;
  openModal(helpContent, `<button id="closeHelpBtn" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelpBtn').addEventListener('click', () => closeModal());
}

/** 
 * EFTER DETTE HAR VI DE “Avancerede” FUNKTIONER:
 * - openTaskSelectionModal
 * - startTask
 * - ...
 * - rework, arkitekthjælp i opgavevalg, 
 * - hastende => +4 KPI, -10% chance
 */

/** 
 * openTaskSelectionModal 
 * (forhindrer valg af ny opgave hvis currentTask)
 * (hastende note i “Haster”-kolonnen)
 * (arkitekthjælp-lille-pop-up => genvis modal)
 */
function openTaskSelectionModal() {
  // Tjek om man allerede har en aktiv opgave
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave!</p>", `<button id="warnActive" class="modern-btn">OK</button>`);
    document.getElementById('warnActive').addEventListener('click', () => closeModal());
    return;
  }

  // Byg tabellen
  let tableRows = "";
  gameState.tasks.forEach((task, idx) => {
    const type = (task.focus === 'sikkerhed') ? "Sikkerhedsopgave" : "Udviklingsopgave";
    const hast = task.isHastende ? "Ja" : "Nej";
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
  openModal(modalBody, `<button id="closeTaskModal" class="modern-btn">Luk</button>`);

  document.getElementById('closeTaskModal').addEventListener('click', () => closeModal());

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

  closeModal(); // Luk opgavelisten
  renderActiveTask(task);
}

/**
 * renderActiveTask
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
    const instruction = document.createElement('p');
    instruction.innerHTML = `<strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}`;
    activeDiv.appendChild(instruction);
  }
}

/**
 * handleLocationClick
 */
function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Ingen aktiv opgave</h2><p>Vælg en opgave først!</p>", `<button id="noTaskWarn" class="modern-btn">OK</button>`);
    document.getElementById('noTaskWarn').addEventListener('click', () => closeModal());
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
 * showStepChoices
 * Avanceret vs. Hurtig (2 tid vs. 0 tid)
 * Arkitekthjælp
 * Fortryd => revision
 */
function showStepChoices(step) {
  let body = `<h2>${step.stepDescription}</h2>` + (step.stepContext || '');
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === 'sikkerhed') {
    // Fjern +udvikling i visningen
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

  // Fortryd => revisionMode
  if (document.getElementById('undoChoice')) {
    document.getElementById('undoChoice').addEventListener('click', () => {
      gameState.revisionCount[gameState.currentStepIndex]++;
      gameState.choiceHistory[gameState.currentStepIndex] = undefined;
      gameState.revisionMode = true;
      closeModal(() => showStepChoices(step));
    });
  }

  // Avanceret = −2 tid
  document.getElementById('choiceA').addEventListener('click', () => {
    const advanced = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(advanced);
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

  // Hurtig = 0 tid
  document.getElementById('choiceB').addEventListener('click', () => {
    const quick = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(quick);
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
  document.getElementById('archHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      let hint = "Avanceret valg giver bedre KPI, men koster 2 tid.";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="archHelpClose" class="modern-btn">Luk</button>`
      );
      document.getElementById('archHelpClose').addEventListener('click', () => {
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
    openModal("<h2>Tiden er opbrugt!</h2><p>KPI-mål nået, men ikke 10 opgaver!</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             ((gameState.security < gameState.missionGoals.security) ||
              (gameState.development < gameState.missionGoals.development))) {
    openModal("<h2>Tiden er opbrugt!</h2><p>10 opgaver, men KPI-mål ikke nået!</p>");
  } else if (gameState.tasksCompleted < 10 &&
             ((gameState.security < gameState.missionGoals.security) ||
              (gameState.development < gameState.missionGoals.development))) {
    openModal("<h2>Tiden er opbrugt!</h2><p>Både opgaver og KPI er utilstrækkeligt.</p>");
  } else {
    openModal("<h2>Tiden er opbrugt!</h2><p>Spillet slutter nu!</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

/**
 * CAB-approval
 * Avancerede valg => chance stiger
 * Hastende => −0.1 i chance, +4 bonus ved success
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

    // Er alle trin advanced?
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced === true);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);

    let hastNote = "";
    if (t.isHastende) {
      chance -= 0.1;  // 10% ekstra risiko
      if (chance < 0) chance = 0;
      hastNote = `<p style="color:red;">Hastende opgave: +10% risiko for afvisning, men +4 bonus i KPI ved succes.</p>`;
    }

    let approvalPct = Math.floor(chance * 100);
    let riskPct = 100 - approvalPct;

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

/**
 * showRevisionOptions
 * Valg af trin at revidere => 1 revidering
 */
function showRevisionOptions() {
  let revisable = [];
  for (let i=0; i<gameState.choiceHistory.length; i++){
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er avancerede eller revideret.</p>", `<button id="revNone" class="modern-btn">OK</button>`);
    document.getElementById('revNone').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  let revList = "<h2>Vælg et trin at revidere</h2><ul>";
  revisable.forEach(idx => {
    let desc = gameState.currentTask.steps[idx].stepDescription;
    revList += `<li><button class="revisionBtn modern-btn" data-idx="${idx}">Trin ${idx+1}: ${desc}</button></li>`;
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

/**
 * showTaskSummary
 * Giver +4 i KPI, hvis opgave er hastende og godkendt
 */
function showTaskSummary() {
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    // Bonus på +4 i KPI
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
      const newOnes = gameState.allTasks.splice(0,2);
      gameState.tasks = gameState.tasks.concat(newOnes);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

/**
 * “Få hjælp”-knap i header => showHelp()
 */
document.getElementById('helpButton')?.addEventListener('click', showHelp);

/**
 * “Vælg ny opgave”-knap i højre side => openTaskSelectionModal
 */
document.getElementById('newTaskButton')?.addEventListener('click', openTaskSelectionModal);

/**
 * START SPILLET
 */
showIntro();

/** 
 * Eksporter, hvis nødvendigt
 */
export {
  gameState,
  updateDashboard,
  openModal,
  closeModal,
  renderActiveTask
};
