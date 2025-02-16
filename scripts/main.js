// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';
import { triggerRandomEvent } from './events.js';

/**
 * Global game state
 */
const gameState = {
  time: 45,   // Starttid for PI
  security: 0,
  development: 0,
  currentTask: null,
  currentStepIndex: 0,
  tasksCompleted: 0,            // 5 opgaver pr. PI
  missionGoals: { security: 22, development: 22 },
  allTasks: [],
  tasks: [],
  choiceHistory: [],
  revisionCount: [],
  revisionMode: false,
  highscore: 0,
  quickChoicesThisPI: 0,
  extraCABRiskNextPI: 0,
  extraCABRiskThisPI: 0,
  totalSecurityChoices: 0,
  totalDevelopmentChoices: 0,
  timePenaltyNextPI: 0,
  timeBonusNextPI: 0,
  firstPI: true,
  // Flag og tæller til hændelser
  skipHastendeFlag: false,      // Om vi har ignoreret en hastende opgave
  eventsTriggeredThisPI: 0      // Antal events i denne PI
};

window.gameState = gameState; // debugging formål

/** Lokationer */
const locationList = [
  "hospital",
  "dokumentation",
  "leverandør",
  "infrastruktur",
  "it‑jura",
  "cybersikkerhed"
];

/** Saml opgaver fra task-filer */
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
shuffleArray(gameState.allTasks);
gameState.tasks = gameState.allTasks.splice(0, 7);
assignHastendeFlag(gameState.tasks);

function assignHastendeFlag(taskArr) {
  taskArr.forEach(t => {
    t.isHastende = (Math.random() < 0.1);
  });
}

/** Chart.js for Tid, Sikkerhed, Udvikling (stacked) */
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

/** Render lokationer i venstre spalte */
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

/** highlightCorrectLocation */
function highlightCorrectLocation(correctLocation) {
  const buttons = document.querySelectorAll('.location-button');
  if (!correctLocation || !gameState.currentTask || gameState.currentStepIndex >= gameState.currentTask.steps.length) {
    buttons.forEach(btn => btn.classList.remove('highlight'));
    return;
  }
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase().includes(correctLocation.toLowerCase())) {
      btn.classList.add('highlight');
    } else {
      btn.classList.remove('highlight');
    }
  });
}

/** Tekstlig feedback i bunden (narrativeUpdate) */
function updateNarrative() {
  const narrativeEl = document.getElementById('narrativeUpdate');
  if (!narrativeEl) return;

  let text = "";
  const progress = gameState.tasksCompleted / 5;
  const total = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  const ratioDev = total > 0 ? (gameState.totalDevelopmentChoices / total) : 0;

  if (progress >= 1.0) {
    text += "Du har fuldført alle opgaver i denne PI – flot arbejde!";
  } else if (progress >= 0.8) {
    text += "Du nærmer dig målet for denne PI – fantastisk!";
  } else if (progress >= 0.6) {
    text += "Du er nu 60% af vejen til at gennemføre PI!";
  } else if (progress >= 0.4) {
    text += "Du er næsten halvvejs – fortsæt den gode indsats!";
  } else if (progress > 0) {
    text += "PI er i gang, og du er kommet i gang, men der er stadig en del at nå.";
  } else {
    text += "PI er i gang, vælg en opgave for at starte!";
  }

  if (gameState.time < 10) {
    text += " Pas på! Du er ved at løbe tør for Tid.";
  }

  if (total > 0) {
    if (ratioDev > 0.65) {
      text += " CAB advarer: Overdreven fokus på udvikling øger risikoen for hackerangreb!";
    } else if (ratioDev < 0.35) {
      text += " CAB advarer: For få udviklingsvalg kan føre til ineffektive arbejdsgange!";
    } else {
      text += " CAB bemærker: Din balance mellem udvikling og sikkerhed ser fornuftig ud.";
    }
  }

  narrativeEl.innerHTML = text;
}

