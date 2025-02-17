// scripts/events.js
import { openModal, closeModal } from './modal.js';

/**
 * eventsList
 * 20 forskellige hændelser (events), hvor condition(...) bestemmer,
 * om hændelsen er relevant for spillerens aktuelle situation.
 * message indeholder en sjov/illustrativ tekst med emojis,
 * effect(...) justerer gameState (fx tid, point).
 */
const eventsList = [
  // 1) POSITIVE & NEUTRALE EVENTS
  {
    name: "🔥 Gennembrud i udvikling",
    condition: (ratioDev, time) => ratioDev > 0.6 && time < 15,
    message: "Dit udviklingsteam knækker koden! Du sparer 3 Tid, fordi alt kører som smurt \u{1F680}",
    effect: (gameState) => {
      gameState.time += 3;
    }
  },
  {
    name: "✨ Ny Sponsor",
    condition: (ratioDev, time) => ratioDev > 0.6 && time >= 15,
    message: "En sponsor er imponeret over din udviklingsfokus og giver +2 udviklingspoint \u{1F4AA}",
    effect: (gameState) => {
      gameState.development += 2;
    }
  },
  {
    name: "⚙️ Ekstra ressourcer",
    condition: (ratioDev, time) => ratioDev <= 0.6 && time > 30,
    message: "Et eksternt team tilbyder hjælp til den praktiske drift – du får +2 Tid \u{1F9BE}",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "✨ Effektiv Workflow-Optimering",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 10,
    message: "Dine sikkerheds-/driftsfolk finder en smart optimering. +1 Tid \u{2705}",
    effect: (gameState) => {
      gameState.time += 1;
    }
  },
  {
    name: "✅ Kabinets-Godkendelse",
    condition: (ratioDev, time) => ratioDev > 0.35 && ratioDev < 0.65,
    message: "CAB bemærker, at din balance mellem udvikling/sikkerhed er fornuftig. Ingen negative konsekvenser \u{1F91D}",
    effect: (gameState) => {
      // Ingen effekt, men en rar oplevelse
    }
  },
  {
    name: "📝 Brugertilfredshedsanalyse",
    condition: (ratioDev, time) => ratioDev >= 0.5 && time >= 20,
    message: "Brugerne roser jeres nye features. Ingen tids- eller pointændring, men god PR \u{1F4AC}",
    effect: (gameState) => {
      // Ingen effekt
    }
  },
  {
    name: "\u{1F468}\u{200D}\u{1F527} Dedikeret Arkitekt-hjælp",
    condition: (ratioDev, time) => ratioDev > 0.5 && time < 20,
    message: "En dygtig it-arkitekt skrider til undsætning og sparer dig 2 Tid! \u{1F9E0}",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  // 2) NEGATIVE EVENTS
  {
    name: "💥 Hackerangreb",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Et hackerangreb har lammet dine systemer! Du mister 3 Tid på at lukke hullet \u{1F525}",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "🕰️ Ineffektiv drift",
    condition: (ratioDev, time) => ratioDev < 0.35,
    message: "Dine arbejdsgange er så manuelle, at du mister 2 Tid på kedsommeligt papirarbejde \u{1F4C4}",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "⚖️ Compliance-problem",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En intern audit finder manglende dokumentation – du mister 4 Tid \u{1F5C4}",
    effect: (gameState) => {
      gameState.time -= 4;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "💻 Nedbrud i systemet",
    condition: (ratioDev, time) => time < 10,
    message: "Der opstår kritisk nedbrud – du bruger 5 Tid på brand-slukning \u{1F4A5}",
    effect: (gameState) => {
      gameState.time -= 5;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "📉 Driftsstop",
    condition: (ratioDev, time) => ratioDev > 0.75,
    message: "Overdrevent fokus på nye funktioner har ført til driftsstop i dine ældre systemer – du mister 3 Tid \u{1F630}",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "🛑 Leverandørsvigt",
    condition: (ratioDev, time) => ratioDev < 0.35 && time < 20,
    message: "Din leverandør opsiger pludselig kontrakten. Du må bruge 2 Tid på at finde en erstatning \u{1F6AB}",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  // 3) FLERE BEGIVENHEDER
  {
    name: "🔒 Oprustning i sikkerhed",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "Eksterne partnere donerer sikkerhedsudstyr – du får +2 i Sikkerhed \u{1F512}",
    effect: (gameState) => {
      gameState.security += 2;
    }
  },
  {
    name: "💿 Software-opdatering",
    condition: (ratioDev, time) => ratioDev >= 0.5,
    message: "En ny software-release reducerer systemfejl – +1 i Udvikling \u{1F4BD}",
    effect: (gameState) => {
      gameState.development += 1;
    }
  },
  {
    name: "⏳ Dokumentationskaos",
    condition: (ratioDev, time) => ratioDev < 0.3,
    message: "Du overser en vigtig dokumentationskrav og bruger 3 Tid på at rette det \u{1F4C3}",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "🛠️ Bonus-funktion",
    condition: (ratioDev, time) => ratioDev > 0.7,
    message: "Et lille sideløbende projekt føjer en bonusfunktion – du får +2 i Udvikling \u{1F527}",
    effect: (gameState) => {
      gameState.development += 2;
    }
  },
  {
    name: "🖥️ Server-problemer",
    condition: (ratioDev, time) => ratioDev > 0.65 && time < 25,
    message: "Serveren sætter ud pga. for mange nye features – du bruger 2 Tid på at opgradere \u{1F5A5}",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "💼 Ekstern Revision",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 20,
    message: "En ekstern revision roser dine stabile systemer. Ingen negative konsekvenser \u{1F4C8}",
    effect: (gameState) => {
      // Ingen effekt
    }
  },
  {
    name: "🏛️ Juridisk Tjek",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "Jura-afdelingen kræver rettelser for at overholde lovkrav – du mister 2 Tid \u{2696}",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  }
];

/**
 * triggerRandomEvent(gameState)
 * Udløser én af de 20 hændelser, hvis condition(...) er opfyldt,
 * baseret på en sandsynlighed, og viser en event-modal med emojis.
 *
 * Regler:
 * - Spilleren skal have løst mindst 2 opgaver (tasksCompleted >= 2).
 * - Der kan maksimalt komme 2 hændelser (eventsTriggeredThisPI < 2) pr. PI.
 * - Den oprindelige chance på 50% reduceres med 35% (til ca. 32,5%).
 */
export function triggerRandomEvent(gameState) {
  // Sørg for at spilleren har løst mindst 2 opgaver
  if (gameState.tasksCompleted < 2) return;
  
  // Maksimalt 2 hændelser pr. PI
  if (gameState.eventsTriggeredThisPI >= 2) return;
  
  // Oprindelig chance: 50%, reduceret med 35% => 50% * 0.65 = ca. 32,5%
  const eventChance = 0.5 * 0.65;
  if (Math.random() > eventChance) return;

  // Beregn andelen af udviklingsvalg
  const total = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  if (total === 0) return;
  const ratioDev = total > 0 ? (gameState.totalDevelopmentChoices / total) : 0;

  // Filtrér events ud fra deres condition(...)
  const possibleEvents = eventsList.filter(ev => ev.condition(ratioDev, gameState.time));
  if (possibleEvents.length === 0) return;

  // Vælg tilfældigt en event
  const chosenEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  
  // Øg event-tælleren for PI
  gameState.eventsTriggeredThisPI++;

  // Anvend eventens effekt
  chosenEvent.effect(gameState);

  // Vis eventen i en modal
  openModal(
    `<h2>Hændelse!</h2><p>${chosenEvent.message}</p>`,
    `<button id="eventOk" class="modern-btn">OK</button>`
  );
  
  // Gør modal markant
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.classList.add('event-modal');
  }
  
  // Luk modal ved klik
  document.getElementById('eventOk').addEventListener('click', () => {
    if (modalContent) {
      modalContent.classList.remove('event-modal');
    }
    closeModal();
  });
}
