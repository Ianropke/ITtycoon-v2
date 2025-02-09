// scripts/main.js
import { openModal, closeModal } from './modal.js';
import { shuffleArray, getIcon } from './utils.js';

// Global gameState
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
  choiceHistory: [] // Én post per trin
};

// Saml alle opgaver fra de tre task-filer
// Forudsæt, at hospitalTasks, infrastrukturTasks og cybersikkerhedTasks er defineret globalt via window
gameState.allTasks = [].concat(window.hospitalTasks, window.infrastrukturTasks, window.cybersikkerhedTasks);

// Bland opgaverne tilfældigt
shuffleArray(gameState.allTasks);

// Tag de første 7 opgaver som de potentielle opgaver
gameState.tasks = gameState.allTasks.splice(0, 7);

// Initialiser Chart.js-dashboardet
const ctx = document.getElementById('kpiChart').getContext('2d');
const kpiChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Tid', 'Sikkerhed', 'Udvikling'],
    datasets: [{
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
    }]
  },
  options: { scales: { y: { beginAtZero: true } } }
});

function updateDashboard() {
  if (gameState.time < 0) gameState.time = 0;
  kpiChart.data.datasets[0].data = [gameState.time, gameState.security, gameState.development];
  kpiChart.update();
}

function updateTaskProgress() {
  const progressElement = document.getElementById('taskProgress');
  progressElement.textContent = `Opgave ${gameState.tasksCompleted} / 10`;
}
updateTaskProgress();

// Render lokationer i venstre side
const locationsList = ["hospital", "dokumentation", "leverandør", "infrastruktur", "it‑jura", "cybersikkerhed"];
function renderLocations() {
  const locationsDiv = document.getElementById('locations');
  locationsDiv.innerHTML = "";
  locationsList.forEach(loc => {
    const btn = document.createElement('button');
    btn.className = 'location-button';
    btn.innerHTML = loc.toUpperCase() + " " + getIcon(loc);
    btn.addEventListener('click', () => handleLocationClick(loc));
    locationsDiv.appendChild(btn);
  });
}
renderLocations();

// "Få hjælp"-knap
document.getElementById('helpButton').addEventListener('click', showHelp);

function showHelp() {
  const helpContent = `
    <h2>Få Hjælp</h2>
    <p><strong>Din Rolle som IT-forvalter</strong><br>
    Balancer KPI’erne Tid, Sikkerhed og Udvikling. Træf de rette beslutninger for at optimere din organisations sikkerhed og udvikling, mens du holder øje med din tid.</p>
    <p><strong>Spillets Struktur:</strong><br>
    Hver opgave består af flere trin med to muligheder – komplet løsning (2 tidspoint, større bonus) og hurtig løsning (0 tidspoint, mindre bonus). Dashboardet viser din tid og opgaveprogress (f.eks. "Opgave 3/10").</p>
    <p>Held og lykke!</p>
  `;
  openModal(helpContent, `<button id="closeHelp">Luk</button>`);
  document.getElementById('closeHelp').addEventListener('click', () => closeModal());
}

function showIntro() {
  const introContent = `
    <h2>Velkommen til IT‑Tycoon</h2>
    <p>Du agerer IT‑forvalter under SAFe og starter med PI Planning, hvor målsætningen for udvikling og sikkerhed fastsættes.</p>
    <p>Venstre side viser din KPI-graf og en liste med lokationer; højre side viser aktive og potentielle opgaver.</p>
    <p>Når du vælger en opgave, skal du trykke på "Forpligt opgave" for at starte den.</p>
    <p>Hvert valg i et trin viser sin tidsomkostning – komplet løsning koster 2 tidspoint og giver en større bonus; hurtig løsning koster 0 tidspoint og giver en mindre bonus.</p>
  `;
  const modalContent = document.querySelector('.modal-content');
  modalContent.style.height = '48vh';
  openModal(introContent, `<button id="startGame">Start Spillet</button>`);
  document.getElementById('startGame').addEventListener('click', () => {
    modalContent.style.height = '40vh';
    closeModal(() => showSprintGoal());
  });
}