/** Hjælpeknap med grundig tekst */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpHTML = `
    <h2>Få Hjælp</h2>
    <p><strong>Din Rolle som IT-forvalter</strong><br>
    Du skal navigere komplekse IT-systemer i en digital tidsalder. Balancer mellem <em>Udvikling</em> og <em>Sikkerhed</em>, 
    mens du holder øje med din <em>Tid</em>. </p>
    <ul style="text-align:left; margin:0 auto; max-width:500px; line-height:1.5;">
      <li>⏳ <strong>Tid:</strong> Du starter en PI med 45 Tid; hver opgave koster 2 Tid. Rework kan koste ekstra.</li>
      <li>⚖️ <strong>Balance:</strong> Hvis du vælger >65% udvikling eller <35% udvikling, kan du opleve negative hændelser (hackerangreb eller ineffektiv drift).</li>
      <li>🚀 <strong>Hastende Opgaver:</strong> +4 bonus, men +10% risiko for CAB-afvisning. Vælger du en let løsning på en hastende opgave, får du -5 point i straf. Ignorerer du den helt, får du -3 point i næste CAB.</li>
      <li>💥 <strong>Events:</strong> Der kan maksimalt udløses 2 hændelser pr. PI. Hændelser kan være positive, negative eller neutrale. Sandsynlighed stiger ved ekstrem fordeling eller lav tid.</li>
      <li>🔍 <strong>CAB:</strong> Change Advisory Board evaluerer dine valg. Ved afvisning mister du 1 Tid (rework). Ved godkendelse får du en opsummering af dine valg.</li>
      <li>🎯 <strong>Slut på PI:</strong> Når du har gennemført 5 opgaver, sluttes PI med en opsummering. Din Tid, Sikkerhed og Udvikling nulstilles ved næste PI – dog kan særlige straffe eller bonusser overføres.</li>
    </ul>
  `;
  openModal(helpHTML, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/** Introduktion med små emoji-lister */
function showIntro() {
  const introText = `
    <h2>Velkommen til IT‑Tycoon!</h2>
    <ul style="text-align:left; margin:0 auto; max-width:550px; line-height:1.6;">
      <li>🚀 <strong>Mission:</strong> Du er IT‑forvalter og skal styre komplekse systemer i en digital tidsalder.</li>
      <li>⏱️ <strong>Tidspres:</strong> Hver beslutning koster Tid – vær opmærksom på ikke at løbe tør.</li>
      <li>⚖️ <strong>Balancér:</strong> Fokusér på både Udvikling og Sikkerhed for at undgå negative konsekvenser.</li>
      <li>🚨 <strong>Hastende opgaver:</strong> Giver ekstra bonus, men indeholder større risici.</li>
      <li>🔎 <strong>CAB-godkendelse:</strong> Dine ændringer vurderes efter hver opgave, og rework kan koste dig yderligere tid.</li>
    </ul>
    <p style="margin-top:1rem;">Er du klar til at forme fremtidens IT-løsninger?</p>
  `;
  openModal(introText, `<button id="continueIntro" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueIntro').addEventListener('click', () => closeModal(() => showTutorial()));
}

/** Tutorial-pop up med endnu flere emojis */
function showTutorial() {
  const tutText = `
    <h2>Tutorial</h2>
    <ul style="text-align:left; margin:0 auto; max-width:550px; line-height:1.6;">
      <li>1️⃣ Klik på “Vælg ny opgave” for at åbne opgavelisten.</li>
      <li>2️⃣ Hver opgave koster 2 Tid. Vælg trin ved at klikke på korrekt lokation.</li>
      <li>3️⃣ <strong>Udvikling</strong> eller <strong>Sikkerhed</strong> påvirkes af dine valg. 
          Ekstreme valg kan udløse <em>events</em> (fx hackerangreb).</li>
      <li>4️⃣ <strong>Hastende Opgaver</strong> giver +4 bonus, men +10% risiko for afvisning. 
          Vælger du let løsning, -5 point. Ignorerer du en hastende opgave helt, -3 point i næste CAB.</li>
      <li>5️⃣ <strong>Max 2 events pr. PI</strong>. Hver event kan være positiv, negativ eller neutral.</li>
      <li>6️⃣ <strong>Slut:</strong> Efter 5 opgaver viser en opsummering din score, 
          hvorefter en ny PI starter.</li>
    </ul>
    <p style="margin-top:1rem;">Held og lykke – og husk at holde balancen!</p>
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

  const hastendeExists = gameState.tasks.some(t => t.isHastende);

  let rows = "";
  gameState.tasks.forEach((task, index) => {
    const type = (task.focus === 'udvikling') ? "Udviklingsopgave" : "Sikkerhedsopgave";
    const hast = task.isHastende ? "Ja" : "Nej";
    rows += `
      <tr>
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hast}</td>
        <td><button class="commit-task-btn modern-btn" data-idx="${index}">Forpligt</button></td>
      </tr>
    `;
  });

  const hastendeNote = hastendeExists
    ? `<div style="background-color:#ffe9e9; border:1px solid red; padding:0.5rem;">
         <strong>Hastende opgaver!</strong> (+4 bonus, +10% risiko, -5 point hvis let løsning, 
         -3 point straf, hvis du ignorerer dem helt)
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
        ${rows}
      </tbody>
    </table>
  `;
  openModal(modalBody, `<button id="closeTaskModal" class="modern-btn">Luk</button>`);
  document.getElementById('closeTaskModal').addEventListener('click', () => closeModal());

  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const chosenTask = gameState.tasks[idx];

      if (hastendeExists && chosenTask && !chosenTask.isHastende) {
        // Vi ignorerer en hastende opgave => -3 point straf i næste CAB
        gameState.skipHastendeFlag = true;
      }
      if (chosenTask) startTask(chosenTask);
    });
  });
}

