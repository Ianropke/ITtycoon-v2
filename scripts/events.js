// scripts/events.js
import { openModal, closeModal } from './modal.js';

const eventsList = [
  {
    name: "Hackerangreb",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Et hackerangreb har ramt dine systemer! Du mister 3 Tid for at afværge angrebet.",
    effect: (gameState) => { gameState.time -= 3; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Ineffektiv drift",
    condition: (ratioDev, time) => ratioDev < 0.35,
    message: "Dine arbejdsgange er ineffektive – du mister 2 Tid på at optimere processerne.",
    effect: (gameState) => { gameState.time -= 2; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Heldigt gennembrud",
    condition: (ratioDev, time) => time < 15,
    message: "Et teammedlem opdager en genvej, og du får +3 Tid!",
    effect: (gameState) => { gameState.time += 3; }
  },
  {
    name: "Sponsorstøtte",
    condition: (ratioDev, time) => ratioDev > 0.6,
    message: "En sponsor giver ekstra midler – du får +2 point i Udvikling!",
    effect: (gameState) => { gameState.development += 2; }
  },
  {
    name: "Ekstra ressourcer",
    condition: (ratioDev, time) => time > 30,
    message: "Du får adgang til ekstra ressourcer – +2 Tid!",
    effect: (gameState) => { gameState.time += 2; }
  },
  {
    name: "Systemfejl",
    condition: (ratioDev, time) => time < 10,
    message: "En kritisk systemfejl opstår – du mister 4 Tid for at rette op på den.",
    effect: (gameState) => { gameState.time -= 4; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Feedback-session",
    condition: (ratioDev, time) => time > 25,
    message: "Du holder en feedback-session – ingen ændring i score, men teamet er motiveret.",
    effect: (gameState) => { }
  },
  {
    name: "CAB-møde",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "CAB mødes og er tilfredse med din balance – ingen effekt.",
    effect: (gameState) => { }
  },
  {
    name: "Softwareopdatering",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "En vigtig softwareopdatering forbedrer systemets robusthed – +1 Sikkerhed!",
    effect: (gameState) => { gameState.security += 1; }
  },
  {
    name: "Workflow-optimering",
    condition: (ratioDev, time) => ratioDev < 0.5,
    message: "Du optimerer workflowet – +1 Tid sparet!",
    effect: (gameState) => { gameState.time += 1; }
  },
  {
    name: "Medarbejdertræning",
    condition: (ratioDev, time) => time > 20,
    message: "En træningssession øger din Udvikling med +1!",
    effect: (gameState) => { gameState.development += 1; }
  },
  {
    name: "Hårdhedstest",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En systemtest afslører sårbarheder – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Strategimøde",
    condition: (ratioDev, time) => time > 30,
    message: "Et strategimøde sætter kursen – ingen effekt, men inspiration opnået.",
    effect: (gameState) => { }
  },
  {
    name: "Ekstern audit",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En ekstern audit afslører mangler – du mister 3 Tid.",
    effect: (gameState) => { gameState.time -= 3; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Netværksopgradering",
    condition: (ratioDev, time) => ratioDev > 0.6,
    message: "En opgradering af netværket giver +1 Sikkerhed!",
    effect: (gameState) => { gameState.security += 1; }
  },
  {
    name: "Brugerundersøgelse",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "En brugerundersøgelse viser stor tilfredshed – ingen effekt.",
    effect: (gameState) => { }
  },
  {
    name: "Systemovervågning",
    condition: (ratioDev, time) => time < 20,
    message: "Systemovervågningen opdager små fejl – du mister 1 Tid.",
    effect: (gameState) => { gameState.time -= 1; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Forsinket opdatering",
    condition: (ratioDev, time) => time < 20,
    message: "En forsinket opdatering skaber forvirring – du mister 2 Tid.",
    effect: (gameState) => { gameState.time -= 2; if (gameState.time < 0) gameState.time = 0; }
  },
  {
    name: "Ressourceoptimering",
    condition: (ratioDev, time) => time > 35,
    message: "Du optimerer ressourceforbruget – +2 Tid!",
    effect: (gameState) => { gameState.time += 2; }
  },
  {
    name: "Internt innovationsmøde",
    condition: (ratioDev, time) => ratioDev >= 0.4 && ratioDev <= 0.6,
    message: "Et innovationsmøde skaber nye ideer – ingen direkte effekt, men inspiration er opnået.",
    effect: (gameState) => { }
  }
];

/**
 * triggerRandomEvent(gameState)
 * Udløser en event baseret på spillerens tilstand.
 * Vigtigt: Ingen event udløses under den første opgave i et PI.
 */
export function triggerRandomEvent(gameState) {
  // Hvis ingen opgaver er fuldført endnu, udløses der ingen event
  if (gameState.tasksCompleted === 0) return;
  
  const eventChance = 0.5;
  if (Math.random() > eventChance) return;
  
  const total = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  if (total === 0) return;
  
  const ratioDev = gameState.totalDevelopmentChoices / total;
  const possibleEvents = eventsList.filter(ev => ev.condition(ratioDev, gameState.time));
  if (possibleEvents.length === 0) return;
  
  const chosenEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  chosenEvent.effect(gameState);
  
  openModal(
    `<h2>Hændelse!</h2><p>${chosenEvent.message}</p>`,
    `<button id="eventOk" class="modern-btn">OK</button>`
  );
  
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
