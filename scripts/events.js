// scripts/events.js
import { openModal, closeModal } from './modal.js';

const eventsList = [
  // Positive Events
  {
    name: "Heldigt Gennembrud",
    condition: (ratioDev, time) => time < 15,
    message: "Et teammedlem finder en ny metode, der sparer dig 3 tidspunkter!",
    effect: (gameState) => {
      gameState.time += 3;
    }
  },
  {
    name: "Sponsorstøtte",
    condition: (ratioDev, time) => ratioDev > 0.6,
    message: "En sponsor tilbyder finansiering til din udvikling – du får +2 Udvikling!",
    effect: (gameState) => {
      gameState.developmentScore += 2;
    }
  },
  {
    name: "Ekstra Ressourcer",
    condition: (ratioDev, time) => gameState.time > 30,
    message: "Ekstra ressourcer er tilgængelige – du får +2 Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },

  // Negative Events
  {
    name: "Hackerangreb",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Et hackerangreb har kompromitteret dine systemer! Du mister 3 tidspunkter for at løse problemet.",
    effect: (gameState) => {
      gameState.time -= 3;
    }
  },
  {
    name: "Utilfredse Brugere",
    condition: (ratioDev, time) => ratioDev < 0.35,
    message: "Brugerne klager over ineffektive systemer – du mister 2 Tid for at svare på klagerne.",
    effect: (gameState) => {
      gameState.time -= 2;
    }
  },
  {
    name: "Compliance-problem",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "Et compliance-problem kræver en hurtig løsning! Du mister 4 Tid.",
    effect: (gameState) => {
      gameState.time -= 4;
    }
  },
  {
    name: "Systemfejl",
    condition: (ratioDev, time) => time < 10,
    message: "En kritisk systemfejl kræver din opmærksomhed – du mister 5 Tid.",
    effect: (gameState) => {
      gameState.time -= 5;
    }
  },

  // Neutrale Events
  {
    name: "Feedback-session",
    condition: (ratioDev, time) => gameState.time > 25,
    message: "Du holder en feedback-session. Ingen ændringer i score, men medarbejderne er motiverede!",
    effect: (gameState) => {
      // Ingen effekt
    }
  },
  {
    name: "CAB-møde",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "CAB holder møde om din fremgang. De er tilfredse med balancen mellem udvikling og sikkerhed.",
    effect: (gameState) => {
      // Ingen effekt
    }
  },

  // Flere Events
  {
    name: "Softwareopdatering",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "En vigtig softwareopdatering forbedrer din sikkerhed. +1 Sikkerhed!",
    effect: (gameState) => {
      gameState.securityScore += 1;
    }
  },
  {
    name: "Workflow-optimering",
    condition: (ratioDev, time) => ratioDev < 0.5,
    message: "Du optimerer et workflow, hvilket sparer dig 1 Tid.",
    effect: (gameState) => {
      gameState.time += 1;
    }
  },
  {
    name: "Medarbejder træning",
    condition: (ratioDev, time) => gameState.time > 20,
    message: "Medarbejdertræning forbedrer arbejdsmiljøet. +1 Udvikling!",
    effect: (gameState) => {
      gameState.developmentScore += 1;
    }
  },
  {
    name: "Systemhårdhedstest",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En hårdhedstest viser sårbarheder i systemet – du mister 2 Tid.",
    effect: (gameState) => {
      gameState.time -= 2;
    }
  },
  {
    name: "Strategimøde",
    condition: (ratioDev, time) => gameState.time > 30,
    message: "Et strategimøde sætter kursen for fremtiden. Ingen ændring i score.",
    effect: (gameState) => {
      // Ingen effekt
    }
  },
  {
    name: "Ekstern Audit",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En ekstern audit afslører mangler i dokumentation. Du mister 3 Tid.",
    effect: (gameState) => {
      gameState.time -= 3;
    }
  },
  {
    name: "Netværksopgradering",
    condition: (ratioDev, time) => ratioDev > 0.6,
    message: "En netværksopgradering øger systemets robusthed. +1 Sikkerhed!",
    effect: (gameState) => {
      gameState.securityScore += 1;
    }
  },
  {
    name: "Brugerundersøgelse",
    condition: (ratioDev, time) => ratioDev > 0.5,
    message: "En brugerundersøgelse viser stor tilfredshed med systemet. Ingen effekt.",
    effect: (gameState) => {
      // Ingen effekt
    }
  }
];

/**
 * triggerRandomEvent(gameState)
 * Tjekker betingelser og udløser en tilfældig event baseret på spillerens nuværende spiltilstand.
 */
export function triggerRandomEvent(gameState) {
  const eventChance = 0.5; // 50% chance for at et event sker
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

  document.getElementById('eventOk').addEventListener('click', closeModal);
}