function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.choiceHistory = new Array(task.steps.length);
  gameState.revisionCount = new Array(task.steps.length).fill(0);
  gameState.revisionMode = false;

  closeModal();
  renderActiveTask(task);
}

function renderActiveTask(task) {
  const activeDiv = document.getElementById('activeTask');
  activeDiv.innerHTML = `<h2>Aktiv Opgave</h2>`;
  if (task) {
    activeDiv.innerHTML += `<h3>${task.title}</h3><p>${task.shortDesc}</p>`;
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
      activeDiv.innerHTML += `
        <p><strong>Vælg lokation:</strong> 
          ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}
        </p>
      `;
      highlightCorrectLocation(currentStep.location);
    }
  }
}

function handleLocationClick(clickedLoc) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har ikke valgt en opgave endnu!</p>", `<button class="modern-btn">OK</button>`);
    return;
  }
  const st = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLoc.toLowerCase() === st.location.toLowerCase()) {
    showStepChoices(st);
  } else {
    openModal(
      `<h2>Forkert lokation</h2><p>Du valgte ${clickedLoc.toUpperCase()}, men skal bruge ${st.location.toUpperCase()}.</p>`,
      `<button id="wrongLocBtn" class="modern-btn">OK</button>`
    );
    document.getElementById('wrongLocBtn').addEventListener('click', () => closeModal());
  }
}