function showSprintGoal() {
  const sprintContent = `
    <h2>PI Planning</h2>
    <p>Målsætning: Opnå mindst ${gameState.missionGoals.security} i sikkerhed og ${gameState.missionGoals.development} i udvikling inden for sprintet.</p>
  `;
  openModal(sprintContent, `<button id="continueTutorial">Fortsæt til Tutorial</button>`);
  document.getElementById('continueTutorial').addEventListener('click', () => closeModal(() => startTutorial()));
}

function startTutorial() {
  const tutorialContent = `
    <h2>Tutorial</h2>
    <p><strong>Spillets Koncept:</strong><br>
    Du navigerer komplekse IT-systemer og balancerer KPI’erne Tid, Sikkerhed og Udvikling. Dit mål er at nå sprintmålsætningen, som du kan følge i grafen.</p>
    <p><strong>UI-Layout:</strong><br>
    Venstre side: KPI-graf og lokationer<br>
    Højre side: Aktiv opgave og potentielle opgaver</p>
    <p><strong>Spillets Mekanik:</strong><br>
    Når du forpligter en opgave, gennemfører du hvert trin ved at vælge den korrekte lokation. Komplet løsning koster 2 tidspoint og giver en større bonus; hurtig løsning koster 0 tidspoint og giver en mindre bonus.</p>
    <p><strong>Efter alle trin:</strong><br>
    Dine ændringer sendes til CAB for evaluering. <em>Sikkerhedsvurdering</em> (eller <em>Udviklingsvurdering</em>) angiver den risiko, at dine ændringer ikke bliver godkendt af CAB. Hvis målene opfyldes, godkender CAB dem; hvis ikke, afviser de dem, og du skal udføre rework – hvilket trækker ekstra tid. Brug CAB-feedbacken til at justere din strategi.</p>
  `;
  openModal(tutorialContent, `<button id="endTutorial">Næste</button>`);
  document.getElementById('endTutorial').addEventListener('click', () => closeModal(() => renderPotentialTasks()));
}

