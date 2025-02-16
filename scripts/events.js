// scripts/events.js
import { openModal, closeModal } from './modal.js';

/**
 * Definerer 20 hændelser, som relaterer sig til specifikke opgavetyper.
 * Hver hændelse har en condition, som typisk tjekker gameState.currentTask.title (i små bogstaver),
 * samt gameState.currentStepIndex og den samlede events-tæller for PI.
 */
const eventsList = [
  // Hospital-opgaver (udvikling)
  {
    name: "Patientjournalfejl",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("lims"),
    message: "Patientjournalen afslører skjulte fejl – du mister 2 Tid for at rette op på det.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "EHR-nedbrud",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("ehr"),
    message: "Det elektroniske patientjournalssystem fejler pludseligt – du mister 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "Telemedicin-forbindelse",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("telemedicin"),
    message: "Netværksforbindelsen svigter under telemedicin – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Effektiv Patientflow",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("patientflow"),
    message: "Patientflow er optimeret – du vinder 2 Tid bonus!",
    effect: (gameState) => { gameState.time += 2; }
  },
  {
    name: "Digitalisering af recepter",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("recepter"),
    message: "Det digitale system for recepter fungerer strømlinet – du vinder 1 Tid bonus!",
    effect: (gameState) => { gameState.time += 1; }
  },

  // Infrastruktur-opgaver (sikkerhed)
  {
    name: "Netværksfejl",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("netværksopgradering"),
    message: "En fejl i netværksinfrastrukturen opstår – du mister 3 Tid for at udbedre den.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "Server Overbelastning",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("serveropgradering"),
    message: "Serverne bliver overbelastede – du mister 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "Datacenter Strømsvigt",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("datacenter"),
    message: "Et kortvarigt strømsvigt rammer datacentret – du mister 4 Tid.",
    effect: (gameState) => { gameState.time -= 4; }
  },
  {
    name: "Virtualiseringsfejl",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("virtualisering"),
    message: "Virtualiseringsprocessen fejler midlertidigt – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Backup-problem",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("backup"),
    message: "Backup-systemet svigter under test – du mister 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "Switch Ustabilitet",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("switch"),
    message: "Switch-optimeringen medfører midlertidig ustabilitet – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Routerfejl",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("router"),
    message: "En fejl i routerkonfigurationen forårsager forstyrrelser – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Cloud Forstyrrelser",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("cloud migration"),
    message: "Skyen oplever forstyrrelser – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },

  // Cybersikkerhed-opgaver
  {
    name: "Netværkssårbarhed",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("netværkssikkerhed"),
    message: "En uventet sårbarhed i netværket opdages – du mister 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "Opdateringsfejl",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("sikkerhedsopdatering"),
    message: "Sikkerhedsopdateringerne fejler kritisk – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Phishing-angreb",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("phishing"),
    message: "Et vellykket phishing-angreb medfører tab af 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "To-faktor Fejl",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("to-faktor"),
    message: "Implementeringen af to-faktor autentifikation oplever problemer – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Incident Krise",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("incident response"),
    message: "En kritisk hændelse eskalerer – du mister 4 Tid.",
    effect: (gameState) => { gameState.time -= 4; }
  },
  {
    name: "SIEM Overbelastning",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("siem"),
    message: "SIEM-systemet overbelastes – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Ekstern Trusselsmonitorering",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("eksterne trusler"),
    message: "Eksterne cybertrusler intensiveres – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },
  {
    name: "Penetrationstest Resultat",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("penetrationstest"),
    message: "Penetrationstesten afslører alvorlige sårbarheder – du mister 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; }
  },
  {
    name: "Zero Trust Udfordring",
    condition: (gameState) => gameState.currentTask.title.toLowerCase().includes("zero trust"),
    message: "Implementeringen af Zero Trust skaber midlertidig usikkerhed – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; }
  },

  // Generiske events baseret på fokus
  {
    name: "Innovationsspræng",
    condition: (gameState) => gameState.currentTask.focus === "udvikling",
    message: "Din innovative tilgang giver et gennembrud – du vinder 2 Tid bonus!",
    effect: (gameState) => { gameState.time += 2; }
  },
  {
    name: "Sikkerhedsforbedring",
    condition: (gameState) => gameState.currentTask.focus === "cybersikkerhed" || gameState.currentTask.focus === "sikkerhed",
    message: "Din fokuserede sikkerhedsstrategi betaler sig – du vinder 2 Tid bonus!",
    effect: (gameState) => { gameState.time += 2; }
  }
];

/**
 * triggerRandomEvent(gameState)
 * Udløser en event, hvis betingelserne er opfyldte.
 * - Ingen event udløses i første runde af en opgave (currentStepIndex === 0).
 * - Maksimalt 2 events per PI (gameState.eventsThisPI).
 */
export function triggerRandomEvent(gameState) {
  // Init events counter, hvis den ikke er defineret
  if (typeof gameState.eventsThisPI === "undefined") {
    gameState.eventsThisPI = 0;
  }
  
  // Regel 1: Ingen event i første trin
  if (gameState.currentStepIndex === 0) return;
  // Regel 2: Maksimalt 2 events per PI
  if (gameState.eventsThisPI >= 2) return;

  const totalChoices = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  if (totalChoices === 0) return;
  const ratioDev = gameState.totalDevelopmentChoices / totalChoices;

  const possibleEvents = eventsList.filter(ev => ev.condition(gameState, ratioDev, gameState.time));
  if (possibleEvents.length === 0) return;

  // Vælg én event tilfældigt
  const chosenEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  chosenEvent.effect(gameState);

  // Øg events-tælleren for denne PI
  gameState.eventsThisPI++;

  openModal(
    `<h2>Hændelse: ${chosenEvent.name}</h2><p>${chosenEvent.message}</p>`,
    `<button id="eventOk" class="modern-btn">OK</button>`
  );

  // Tilføj pulserende effekt til event-modalen
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.classList.add('event-modal');
  }

  document.getElementById('eventOk').addEventListener('click', () => {
    if (modalContent) {
      modalContent.classList.remove('event-modal');
    }
    closeModal();
  });
}
