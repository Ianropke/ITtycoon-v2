// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';
import { checkForEvents } from './events.js';

/**
 * Global game state
 */
const gameState = {
  time: 45,                      // Starttid for hver PI
  security: 0,
  development: 0,
  currentTask: null,
  currentStepIndex: 0,
  tasksCompleted: 0,             // PI slutter ved 5 opgaver
  missionGoals: { security: 22, development: 22 },
  architectHelpUsed: false,      // Nu ikke brugt, da arkitekthjælp fjernes
  allTasks: [],
  tasks: [],
  choiceHistory: [],
  revisionCount: [],
  revisionMode: false,
  highscore: 0,
  quickChoicesThisPI: 0,
  extraCABRiskNextPI: 0,
  extraCABRiskThisPI: 0,
  totalSecurityChoices: 0,       // Tæller sikkerhedsvalg
  totalDevelopmentChoices: 0     // Tæller udviklingsvalg
};

window.gameState = gameState; // Gør gameState global, hvis nødvendigt

/** Lokationsliste */
const locationList = [
  "hospital",
  "dokumentation",
  "leverandør",
  "infrastruktur",
  "it‑jura",
  "cybersikkerhed"
];

/** Saml opgaver fra de tre task-filer */
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
shuffleArray(gameState.allTasks);
gameState.tasks = gameState.allTasks.splice(0, 7);
gameState.tasks.forEach(task => {
  task.isHastende = (Math.random() < 0.1);
});

/** Chart.js – viser Tid og Score (stacket Sikkerhed + Udvikling) */
const ctx = document.getElementById('kpiChart').getContext('2d');
const kpiChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Tid', 'Score'],
    datasets: [
      { label: 'Tid', data: [gameState.time, 0], backgroundColor: '#f39c12' },
      { label: 'Sikkerhed', data: [0, gameState.security], backgroundColor: '#27ae60' },
      { label: 'Udvikling', data: [0, gameState.development], backgroundColor: '#9b59b6' }
    ]
  },
  options: {
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    },
    plugins: { legend: { display: true } }
  }
});

function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [gameState.time, 0];
  kpiChart.data.datasets[1].data = [0, gameState.security];
  kpiChart.data.datasets[2].data = [0, gameState.development];
  kpiChart.update();
  updateNarrative();
}

function updateTaskProgress() {
  const progressEl = document.getElementById('taskProgress');
  if (progressEl) {
    progressEl.textContent = `Opgave ${gameState.tasksCompleted} / 5`;
  }
  updateNarrative();
}
updateTaskProgress();

/** Render lokationer */
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

/**
 * highlightCorrectLocation – Fremhæv den korrekte lokation (undtagen hvis det er sidste trin, der altid skal være "dokumentation")
 */
function highlightCorrectLocation(correctLocation) {
  if (!gameState.currentTask || gameState.currentStepIndex >= gameState.currentTask.steps.length - 1) {
    document.querySelectorAll('.location-button').forEach(btn => btn.classList.remove('highlight'));
    return;
  }
  const buttons = document.querySelectorAll('.location-button');
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(correctLocation.toLowerCase())) {
      btn.classList.add('highlight');
    } else {
      btn.classList.remove('highlight');
    }
  });
}

