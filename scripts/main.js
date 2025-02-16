// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';
import { triggerRandomEvent } from './events.js';

/**
 * Globalt gameState
 */
const gameState = {
  time: 45,   // Starttid for den første PI
  security: 0,
  development: 0,
  currentTask: null,
  currentStepIndex: 0,
  tasksCompleted: 0,        // PI = 5 opgaver
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
  firstPI: true,   // Markér at dette er første PI, så vi viser intro+tutorial
  skipHastendeFlag: false  // Straf hvis man ignorerer en hastende opgave
};

/** Gør det tilgængeligt globalt, fx til debugging */
window.gameState = gameState;

/** Lokationsliste */
const locationList = [
  "hospital",
  "dokumentation",
  "leverandør",
  "infrastruktur",
  "it‑jura",
  "cybersikkerhed"
];

/**
 * Saml alle opgaver (hospital, infrastruktur, cybersikkerhed)
 * Bland dem og tag 7 styk som potentielle
 */
gameState.allTasks = [].concat(
  window.hospitalTasks,
  window.infrastrukturTasks,
  window.cybersikkerhedTasks
);
shuffleArray(gameState.allTasks);
gameState.tasks = gameState.allTasks.splice(0, 7);

/** Tildel isHastende = true i 10% af tilfældene */
function assignHastendeFlag(tasks) {
  tasks.forEach(t => {
    t.isHastende = (Math.random() < 0.1);
  });
}
assignHastendeFlag(gameState.tasks);

/** Opsæt Chart.js – Tid vs. Score (stacket: security, development) */
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

/** Viser "Opgave X/5" */
function updateTaskProgress() {
  const progressEl = document.getElementById('taskProgress');
  if (progressEl) {
    progressEl.textContent = `Opgave ${gameState.tasksCompleted} / 5`;
  }
  updateNarrative();
}
updateTaskProgress();

/** Lokation-knapper i venstre side */
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

/** highlightCorrectLocation: highlight "den rigtige" lokation eller fjern highlight */
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

/** updateNarrative: Vis løbende status/advarsler fra "CAB" */
function updateNarrative() {
  const narrativeEl = document.getElementById('narrativeUpdate');
  if (!narrativeEl) return;

  let text = "";
  const progress = gameState.tasksCompleted / 5;
  const total = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  const ratioDev = total > 0 ? (gameState.totalDevelopmentChoices / total) : 0;

  // Opgaveprogress
  if (progress >= 1.0) {
    text += "Du har fuldført alle opgaver i denne PI – flot arbejde!";
  } else if (progress >= 0.8) {
    text += "Du nærmer dig målet for denne PI – fantastisk!";
  } else if (progress >= 0.6) {
    text += "Du er nu 60% af vejen til at gennemføre PI!";
  } else if (progress >= 0.4) {
    text += "Du er næsten halvvejs – fortsæt den gode indsats!";
  } else if (progress > 0) {
    text += "Du er i gang med PI – hold tempoet!";
  } else {
    text += "PI er i gang – vælg en opgave for at starte!";
  }

  // Tid
  if (gameState.time < 10) {
    text += " Pas på! Du er ved at løbe tør for Tid.";
  }

  // Ratio
  if (total > 0) {
    if (ratioDev > 0.65) {
      text += " CAB advarer: Overdreven fokus på udvikling kan øge risikoen for hackerangreb!";
    } else if (ratioDev < 0.35) {
      text += " CAB advarer: For få udviklingsvalg kan føre til ineffektive arbejdsgange!";
    } else {
      text += " CAB bemærker: Din balance mellem udvikling og sikkerhed ser fornuftig ud.";
    }
  }

  narrativeEl.innerHTML = text;
}

