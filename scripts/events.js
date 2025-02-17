// scripts/events.js
import { openModal, closeModal } from './modal.js';

const eventsList = [
  {
    name: "🔥 Gennembrud i udvikling",
    condition: (ratioDev, time) => ratioDev > 0.6 && time < 15,
    message: "Dit udviklingsteam knækker koden! Du sparer 3 Tid, fordi alt kører som smurt 🚀",
    effect: (gameState) => { gameState.time += 3; }
  },
  {
    name: "✨ Ny Sponsor",
    condition: (ratioDev, time) => ratioDev > 0.6 && time >= 15,
    message: "En sponsor er imponeret over din udviklingsfokus og giver +2 udviklingspoint 💪",
    effect: (gameState) => { gameState.development += 2; }
  },
  {
    name: "⚙️ Ekstra ressourcer",
    condition: (ratioDev, time) => ratioDev <= 0.6 && time > 30,
    message: "Et eksternt team tilbyder hjælp til den praktiske drift – du får +2 Tid 🧰",
    effect: (gameState) => { gameState.time += 2; }
  },
  {
    name: "✨ Effektiv Workflow-Optimering",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 10,
    message: "Dine sikkerheds-/driftsfolk finder en smart optimering. +1 Tid ✅",
    effect: (gameState) => { gameState.time += 1; }
  },
  {
    name: "✅ Kabinets-Godkendelse",
    condition: (ratioDev, time) => ratioDev > 0.35 && ratioDev < 0.65,
    message: "CAB bemærker, at din balance er fornuftig. Ingen negative konsekvenser 🤝",
    effect: (gameState) => {}
  },
  {
    name: "📝 Brugertilfredshedsanalyse",
    condition: (ratioDev, time) => ratioDev >= 0.5 && time >= 20,
    message: "Brugerne roser jeres nye features. Ingen tids- eller pointændring, men god PR 💬",
    effect: (gameState) => {}
  },
  {
    name: "👨‍🔧 Dedikeret Arkitekt-hjælp",
    condition: (ratioDev, time) => ratioDev > 0.5 && time < 20,
    message: "En dygtig it-arkitekt skrider til undsætning og sparer dig 2 Tid! 🧠",
    effect: (gameState) => { gameState.time += 2; }
  },
  {
    name: "💥 Hackerangreb",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Et hackerangreb har lammet dine systemer! Du mister 3 Tid på at lukke hullet 🔥",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 3); }
  },
  {
    name: "🕰️ Ineffektiv drift",
    condition: (ratioDev, time) => ratioDev < 0.35,
    message: "Dine arbejdsgange er så manuelle, at du mister 2 Tid på papirarbejde 📄",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 2); }
  },
  {
    name: "⚖️ Compliance-problem",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En intern audit finder manglende dokumentation – du mister 4 Tid 🗂️",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 4); }
  },
  {
    name: "💻 Nedbrud i systemet",
    condition: (ratioDev, time) => time < 10,
    message: "Der opstår kritisk nedbrud – du bruger 5 Tid på brand-slukning 💥",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 5); }
  },
  {
    name: "📉 Driftsstop",
    condition: (ratioDev, time) => ratioDev > 0.75,
    message: "Overdrevent fokus på nye funktioner har ført til driftsstop – du mister 3 Tid 😟",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 3); }
  },
  {
    name: "🛑 Leverandørsvigt",
    condition: (ratioDev, time) => ratioDev < 0.35 && time < 20,
    message: "Din leverandør opsiger pludselig kontrakten. Du mister 2 Tid på at finde en erstatning 🚫",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 2); }
  },
  {
    name: "🔒 Oprustning i sikkerhed",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "Eksterne partnere donerer sikkerhedsudstyr – du får +2 i Sikkerhed 🔐",
    effect: (gameState) => { gameState.security += 2; }
  },
  {
    name: "💿 Software-opdatering",
    condition: (ratioDev, time) => ratioDev >= 0.5,
    message: "En ny software-release reducerer systemfejl – +1 i Udvikling 💻",
    effect: (gameState) => { gameState.development += 1; }
  },
  {
    name: "⏳ Dokumentationskaos",
    condition: (ratioDev, time) => ratioDev < 0.3,
    message: "Du overser en vigtig dokumentationskrav og bruger 3 Tid på at rette det 📃",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 3); }
  },
  {
    name: "🛠️ Bonus-funktion",
    condition: (ratioDev, time) => ratioDev > 0.7,
    message: "Et sideløbende projekt føjer en bonusfunktion – du får +2 i Udvikling 🔧",
    effect: (gameState) => { gameState.development += 2; }
  },
  {
    name: "🖥️ Server-problemer",
    condition: (ratioDev, time) => ratioDev > 0.65 && time < 25,
    message: "Serveren sætter ud pga. for mange nye features – du mister 2 Tid 🖥️",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 2); }
  },
  {
    name: "💼 Ekstern Revision",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 20,
    message: "En ekstern revision roser dine stabile systemer. Ingen negative konsekvenser 📈",
    effect: (gameState) => {}
  },
  {
    name: "🏛️ Juridisk Tjek",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "Jura-afdelingen kræver rettelser – du mister 2 Tid ⚖️",
    effect: (gameState) => { gameState.time = Math.max(0, gameState.time - 2); }
  }
];

export const triggerRandomEvent = (gameState) => {
  // Oprindelig chance: 50%, reduceret med 35% => 50% * 0.65 = 32,5%
  const originalEventChance = 0.5;
  const reducedEventChance = originalEventChance * 0.65;
  if (Math.random() > reducedEventChance) return;

  const totalChoices = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  if (totalChoices === 0) return;
  const ratioDev = gameState.totalDevelopmentChoices / totalChoices;

  const possibleEvents = eventsList.filter(ev => ev.condition(ratioDev, gameState.time));
  if (possibleEvents.length === 0) return;

  const chosenEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  // Udfør eventens effekt
  chosenEvent.effect(gameState);

  // Vis eventen i en modal
  openModal(
    `<h2>Hændelse!</h2><p>${chosenEvent.message}</p>`,
    `<button id="eventOk" class="modern-btn">OK</button>`
  );
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) modalContent.classList.add('event-modal');
  document.getElementById('eventOk')?.addEventListener('click', () => {
    if (modalContent) modalContent.classList.remove('event-modal');
    closeModal();
  });
};