/** Narrativ feedback */
function updateNarrative() {
  const narrativeEl = document.getElementById('narrativeUpdate');
  if (!narrativeEl) return;
  let narrative = "";
  const progress = gameState.tasksCompleted / 5;
  const total = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  const ratioDev = total > 0 ? (gameState.totalDevelopmentChoices / total) : 0;

  if (progress >= 1.0) {
    narrative += "Du har fuldført alle opgaver i denne PI – flot arbejde!";
  } else if (progress >= 0.8) {
    narrative += "Du nærmer dig målet for denne PI – fantastisk!";
  } else if (progress >= 0.6) {
    narrative += "Du er nu 60% af vejen til at gennemføre PI!";
  } else if (progress >= 0.4) {
    narrative += "Du er næsten halvvejs – fortsæt den gode indsats!";
  } else if (progress > 0) {
    narrative += "IT-arkitekten siger: PI er i gang, vælg en opgave for at starte – du er kommet i gang, men der er stadig en del at nå.";
  } else {
    narrative += "IT-arkitekten siger: PI er i gang, vælg en opgave for at starte!";
  }
  if (gameState.time < 10) {
    narrative += " Pas på! Du er ved at løbe tør for Tid.";
  }
  if (total > 0) {
    if (ratioDev > 0.65) {
      narrative += " CAB advarer: Overdreven fokus på udvikling øger risikoen for hackerangreb!";
    } else if (ratioDev < 0.35) {
      narrative += " CAB advarer: For få udviklingsvalg kan føre til ineffektive arbejdsgange!";
    } else {
      narrative += " CAB bemærker: Din balance mellem udvikling og sikkerhed ser fornuftig ud.";
    }
  }
  narrativeEl.innerHTML = narrative;
}