function showStepChoices(step) {
  const bodyHTML = `<h2>${step.stepDescription}</h2>${step.stepContext || ""}`;
  
  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#f44336; font-weight:bold;'>-2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#43A047; font-weight:bold;'>0 tid</span>");

  let footer = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
  `;
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footer += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }
  openModal(bodyHTML, footer);

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
    gameState.totalDevelopmentChoices++;
    applyChoice(advChoice);
    gameState.choiceHistory[gameState.currentStepIndex] = { title: step.choiceA.label, advanced: true };
    if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
      finishCurrentTask();
    } else {
      closeModal(() => {
        if (gameState.revisionMode) {
          gameState.revisionMode = false;
          cabApproval();
        } else {
          proceedToNextStep();
        }
      });
    }
  });

  document.getElementById('choiceB').addEventListener('click', () => {
    const quickChoice = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    gameState.quickChoicesThisPI++;
    gameState.totalSecurityChoices++;
    applyChoice(quickChoice);
    gameState.choiceHistory[gameState.currentStepIndex] = { title: step.choiceB.label, advanced: false };
    if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
      finishCurrentTask();
    } else {
      closeModal(() => {
        if (gameState.revisionMode) {
          gameState.revisionMode = false;
          cabApproval();
        } else {
          proceedToNextStep();
        }
      });
    }
  });
}

function finishCurrentTask() {
  highlightCorrectLocation(null);
  gameState.currentStepIndex = gameState.currentTask.steps.length;
  closeModal(() => cabApproval());
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
    highlightCorrectLocation(t.steps[gameState.currentStepIndex].location);

    // Forsøg at udløse event – men kun hvis vi ikke har nået 2 events i denne PI
    if (gameState.eventsTriggeredThisPI < 2) {
      triggerRandomEvent(gameState); 
    }
  } else {
    cabApproval();
  }
}

function checkGameOverCondition() {
  if (gameState.time <= 0) {
    let message = "Tiden er opbrugt!";
    const totalPoints = gameState.security + gameState.development;
    if (totalPoints > gameState.highscore) {
      gameState.highscore = totalPoints;
    }
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
    let focusKPI = (t.focus === 'udvikling') ? gameState.development : gameState.security;

    // 1) Straf for skipHastende
    let skipHastendePenalty = "";
    if (gameState.skipHastendeFlag) {
      focusKPI = Math.max(0, focusKPI - 3);
      skipHastendePenalty = "<p style='color:red;'>Du sprang en hastende opgave over – straf: -3 point!</p>";
      gameState.skipHastendeFlag = false;
    }

    // 2) Straf for let løsning i en hastende opgave
    let penaltyNote = "";
    if (t.isHastende && gameState.choiceHistory.some(ch => ch && ch.advanced === false)) {
      focusKPI = Math.max(0, focusKPI - 5);
      penaltyNote = `<p style="color:red;">Du har fået 5 point i straf for at vælge den lette løsning på en hastende opgave.</p>`;
    }

    const allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / 22);

    let extraNote = skipHastendePenalty + penaltyNote;
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
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Udvikling!</p>`;
    } else {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 Sikkerhed!</p>`;
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
  document.getElementById('afterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

function finishTask() {
  highlightCorrectLocation(null);
  gameState.tasksCompleted++;
  updateTaskProgress();

  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="taskDone" class="modern-btn">OK</button>`);
  document.getElementById('taskDone').addEventListener('click', () => {
    closeModal(() => {
      // Fjern currentTask
      gameState.tasks = gameState.tasks.filter(t => t !== gameState.currentTask);
      const newOnes = gameState.allTasks.splice(0, 2);
      assignHastendeFlag(newOnes);
      gameState.tasks = gameState.tasks.concat(newOnes);

      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;

      // Event mellem opgaver (kun hvis under 2 events)
      if (gameState.eventsTriggeredThisPI < 2) {
        triggerRandomEvent(gameState);
      }

      checkGameOverCondition();
    });
  });
}

/** showPIFeedback – Slut med 5 opgaver */
function showPIFeedback() {
  const totalPoints = gameState.security + gameState.development;
  if (totalPoints > gameState.highscore) {
    gameState.highscore = totalPoints;
  }

  // Evt. event her (begrænset til 2 pr. PI)
  if (gameState.eventsTriggeredThisPI < 2) {
    triggerRandomEvent(gameState);
  }

  let feedbackHTML = `
    <h2>PI Feedback</h2>
    <p>Fantastisk arbejde! Du har gennemført 5 opgaver.</p>
    <p>Din score i dette PI: <strong>${totalPoints}</strong></p>
    <p>Din højeste score: <strong>${gameState.highscore}</strong></p>
    <p>Din Tid, Sikkerhed og Udvikling nulstilles nu, og et nyt PI starter.</p>
  `;
  openModal(feedbackHTML, `<button id="continuePI" class="modern-btn">Start Næste PI</button>`);
  document.getElementById('continuePI').addEventListener('click', () => {
    closeModal(() => {
      gameState.tasksCompleted = 0;
      let newTime = 40;
      if (gameState.timePenaltyNextPI > 0) {
        newTime -= gameState.timePenaltyNextPI;
        if (newTime < 0) newTime = 0;
        gameState.timePenaltyNextPI = 0;
      }
      if (gameState.timeBonusNextPI > 0) {
        newTime += gameState.timeBonusNextPI;
        gameState.timeBonusNextPI = 0;
      }
      gameState.time = newTime;
      gameState.security = 0;
      gameState.development = 0;
      gameState.totalSecurityChoices = 0;
      gameState.totalDevelopmentChoices = 0;
      gameState.extraCABRiskThisPI = 0;
      gameState.extraCABRiskNextPI = 0;
      gameState.quickChoicesThisPI = 0;
      gameState.skipHastendeFlag = false;

      // VIGTIGT: Nulstil eventCounter
      gameState.eventsTriggeredThisPI = 0;

      updateDashboard();
      updateTaskProgress();
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;

      if (gameState.firstPI) {
        gameState.firstPI = false;
      }
    });
  });
}

/** Start game – intro og tutorial kun første gang */
(function initGame() {
  if (gameState.firstPI) {
    showIntro();
  }
})();

export { gameState, updateDashboard, openModal, closeModal };