function renderPotentialTasks() {
  const potentialTasksDiv = document.getElementById('potentialTasks');
  potentialTasksDiv.innerHTML = '<h2>Potentielle Opgaver</h2>';
  gameState.tasks.forEach(task => {
    if (!task) {
      console.warn("Encountered undefined task, skipping.");
      return;
    }
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    const infoDiv = document.createElement('div');
    infoDiv.className = 'task-info';
    infoDiv.innerHTML = `<h3>${task.title}</h3><p>${task.shortDesc}</p>`;
    const commitBtn = document.createElement('button');
    commitBtn.textContent = 'Forpligt opgave';
    commitBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (gameState.currentTask !== null) {
        openModal("<h2>Advarsel</h2><p>Du har allerede forpligtet dig til en opgave!</p>", `<button id="okButton">OK</button>`);
        document.getElementById('okButton').addEventListener('click', () => closeModal());
        return;
      }
      startTask(task);
    });
    const helpBtn = document.createElement('button');
    helpBtn.textContent = 'Arkitekthjælp';
    helpBtn.addEventListener('click', e => {
      e.stopPropagation();
      let hint = task.title.toLowerCase().includes("hospital") || task.title.toLowerCase().includes("lims")
        ? "Denne opgave understøtter Udvikling."
        : "Denne opgave understøtter Sikkerhed.";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${task.narrativeIntro ? task.narrativeIntro : hint}</p>`,
        `<button id="closeArchitectHelp">Luk</button>`
      );
      document.getElementById('closeArchitectHelp').addEventListener('click', () =>
        closeModal(() => showStepChoices(gameState.currentTask.steps[gameState.currentStepIndex]))
      );
    });
    taskItem.appendChild(infoDiv);
    taskItem.appendChild(commitBtn);
    taskItem.appendChild(helpBtn);
    potentialTasksDiv.appendChild(taskItem);
  });
}

function startTask(task) {
  gameState.currentTask = task;
  gameState.currentStepIndex = 0;
  gameState.architectHelpUsed = false;
  // Overskriv eventuelle tidligere valg for dette task – sikrer én post pr. trin
  gameState.choiceHistory = [];
  renderActiveTask(task);
}

function renderActiveTask(task) {
  const activeTaskDiv = document.getElementById('activeTask');
  activeTaskDiv.innerHTML = `<h2>${task.title}</h2><p>${task.shortDesc}</p>`;
  if (task.steps && task.steps.length > 0) {
    const locationsListElem = document.createElement('ul');
    locationsListElem.id = 'taskLocations';
    task.steps.forEach((step, idx) => {
      const li = document.createElement('li');
      if (idx < gameState.currentStepIndex) {
        li.innerHTML = `${idx + 1}. ${step.location.toUpperCase()} ${getIcon(step.location)} <span class="done">✔</span>`;
      } else {
        li.textContent = `${idx + 1}. ${step.location.toUpperCase()} ${getIcon(step.location)}`;
      }
      locationsListElem.appendChild(li);
    });
    activeTaskDiv.appendChild(locationsListElem);
    const currentStep = task.steps[gameState.currentStepIndex];
    const instruction = document.createElement('p');
    instruction.innerHTML = `<strong>Vælg lokation:</strong> ${currentStep.location.toUpperCase()} ${getIcon(currentStep.location)}`;
    activeTaskDiv.appendChild(instruction);
  }
}

function handleLocationClick(clickedLocation) {
  if (!gameState.currentTask) {
    openModal("<h2>Advarsel</h2><p>Vælg en opgave og forpligt dig først!</p>", `<button id="alertOk">OK</button>`);
    document.getElementById('alertOk').addEventListener('click', () => closeModal());
    return;
  }
  const currentStep = gameState.currentTask.steps[gameState.currentStepIndex];
  if (clickedLocation.toLowerCase() === currentStep.location.toLowerCase()) {
    showStepChoices(currentStep);
  } else {
    openModal(
      `<h2>Fejl</h2><p>Forkert lokation.<br>Du valgte "${clickedLocation.toUpperCase()}", men den korrekte lokation er "${currentStep.location.toUpperCase()}".<br>Læs trinbeskrivelsen og prøv igen.</p>`,
      `<button id="errorOk">OK</button>`
    );
    document.getElementById('errorOk').addEventListener('click', () => closeModal());
  }
}

function showStepChoices(step) {
  let choiceAText = step.choiceA.text.replace(/-?\d+\s*tid/, "<span style='color:#800000;'>−2 tid</span>");
  let choiceBText = step.choiceB.text.replace(/-?\d+\s*tid/, "<span style='color:#006400;'>0 tid</span>");
  if (gameState.currentTask.focus === "sikkerhed") {
    choiceAText = choiceAText.replace(/[\+\-]?\d+\s*udvikling/gi, "").trim();
    choiceBText = choiceBText.replace(/[\+\-]?\d+\s*udvikling/gi, "").trim();
  }
  const choiceContent = `
    <h2>${step.stepDescription}</h2>
    ${step.stepContext ? `<p>${step.stepContext}</p>` : ""}
    <div class="choice-buttons">
      <button id="choiceA">${step.choiceA.label} (${choiceAText})</button>
      <button id="choiceB">${step.choiceB.label} (${choiceBText})</button>
      <button id="architectHelp">${gameState.architectHelpUsed ? 'Arkitekthjælp brugt' : 'Brug Arkitekthjælp'}</button>
      <button id="undoChoice">Fortryd</button>
    </div>
  `;
  openModal(choiceContent);
  document.getElementById('undoChoice').addEventListener('click', () => closeModal(() => showStepChoices(step)));
  
  document.getElementById('choiceA').addEventListener('click', () => {
    let modifiedChoice = { ...step.choiceA, applyEffect: { ...step.choiceA.applyEffect, timeCost: 2 } };
    applyChoice(modifiedChoice);
    // Overskriv det valgte valg for det nuværende trin
    gameState.choiceHistory[gameState.currentStepIndex] = `${step.choiceA.label} (${choiceAText})`;
    closeModal(() => {
      if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
        cabApproval();
      } else {
        proceedToNextStep();
      }
    });
  });
  
  document.getElementById('choiceB').addEventListener('click', () => {
    let modifiedChoice = { ...step.choiceB, applyEffect: { ...step.choiceB.applyEffect, timeCost: 0 } };
    applyChoice(modifiedChoice);
    // Overskriv det valgte valg for det nuværende trin
    gameState.choiceHistory[gameState.currentStepIndex] = `${step.choiceB.label} (${choiceBText})`;
    closeModal(() => {
      if (gameState.currentStepIndex === gameState.currentTask.steps.length - 1) {
        cabApproval();
      } else {
        proceedToNextStep();
      }
    });
  });
  
  document.getElementById('architectHelp').addEventListener('click', () => {
    if (!gameState.architectHelpUsed) {
      gameState.architectHelpUsed = true;
      let hint = "Denne opgave understøtter Sikkerhed.";
      openModal(
        `<h2>Arkitekthjælp</h2><p>Anbefalet valg: ${step.choiceA.label}</p><p>${hint}</p>`,
        `<button id="closeArchitectHelp">Luk</button>`
      );
      document.getElementById('closeArchitectHelp').addEventListener('click', () =>
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
    return;
  }
}

function checkGameOverCondition() {
  if (gameState.tasksCompleted < 10 &&
      (gameState.security >= gameState.missionGoals.security && gameState.development >= gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Selvom dine KPI’er var på rette niveau, har du ikke gennemført de 10 nødvendige opgaver. Du skal fuldføre alle opgaver for at nå sprintets mål.</p>");
  } else if (gameState.tasksCompleted >= 10 &&
             (gameState.security < gameState.missionGoals.security || gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du har gennemført 10 opgaver, men dine KPI’er (Sikkerhed og Udvikling) nåede ikke sprintmålet. Vurder dine beslutninger og forsøg igen.</p>");
  } else if (gameState.tasksCompleted < 10 &&
             (gameState.security < gameState.missionGoals.security || gameState.development < gameState.missionGoals.development)) {
    openModal("<h2>Din tid er opbrugt!</h2><p>Du har hverken gennemført de krævede 10 opgaver eller opnået de fastsatte KPI-mål for Sikkerhed og Udvikling. Genovervej dine strategier og prøv igen.</p>");
  } else {
    openModal("<h2>Din tid er opbrugt!</h2><p>Spillet slutter, fordi du løb tør for tid.</p>");
  }
  setTimeout(() => location.reload(), 4000);
}

function cabApproval() {
  // Luk den nuværende modal og vis CAB-modalen
  closeModal(() => {
    // Bestem hvilken KPI der skal bruges, afhængig af taskens fokus
    let focusKPI, missionGoal;
    if (gameState.currentTask.focus === "sikkerhed") {
      focusKPI = gameState.security;
      missionGoal = gameState.missionGoals.security;
    } else {
      focusKPI = gameState.development;
      missionGoal = gameState.missionGoals.development;
    }
    // Tjek om alle valg for det aktuelle task er avancerede (indeholder "-2 tid")
    let allComprehensive = gameState.choiceHistory.every(item => item && item.includes("-2 tid"));
    let bonus = 0;
    if (allComprehensive) {
      // Hvis alle valg er avancerede, skal den samlede KPI opnå målet, dvs. 100% godkendelse
      bonus = missionGoal - focusKPI;
    }
    // Beregn approvalPercentage (hvor 100% betyder fuld godkendelse)
    let approvalPercentage = Math.floor((focusKPI + bonus) / missionGoal * 100);
    // Risiko for afvisning er det modsatte
    let riskPercentage = 100 - approvalPercentage;
    
    // Forklaring: Vis godkendelsesprocent og risiko for afvisning
    const cabExplanation = `
      <h2>CAB (Change Advisory Board)</h2>
      <p>CAB er et panel af eksperter, der vurderer dine ændringer, før de implementeres.</p>
      <p><strong>Godkendelsesprocent:</strong> ${approvalPercentage}%</p>
      <p><strong>Risiko for afvisning:</strong> ${riskPercentage}%</p>
      <p>Denne vurdering angiver, hvor stor en chance der er for, at dine ændringer ikke bliver godkendt. Hvis du når 100% godkendelse, er risikoen for afvisning 0%.</p>
      ${allComprehensive ? "" : "<p>Hvis du ønsker at ændre dine valg, kan du gå tilbage og revidere dem.</p>"}
    `;
    
    // Hvis alle valg er avancerede, fjern "Gå tilbage"
    let buttonsHTML = allComprehensive 
      ? `<button id="evaluateCAB">Evaluér nu</button>` 
      : `<button id="evaluateCAB">Evaluér nu</button> <button id="goBackCAB">Gå tilbage</button>`;
    
    openModal(cabExplanation, buttonsHTML);
    
    document.getElementById('evaluateCAB').addEventListener('click', () => {
      let chance = allComprehensive ? 1 : Math.min(1, (focusKPI + bonus) / missionGoal);
      if (Math.random() < chance) {
        showTaskSummary();
      } else {
        openModal("<h2>CAB Afvisning</h2><p>CAB afviste opgaven. Rework er påkrævet, og du mister 3 tidspoint.</p>", `<button id="continueRework">Fortsæt rework</button>`);
        document.getElementById('continueRework').addEventListener('click', () => {
          const penalty = 3;
          gameState.time -= penalty;
          if (gameState.time < 0) gameState.time = 0;
          updateDashboard();
          closeModal(() => cabApproval());
        });
      }
    });
    
    if (!allComprehensive) {
      document.getElementById('goBackCAB').addEventListener('click', () => {
        closeModal(() => showStepChoices(gameState.currentTask.steps[gameState.currentStepIndex]));
      });
    }
  });
}

function showTaskSummary() {
  let summaryHTML = "<h2>Opsummering af dine valg</h2><ul>";
  gameState.choiceHistory.forEach((item, index) => {
    if (item) {
      summaryHTML += `<li>Trin ${index + 1}: ${item}</li>`;
    }
  });
  summaryHTML += "</ul>";
  openModal(summaryHTML, `<button id="continueAfterSummary">Fortsæt</button>`);
  document.getElementById('continueAfterSummary').addEventListener('click', () => closeModal(() => finishTask()));
}

function proceedToNextStep() {
  const task = gameState.currentTask;
  if (gameState.currentStepIndex < task.steps.length - 1) {
    gameState.currentStepIndex++;
    renderActiveTask(task);
  } else {
    cabApproval();
  }
}

function finishTask() {
  gameState.tasksCompleted++;
  updateTaskProgress();
  openModal("<h2>Info</h2><p>Opgaven er fuldført!</p>", `<button id="continueAfterFinish">Fortsæt</button>`);
  document.getElementById('continueAfterFinish').addEventListener('click', () => {
    closeModal(() => {
      gameState.tasks = gameState.tasks.filter(task => task !== gameState.currentTask);
      // Tilføj op til 2 nye opgaver fra allTasks, hvis de findes
      const newTasks = gameState.allTasks.splice(0, 2);
      gameState.tasks = gameState.tasks.concat(newTasks);
      document.getElementById('activeTask').innerHTML = '<h2>Aktiv Opgave</h2>';
      gameState.currentTask = null;
      gameState.currentStepIndex = 0;
      renderPotentialTasks();
    });
  });
}

// Start spillet med introduktion
showIntro();

export { gameState, updateDashboard, openModal, closeModal, renderActiveTask };
