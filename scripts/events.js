// scripts/events.js
import { openModal, closeModal } from './modal.js';

const eventsList = [
  {
    name: "Hackerangreb",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Et hackerangreb har ramt dine systemer! Du negligerede sikkerheden.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Ineffektiv drift",
    condition: (ratioDev, time) => ratioDev < 0.35,
    message: "Dine arbejdsgange er ineffektive – du mister 2 Tid på at ordne manuelle processer.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Heldigt gennembrud",
    condition: (ratioDev, time) => time < 15,
    message: "Et teammedlem finder en smart genvej! Du sparer 2 Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Sponsorstøtte",
    condition: (ratioDev, time) => ratioDev > 0.6,
    message: "En sponsor tilbyder finansiering – du får +2 point i Udvikling!",
    effect: (gameState) => {
      gameState.development += 2;
    }
  },
  {
    name: "Ekstra ressourcer",
    condition: (ratioDev, time) => time > 30,
    message: "Ekstra ressourcer øger din Tid med 2!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Medarbejder træning",
    condition: (ratioDev, time) => time > 20,
    message: "En kort medarbejder træning giver +1 Udvikling!",
    effect: (gameState) => {
      gameState.development += 1;
    }
  },
  {
    name: "Systemfejl",
    condition: (ratioDev, time) => time < 10,
    message: "En kritisk systemfejl opstår – du mister 5 Tid!",
    effect: (gameState) => {
      gameState.time -= 5;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Compliance-udfordring",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En ekstern audit afslører fejl – du mister 4 Tid!",
    effect: (gameState) => {
      gameState.time -= 4;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Workflow-optimering",
    condition: (ratioDev, time) => ratioDev < 0.5,
    message: "Du optimerer et workflow – du sparer 1 Tid.",
    effect: (gameState) => {
      gameState.time += 1;
    }
  },
  {
    name: "Strategimøde",
    condition: (ratioDev, time) => time > 30,
    message: "Et strategimøde giver ingen direkte effekt, men stemningen er god.",
    effect: (gameState) => {}
  },
  {
    name: "Ekstern Audit",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En ekstern audit afslører mangler – du mister 3 Tid.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Netværksopgradering",
    condition: (ratioDev, time) => ratioDev > 0.6,
    message: "En opgradering styrker systemets sikkerhed – +1 Sikkerhed!",
    effect: (gameState) => {
      gameState.security += 1;
    }
  },
  {
    name: "Brugerundersøgelse",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "Brugertilfredsheden er høj – ingen effekt.",
    effect: (gameState) => {}
  },
  {
    name: "Teknologiinnovation",
    condition: (ratioDev, time) => ratioDev > 0.55,
    message: "Du implementerer en ny teknologi – +2 Udvikling!",
    effect: (gameState) => {
      gameState.development += 2;
    }
  },
  {
    name: "Fejl i opdatering",
    condition: (ratioDev, time) => ratioDev < 0.45,
    message: "En opdatering fejler – du mister 2 Tid.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Innovationspris",
    condition: (ratioDev, time) => ratioDev > 0.7,
    message: "Din innovation belønnes – +3 Udvikling!",
    effect: (gameState) => {
      gameState.development += 3;
    }
  },
  {
    name: "Forsinkelse i leverancer",
    condition: (ratioDev, time) => time < 20,
    message: "Leverancerne er forsinkede – du mister 2 Tid.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Produktivitetsboost",
    condition: (ratioDev, time) => time > 35,
    message: "Et uventet produktivitetsboost – +2 Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Team motivation",
    condition: (ratioDev, time) => time > 25,
    message: "Teamet er super motiveret – +1 Udvikling!",
    effect: (gameState) => {
      gameState.development += 1;
    }
  }
];

// Reduceret eventChance: 20% chance for at et event sker
export function triggerRandomEvent(gameState) {
  const eventChance = 0.2;
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
