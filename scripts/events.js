// scripts/events.js

export const eventsList = [
  {
    name: "Hacker infiltration",
    condition: (devRatio, secRatio) => secRatio < 0.3,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 3);
    },
    message: "Et hackerangreb infiltrerer dit system! Du mister 3 Tid på at håndtere det."
  },
  {
    name: "Phishing spree",
    condition: (devRatio, secRatio) => secRatio < 0.4,
    effect: (gameState) => {
      gameState.security = Math.max(0, gameState.security - 2);
    },
    message: "En bølge af phishing-angreb rammer organisationen! Du mister 2 Sikkerhed."
  },
  {
    name: "Major data breach",
    condition: (devRatio, secRatio) => secRatio < 0.2,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 5);
      gameState.security = Math.max(0, gameState.security - 3);
    },
    message: "Et massivt databrud koster dig 5 Tid og 3 Sikkerhed."
  },
  {
    name: "Crypto-miner infiltration",
    condition: (devRatio, secRatio) => secRatio < 0.3,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 2);
      gameState.security = Math.max(0, gameState.security - 1);
    },
    message: "Crypto-mining software infiltrerer systemet – du mister 2 Tid og 1 Sikkerhed."
  },
  {
    name: "Botched Dev Release",
    condition: (devRatio, secRatio) => devRatio > 0.7,
    effect: (gameState) => {
      gameState.development = Math.max(0, gameState.development - 2);
    },
    message: "Et fejlslagent release rammer markedet – du mister 2 Udvikling."
  },
  {
    name: "Burnout i dev team",
    condition: (devRatio, secRatio) => devRatio > 0.7,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 4);
    },
    message: "Dev-teamet oplever burnout – du mister 4 Tid på reorganisering."
  },
  {
    name: "Nye Dev Tools",
    condition: (devRatio, secRatio) => devRatio > 0.5,
    effect: (gameState) => {
      gameState.development += 2;
    },
    message: "Du får adgang til nye dev-værktøjer – +2 Udvikling!"
  },
  {
    name: "Brugerkritik",
    condition: (devRatio, secRatio) => devRatio >= 0.3 && devRatio <= 0.7,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 2);
    },
    message: "Brugerne klager over manglende funktioner – du mister 2 Tid."
  },
  {
    name: "Unexpected synergy",
    condition: (devRatio, secRatio) => devRatio > 0.8,
    effect: (gameState) => {
      gameState.development += 3;
    },
    message: "Der opstår en fantastisk synergi i dev-teamet – +3 Udvikling!"
  },
  {
    name: "Legal compliance snag",
    condition: (devRatio, secRatio) => secRatio > 0.8,
    effect: (gameState) => {
      gameState.security = Math.max(0, gameState.security - 2);
      gameState.development = Math.max(0, gameState.development - 1);
    },
    message: "Juridiske udfordringer med sikkerheden – du mister 2 Sikkerhed og 1 Udvikling."
  },
  {
    name: "IT meltdown",
    condition: (devRatio, secRatio) => devRatio > 0.9,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 6);
      gameState.development = Math.max(0, gameState.development - 3);
    },
    message: "Et IT-meltdown rammer – du mister 6 Tid og 3 Udvikling."
  },
  {
    name: "Massive server crash",
    condition: (devRatio, secRatio) => secRatio > 0.9,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 5);
      gameState.security = Math.max(0, gameState.security - 2);
    },
    message: "Serverne bryder sammen – du mister 5 Tid og 2 Sikkerhed."
  },
  {
    name: "Generous sponsor",
    condition: (devRatio, secRatio) => devRatio > 0.6,
    effect: (gameState) => {
      gameState.time += 3;
    },
    message: "En sponsor imponeres – +3 Tid!"
  },
  {
    name: "Inspiring dev conference",
    condition: (devRatio, secRatio) => devRatio > 0.5,
    effect: (gameState) => {
      gameState.development += 2;
    },
    message: "Dev-teamet deltager i en inspirerende konference – +2 Udvikling!"
  },
  {
    name: "Freelance security consultant",
    condition: (devRatio, secRatio) => secRatio > 0.5,
    effect: (gameState) => {
      gameState.security += 2;
    },
    message: "Du hyrer en sikkerhedskonsulent – +2 Sikkerhed!"
  },
  {
    name: "Bureaucratic overhead",
    condition: (devRatio, secRatio) => Math.random() < 0.3,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 2);
    },
    message: "Bureaukrati stjæler tid – du mister 2 Tid."
  },
  {
    name: "Lightning meltdown",
    condition: (devRatio, secRatio) => devRatio < 0.4,
    effect: (gameState) => {
      gameState.development = Math.max(0, gameState.development - 2);
    },
    message: "Et lynnedslag lammer dev-teamet – du mister 2 Udvikling."
  },
  {
    name: "Power outage",
    condition: (devRatio, secRatio) => secRatio < 0.4,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 3);
    },
    message: "Strømsvigt rammer – du mister 3 Tid."
  },
  {
    name: "Public acclaim",
    condition: (devRatio, secRatio) => devRatio > 0.7,
    effect: (gameState) => {
      gameState.development += 3;
    },
    message: "Offentligheden roser jeres nye features – +3 Udvikling!"
  },
  {
    name: "Audit fiasco",
    condition: (devRatio, secRatio) => secRatio < 0.3,
    effect: (gameState) => {
      gameState.security = Math.max(0, gameState.security - 3);
      gameState.time = Math.max(0, gameState.time - 2);
    },
    message: "En audit afslører alvorlige brister – du mister 3 Sikkerhed og 2 Tid."
  }
];

/**
 * triggerRandomEvent – Vælger et tilfældigt event, hvis betingelserne er opfyldt, og udløser effekten.
 */
export function triggerRandomEvent(gameState) {
  const eventChance = 0.25;
  if (Math.random() > eventChance) return;

  const totalPoints = gameState.security + gameState.development;
  if (totalPoints === 0) return;

  const devRatio = gameState.development / totalPoints;
  const secRatio = gameState.security / totalPoints;

  const possibleEvents = eventsList.filter(ev => ev.condition(devRatio, secRatio));
  if (possibleEvents.length === 0) return;

  const chosenEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  chosenEvent.effect(gameState);

  // Vis pop-up – her antages, at openModal/closeModal er globale eller tilgængelige via import i main.js
  const eventMsg = `<h2>Hændelse!</h2><p>${chosenEvent.message}</p>`;
  openModal(eventMsg, `<button id="eventOk" class="modern-btn">OK</button>`);
  document.getElementById('eventOk').addEventListener('click', () => closeModal());
  
  return { eventOccurred: true, eventMessage: chosenEvent.message };
}