/** Hjælp-knap */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpHTML = `
    <h2>Hjælp</h2>
    <ul style="text-align:left; margin:0 auto; max-width:400px;">
      <li>⚙️ <strong>Formål:</strong> Gennemfør 5 opgaver pr. PI for at få en høj samlet score.</li>
      <li>⌛ <strong>Tid:</strong> Du starter med 50 Tid (hver opgave koster 2 Tid).</li>
      <li>💻 <strong>Point:</strong> Dine valg giver point – samlet score = opgaver + point.</li>
      <li>🚨 <strong>Hastende opgaver:</strong> Giver ekstra bonus (+4), men øger CAB-risiko med 10% – og hvis du vælger let løsning, trækkes 5 point i straf.</li>
      <li>⚖️ <strong>Balance:</strong> Over 65% udviklingsvalg øger risikoen for hackerangreb; under 35% øger ineffektivitet.</li>
      <li>🔍 <strong>CAB:</strong> Et panel af eksperter, der evaluerer dine ændringer. Forkerte valg kan medføre straf.</li>
    </ul>
    <p style="margin-top:1rem;">Held og lykke med IT‑Tycoon!</p>
  `;
  openModal(helpHTML, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/** Intro – Pop-up 1: Scene-setting inkl. forklaring af CAB */
function showIntro() {
  const introText = `
    <h2>Velkommen til IT‑Tycoon!</h2>
    <ul style="text-align:left; margin:0 auto; max-width:500px; line-height:1.6;">
      <li>🚀 <strong>Mission:</strong> Du er IT‑forvalter og skal styre komplekse systemer i en digital tidsalder.</li>
      <li>⏱️ <strong>Tidspres:</strong> Hver beslutning påvirker din Tid – vær skarp og handl hurtigt.</li>
      <li>🎯 <strong>Mål:</strong> Fuldfør opgaver og optimer systemerne for at opnå en høj samlet score.</li>
      <li>💡 <strong>CAB:</strong> Change Advisory Board – et panel af eksperter, der evaluerer dine ændringer. Forkerte valg medfører straf, fx 5 point, hvis du ikke vælger den avancerede løsning på hastende opgaver.</li>
      <li>🤖 <strong>Strategi:</strong> Dine valg giver point i enten Udvikling eller Sikkerhed. En afbalanceret strategi er nøglen til succes.</li>
    </ul>
    <p style="margin-top:1rem;">Er du klar til at træde ind i rollen som digital strateg?</p>
  `;
  openModal(introText, `<button id="continueIntro" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueIntro').addEventListener('click', () => closeModal(() => showTutorial()));
}

/** Intro – Pop-up 2: Tutorial */
function showTutorial() {
  const tutText = `
    <h2>Tutorial</h2>
    <ul style="text-align:left; margin:0 auto; max-width:500px; line-height:1.6;">
      <li>1️⃣ Klik på “Vælg ny opgave” for at åbne opgavelisten.</li>
      <li>2️⃣ Vælg en opgave – hver opgave koster 2 Tid og giver 3 point (udvikling eller sikkerhed).</li>
      <li>3️⃣ Samlet score = antal opgaver + point (sikkerhed + udvikling).</li>
      <li>4️⃣ Over 65% udviklingsvalg øger risikoen for hackerangreb!</li>
      <li>5️⃣ Hastende opgaver giver ekstra bonus (+4), men hvis du vælger let løsning, trækkes 5 point i straf.</li>
    </ul>
    <p style="margin-top:1rem;">Afslut denne tutorial og begynd at vælge opgaver!</p>
  `;
  openModal(tutText, `<button id="closeTut" class="modern-btn">Luk</button>`);
  document.getElementById('closeTut').addEventListener('click', () => closeModal());
}

/** "Vælg ny opgave"-knap */
document.getElementById('newTaskBtn').addEventListener('click', openTaskSelectionModal);
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
         <strong>Hastende opgaver!</strong> (+4 bonus, +10% ekstra risiko, 5 point straf for let løsning)
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

function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  // Arkitekthjælp fjernes helt – ingen reference
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;
  
  closeModal();
  renderActiveTask(task);
}

function renderActiveTask(task) {
  const activeDiv = document.getElementById('activeTask');
  // Behold overskriften "Aktiv Opgave"
  activeDiv.innerHTML = `<h2>Aktiv Opgave</h2>`;
  if (task) {
    activeDiv.innerHTML += `<h3>${task.title}</h3><p>${task.shortDesc}</p>`;
    // Vis narrativeIntro lige efter shortDesc, hvis den findes
    if (task.narrativeIntro) {
      activeDiv.innerHTML += `<p>${task.narrativeIntro}</p>`;
    }
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
      // Fremhæv den korrekte lokation, med undtagelse af sidste trin
      highlightCorrectLocation(currentStep.location);
    }
  }
}

function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>IT-arkitekten siger: Vælg en opgave og forpligt dig først!</p>", `<button id="noTaskOK" class="modern-btn">OK</button>`);
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
  
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#f44336; font-weight:bold;'>-2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#43A047; font-weight:bold;'>0 tid</span>");
  
  // Fjern arkitekthjælpsknappen – kun valg A, valg B og eventuelt Fortryd
  let footHTML = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
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
    gameState.totalDevelopmentChoices = (gameState.totalDevelopmentChoices || 0) + 1;
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
    gameState.quickChoicesThisPI++;
    gameState.totalSecurityChoices = (gameState.totalSecurityChoices || 0) + 1;
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
    const currentStep = t.steps[gameState.currentStepIndex];
    highlightCorrectLocation(currentStep.location);
  } else {
    cabApproval();
  }
}

function checkGameOverCondition() {
  if (gameState.time <= 0) {
    let message = "Tiden er opbrugt!";
    const totalPoints = gameState.security + gameState.development;
    message += `<br>Samlet score: ${totalPoints}<br>Highscore: ${gameState.highscore}`;
    openModal(`<h2>Spillet er slut</h2><p>${message}</p>`, "");
    setTimeout(() => location.reload(), 4000);
  } else if (gameState.tasksCompleted >= 5) {
    showPIFeedback();
  }
}

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
    // Hvis opgaven er hastende og mindst ét trin er løst med en hurtig (let) løsning, trækkes 5 point i straf.
    if (t.isHastende && gameState.choiceHistory.some(ch => ch && ch.advanced === false)) {
      focusKPI = Math.max(0, focusKPI - 5);
      var penaltyNote = `<p style="color:red;">Du har fået 5 point i straf for at vælge den lette løsning på en hastende opgave.</p>`;
    } else {
      var penaltyNote = "";
    }
    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / missionGoal);
    let extraNote = "";
    if (t.isHastende) {
      chance -= 0.1;
      if (chance < 0) chance = 0;
      extraNote += `<p style="color:red;">Hastende opgave: +10% ekstra risiko, +4 bonus ved succes.</p>`;
    }
    if (gameState.extraCABRiskThisPI > 0) {
      chance -= gameState.extraCABRiskThisPI;
      if (chance < 0) chance = 0;
      extraNote += `<p style="color:red;">Ekstra risiko fra forrige PI: +${Math.round(gameState.extraCABRiskThisPI * 100)}%.</p>`;
    }
    const approvalPct = Math.floor(chance * 100);
    const riskPct = 100 - approvalPct;
    const cabHTML = `
      <h2>CAB</h2>
      ${penaltyNote}
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

function showRevisionOptions() {
  let revisableIndices = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisableIndices.push(i);
    }
  }
  if (revisableIndices.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRev" class="modern-btn">OK</button>`);
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
    b.addEventListener('click', (e) => {
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

function showTaskSummary() {
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === "udvikling") {
      gameState.development += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 point!</p>`;
    } else {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 point!</p>`;
    }
    updateDashboard();
  }
  let summaryHTML = "<h2>Opsummering</h2><ul>";
  gameState.choiceHistory.forEach((ch, i) => {
    if (ch) {
      summaryHTML += `<li>Trin ${i+1}: ${ch.title}</li>`;
    }
  });
  summaryHTML += "</ul>" + bonusNote;
  openModal(summaryHTML, `<button id="afterSummary" class="modern-btn">Fortsæt</button>`);
  document.getElementById('afterSummary').addEventListener('click', () => 
    closeModal(() => finishTask())
  );
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="taskDone" class="modern-btn">OK</button>`);
  document.getElementById('taskDone').addEventListener('click', () => {
    closeModal(() => {
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      const newOnes = gameState.allTasks.splice(0, 2);
      newOnes.forEach(t => { t.isHastende = (Math.random() < 0.1); });
      gameState.tasks = gameState.tasks.concat(newOnes);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
      checkGameOverCondition();
    });
  });
}

/** Tjek for game over eller afslut PI */
function showPIFeedback() {
  const totalPoints = gameState.security + gameState.development;
  if (totalPoints > gameState.highscore) {
    gameState.highscore = totalPoints;
  }
  const eventResult = checkForEvents(gameState);
  let eventMsg = "";
  if (eventResult.eventOccurred) {
    eventMsg = `<p style="color:red;">${eventResult.eventMessage}</p>`;
  }
  let feedbackHTML = `
    <h2>PI Feedback</h2>
    <p>Fantastisk arbejde! Du har gennemført 5 opgaver.</p>
    <p>Din score i dette PI: <strong>${totalPoints}</strong></p>
    <p>Din højeste score: <strong>${gameState.highscore}</strong></p>
    ${eventMsg}
    <p style="margin-top:1rem;">Din score nulstilles nu, og et nyt PI starter.</p>
  `;
  openModal(feedbackHTML, `<button id="continuePI" class="modern-btn">Start Næste PI</button>`);
  document.getElementById('continuePI').addEventListener('click', () => {
    closeModal(() => {
      // Nulstil PI – starttid sættes nu til 40, og alle ekstra risici nulstilles
      gameState.tasksCompleted = 0;
      gameState.time = 40;
      gameState.security = 0;
      gameState.development = 0;
      gameState.totalSecurityChoices = 0;
      gameState.totalDevelopmentChoices = 0;
      gameState.extraCABRiskThisPI = 0;
      gameState.extraCABRiskNextPI = 0;
      gameState.quickChoicesThisPI = 0;
      updateDashboard();
      updateTaskProgress();
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
    });
  });
}

/** Start spillet med intro pop-ups */
showIntro();

export { gameState, updateDashboard, openModal, closeModal };