/** Hjælp-knap */
document.getElementById('helpButton').addEventListener('click', showHelp);
function showHelp() {
  const helpHTML = `
    <h2>Hjælp – Udførlig</h2>
    <ul style="text-align:left; margin:0 auto; max-width:450px; line-height:1.6;">
      <li>⚙️ <strong>Formål:</strong> Gennemfør 5 opgaver pr. PI for at opnå en høj samlede score 
          (sikkerhed + udvikling) uden at løbe tør for tid.</li>
      <li>⌛ <strong>Tid:</strong> Du starter med 45 Tid i hver PI. 
          Hver opgave koster 2 Tid, og rework kan koste ekstra tid.</li>
      <li>⚖️ <strong>Balance mellem Udvikling og Sikkerhed:</strong> 
          Undgå at fokusere for ensidigt på udvikling eller sikkerhed – 
          det kan udløse negative hændelser (fx hackerangreb eller ineffektiv drift).</li>
      <li>🚨 <strong>Hastende opgaver:</strong> Giver +4 bonus ved succes, men +10% risiko for afvisning i CAB. 
          Hvis du vælger den hurtige løsning i en hastende opgave, får du -5 point straf. 
          Hvis du ignorerer en hastende opgave helt (dvs. vælger en anden opgave, mens en hastende var i backlog), 
          får du -3 point ved næste CAB.</li>
      <li>❗ <strong>Events:</strong> Hændelser kan ske mellem trin og ved afslutning af en opgave. 
          Sandsynligheden er højere, hvis du har en ekstrem fordeling (ratio >0.65 eller <0.35) 
          eller meget lav tid. Events kan enten være positive (fx ekstra tid), negative (fx hackerangreb) eller neutrale.</li>
      <li>🔍 <strong>CAB:</strong> Change Advisory Board evaluerer dine valg. 
          - Hvis en opgave afvises, koster det rework (1 tid). 
          - Efter 5 opgaver er PI færdig, og du ser en opsummering. 
            Herefter starter en ny PI, og din tid resettes (til 40 med evt. modifikationer).</li>
    </ul>
    <p style="margin-top:1rem; text-align:center;">
      Held og lykke med <strong>IT‑Tycoon</strong>!
    </p>
  `;
  openModal(helpHTML, `<button id="closeHelp" class="modern-btn">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

/** Intro-pop-up 1 (emoji og længere tekst) */
function showIntro() {
  const introText = `
    <h2>Velkommen til IT‑Tycoon!</h2>
    <ul style="text-align:left; margin:0 auto; max-width:500px; line-height:1.6;">
      <li>🚀 <strong>Mission:</strong> Du er IT‑forvalter i en kompleks digital tidsalder.</li>
      <li>⏱️ <strong>Tidspres:</strong> Hver beslutning koster tid – 
          balancer dine valg for at undgå at løbe tør.</li>
      <li>🎯 <strong>Mål:</strong> Fuldfør 5 opgaver pr. PI, optimer systemerne, og få en høj samlet score.</li>
      <li>💡 <strong>CAB:</strong> Et panel, der evaluerer dine ændringer – 
          forkerte valg kan medføre straf og rework.</li>
      <li>🤖 <strong>Strategi:</strong> Hvert valg giver enten Sikkerhed eller Udvikling. 
          En afbalanceret strategi er ofte vejen frem, men hastende opgaver kan give store gevinster 
          eller store risici.</li>
    </ul>
    <p style="margin-top:1rem;">Er du klar til at træde ind i rollen som digital strateg?</p>
  `;
  openModal(introText, `<button id="continueIntro" class="modern-btn">Fortsæt</button>`);
  document.getElementById('continueIntro').addEventListener('click', () => closeModal(() => showTutorial()));
}

/** Intro-pop-up 2: Tutorial med små emojis */
function showTutorial() {
  const tutText = `
    <h2>Tutorial</h2>
    <p style="text-align:left; margin:0 auto; max-width:500px; line-height:1.6;">
      <strong>Sådan spilles IT‑Tycoon:</strong><br><br>
      ✅ Klik <em>“Vælg ny opgave”</em> for at åbne opgavelisten (hvert valg koster 2 Tid).<br>
      ✅ Dine trinvalg giver point i <strong>Udvikling</strong> eller <strong>Sikkerhed</strong>.<br>
      ✅ <strong>Hastende opgaver</strong> (🚨) giver +4 bonus men +10% risiko i CAB og straf, 
         hvis du vælger den hurtige løsning.<br>
      ✅ <strong>Balance</strong>: Over 65% udvikling (ratioDev > 0.65) kan medføre hackerangreb. 
         Under 35% udvikling giver ineffektiv drift.<br>
      ✅ <strong>Events</strong>: Kan ske mellem trin eller ved opgaveslut – 
         især hvis du er ekstrem i dine valg eller har lav tid.<br>
      ✅ <strong>CAB</strong>: Vurderer dine valg. Afvisning => rework (1 Tid). 
         Succes => du fortsætter. Efter 5 opgaver afsluttes PI, og du kan se din score.
    </p>
    <p style="text-align:center; margin-top:1rem;">
      Klar til at kaste dig ud i strategiske IT-beslutninger?
    </p>
  `;
  openModal(tutText, `<button id="closeTut" class="modern-btn">Luk</button>`);
  document.getElementById('closeTut').addEventListener('click', () => closeModal());
}

/** Vælg ny opgave-knap */
document.getElementById('newTaskBtn').addEventListener('click', openTaskSelectionModal);
function openTaskSelectionModal() {
  if (gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har allerede en aktiv opgave!</p>", `<button id="activeWarn" class="modern-btn">OK</button>`);
    document.getElementById('activeWarn').addEventListener('click', () => closeModal());
    return;
  }

  // Tjek om en hastende opgave findes i backlog
  const hastendeExists = gameState.tasks.some(t => t.isHastende);
  
  let rowsHTML = "";
  gameState.tasks.forEach((task, index) => {
    const type = (task.focus === 'udvikling') ? "Udviklingsopgave" : "Sikkerhedsopgave";
    const hast = task.isHastende ? "Ja" : "Nej";
    rowsHTML += `
      <tr>
        <td>${task.title}</td>
        <td>${type}</td>
        <td>${hast}</td>
        <td>
          <button class="commit-task-btn modern-btn" data-idx="${index}">Forpligt</button>
        </td>
      </tr>
    `;
  });

  const hastNote = hastendeExists 
    ? `<div style="background-color:#ffe9e9; border:1px solid red; padding:0.5rem;">
         <strong>Hastende opgaver!</strong> (+4 bonus, +10% ekstra risiko, -5 point ved hurtig løsning, 
         -3 point ved at ignorere helt)
       </div>` 
    : "";

  const modalBody = `
    <h2>Vælg en opgave</h2>
    ${hastNote}
    <table class="task-table">
      <thead>
        <tr>
          <th>Titel</th>
          <th>Type</th>
          <th>Haster</th>
          <th>Forpligt</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>
  `;
  openModal(modalBody, `<button id="closeTaskModal" class="modern-btn">Luk</button>`);
  document.getElementById('closeTaskModal').addEventListener('click', () => closeModal());

  document.querySelectorAll('.commit-task-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = e.target.getAttribute('data-idx');
      const chosen = gameState.tasks[idx];

      // Hvis en hastende opgave findes, men man vælger en IKKE-hastende => skipHastendeFlag
      if (hastendeExists && chosen && !chosen.isHastende) {
        gameState.skipHastendeFlag = true;
      }

      if (chosen) {
        startTask(chosen);
      }
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
  if (!task) return;

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
    // highlight
    const curStep = task.steps[gameState.currentStepIndex];
    activeDiv.innerHTML += `<p><strong>Vælg lokation:</strong> ${curStep.location.toUpperCase()} ${getIcon(curStep.location)}</p>`;
    highlightCorrectLocation(curStep.location);
  }
}

function handleLocationClick(loc) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Du har ikke valgt en opgave endnu!</p>", `<button id="alertLoc" class="modern-btn">OK</button>`);
    document.getElementById('alertLoc').addEventListener('click', () => closeModal());
    return;
  }
  const st = gameState.currentTask.steps[gameState.currentStepIndex];
  if (loc.toLowerCase() === st.location.toLowerCase()) {
    showStepChoices(st);
  } else {
    openModal(
      `<h2>Forkert lokation</h2>
       <p>Du valgte ${loc.toUpperCase()}, men skal bruge ${st.location.toUpperCase()}.</p>`,
      `<button id="locWrong" class="modern-btn">OK</button>`
    );
    document.getElementById('locWrong').addEventListener('click', () => closeModal());
  }
}

function showStepChoices(step) {
  const bodyHTML = `<h2>${step.stepDescription}</h2>${step.stepContext || ""}`;

  let cATxt = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#f44336; font-weight:bold;'>-2 tid</span>");
  let cBTxt = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#43A047; font-weight:bold;'>0 tid</span>");

  let footHTML = `
    <button id="choiceA" class="modern-btn">${step.choiceA.label} (${cATxt})</button>
    <button id="choiceB" class="modern-btn">${step.choiceB.label} (${cBTxt})</button>
  `;
  if (gameState.revisionCount[gameState.currentStepIndex] < 1) {
    footHTML += ` <button id="undoChoice" class="modern-btn">Fortryd</button>`;
  }
  openModal(bodyHTML, footHTML);

  // Fortryd
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

    // Udløs event
    triggerRandomEvent(gameState);
  } else {
    cabApproval();
  }
}

function checkGameOverCondition() {
  if (gameState.time <= 0) {
    let msg = "Tiden er opbrugt!";
    const totalPoints = gameState.security + gameState.development;
    msg += `<br>Samlet score: ${totalPoints}<br>Highscore: ${gameState.highscore}`;
    openModal(`<h2>Spillet er slut</h2><p>${msg}</p>`, "");
    setTimeout(() => location.reload(), 4000);
  } else if (gameState.tasksCompleted >= 5) {
    showPIFeedback();
  }
}

function cabApproval() {
  closeModal(() => {
    const t = gameState.currentTask;
    if (!t) return; // Sikkerhedstjek

    let focusKPI = (t.focus === 'udvikling') ? gameState.development : gameState.security;
    let extraText = "";

    // 1) SkipHastende => -3 point
    if (gameState.skipHastendeFlag) {
      focusKPI = Math.max(0, focusKPI - 3);
      extraText += `<p style="color:red;">Du ignorerede en hastende opgave – straf: -3 point!</p>`;
      gameState.skipHastendeFlag = false;
    }

    // 2) Let løsning i hastende => -5 point
    if (t.isHastende && gameState.choiceHistory.some(ch => ch && ch.advanced === false)) {
      focusKPI = Math.max(0, focusKPI - 5);
      extraText += `<p style="color:red;">Du tog den hurtige løsning i en hastende opgave => -5 point!</p>`;
    }

    let allAdvanced = gameState.choiceHistory.every(ch => ch && ch.advanced === true);
    let chance = allAdvanced ? 1 : Math.min(1, focusKPI / 22);

    if (t.isHastende) {
      chance -= 0.1;
      if (chance < 0) chance = 0;
      extraText += `<p style="color:red;">Hastende opgave: +10% ekstra risiko, +4 bonus ved succes.</p>`;
    }

    // EkstraCABRisk?
    if (gameState.extraCABRiskThisPI > 0) {
      chance -= gameState.extraCABRiskThisPI;
      if (chance < 0) chance = 0;
      extraText += `<p style="color:red;">Ekstra risiko fra forrige PI: +${Math.round(gameState.extraCABRiskThisPI * 100)}%.</p>`;
    }

    const approvalPct = Math.floor(chance * 100);
    const riskPct = 100 - approvalPct;

    const cabHTML = `
      <h2>CAB</h2>
      ${extraText}
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
        openModal("<h2>CAB Afvisning</h2><p>Rework er påkrævet. Du mister 1 Tid!</p>", `<button id="reworkBtn" class="modern-btn">OK</button>`);
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
  let revisable = [];
  for (let i = 0; i < gameState.choiceHistory.length; i++) {
    if (gameState.choiceHistory[i] && !gameState.choiceHistory[i].advanced && gameState.revisionCount[i] < 1) {
      revisable.push(i);
    }
  }
  if (revisable.length === 0) {
    openModal("<h2>Ingen revidérbare trin</h2><p>Alle trin er enten avancerede eller allerede revideret.</p>", `<button id="noRevOk" class="modern-btn">OK</button>`);
    document.getElementById('noRevOk').addEventListener('click', () => closeModal(() => cabApproval()));
    return;
  }
  let listHTML = "<h2>Vælg et trin at revidere</h2><ul>";
  revisable.forEach(idx => {
    let stDesc = gameState.currentTask.steps[idx].stepDescription;
    listHTML += `<li><button class="revisionBtn modern-btn" data-idx="${idx}">Trin ${idx+1}: ${stDesc}</button></li>`;
  });
  listHTML += "</ul>";

  openModal(listHTML, "");
  document.querySelectorAll('.revisionBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
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

/** Efter CAB-godkendelse => summarise */
function showTaskSummary() {
  let bonusNote = "";
  if (gameState.currentTask.isHastende) {
    if (gameState.currentTask.focus === "udvikling") {
      gameState.development += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 i udvikling!</p>`;
    } else {
      gameState.security += 4;
      bonusNote = `<p style="color:green;">Hastende bonus: +4 i sikkerhed!</p>`;
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

/** Afslut opgave => +1 til tasksCompleted => event => checkGameOverCondition */
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

      // Event
      triggerRandomEvent(gameState);

      checkGameOverCondition();
    });
  });
}

/** showPIFeedback => reset for ny PI */
function showPIFeedback() {
  const totalPoints = gameState.security + gameState.development;
  if (totalPoints > gameState.highscore) {
    gameState.highscore = totalPoints;
  }
  triggerRandomEvent(gameState);

  let feedbackHTML = `
    <h2>PI Feedback</h2>
    <p>Fantastisk arbejde! Du har gennemført 5 opgaver i denne PI.</p>
    <p>Din score i dette PI: <strong>${totalPoints}</strong></p>
    <p>Din højeste score: <strong>${gameState.highscore}</strong></p>
    <p style="margin-top:1rem;">Din score nulstilles nu, og et nyt PI starter.</p>
  `;
  openModal(feedbackHTML, `<button id="continuePI" class="modern-btn">Start Næste PI</button>`);
  document.getElementById('continuePI').addEventListener('click', () => {
    closeModal(() => {
      // Nulstil
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

/** Init med intro + tutorial kun 1. gang */
(function initGame() {
  if (gameState.firstPI) {
    showIntro();
  }
})();

export { gameState, updateDashboard, openModal, closeModal };
