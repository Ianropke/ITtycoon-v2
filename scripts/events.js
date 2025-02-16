// scripts/events.js
import { openModal, closeModal } from './modal.js';

/**
 * 40 events fordelt på positive, negative og neutrale scenarier.
 * condition(ratioDev, time) => true/false afgør, om eventen skal ske.
 * effect(gameState) ændrer gameState (fx tid, security, development).
 * message beskriver hændelsen for spilleren.
 */
const eventsList = [
  // -- POSITIVE EVENTS (15 stk.) --
  {
    name: "Heldigt Gennembrud",
    condition: (ratioDev, time) => time < 15, 
    message: "Dit team finder en metode, der sparer 3 Tid!",
    effect: (gameState) => {
      gameState.time += 3;
    }
  },
  {
    name: "Sponsorstøtte",
    condition: (ratioDev, time) => ratioDev > 0.60 && time > 25,
    message: "En sponsor er imponeret over dit fokus på udvikling – du får +2 Udvikling!",
    effect: (gameState) => {
      gameState.development += 2;
    }
  },
  {
    name: "Ekstra ressourcer",
    condition: (ratioDev, time) => time > 35,
    message: "Du får tildelt ekstra midler fra ledelsen – +2 Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Brugerros",
    condition: (ratioDev, time) => ratioDev > 0.5 && time > 20,
    message: "Brugerne roser det nye system, og vil hjælpe med betatest. +1 Udvikling!",
    effect: (gameState) => {
      gameState.development += 1;
    }
  },
  {
    name: "Ekstra Sikkerhedsteam",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 25,
    message: "Du får pludselig ekstra ressourcer til sikkerhed. +1 Sikkerhed!",
    effect: (gameState) => {
      gameState.security += 1;
    }
  },
  {
    name: "Optimeret Workflow",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 15,
    message: "Et workflow er blevet optimeret, hvilket frigiver 2 Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Gode Testresultater",
    condition: (ratioDev, time) => ratioDev > 0.5 && time < 25,
    message: "Dine testresultater er fremragende – du får +1 Udvikling!",
    effect: (gameState) => {
      gameState.development += 1;
    }
  },
  {
    name: "Ros fra CAB",
    condition: (ratioDev, time) => ratioDev >= 0.35 && ratioDev <= 0.65,
    message: "CAB roser din balancerede strategi og letter procedurerne – +1 Tid!",
    effect: (gameState) => {
      gameState.time += 1;
    }
  },
  {
    name: "Patch succes",
    condition: (ratioDev, time) => ratioDev < 0.4 && time < 20,
    message: "En patch har løst kritiske fejl i sikkerheden – +2 Sikkerhed!",
    effect: (gameState) => {
      gameState.security += 2;
    }
  },
  {
    name: "Overraskende Synergi",
    condition: (ratioDev, time) => ratioDev >= 0.4 && ratioDev <= 0.6,
    message: "En synergi mellem udvikling og sikkerhed frigør 2 ekstra Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Fremhævelse i Pressen",
    condition: (ratioDev, time) => ratioDev > 0.5 && time > 20,
    message: "Media roser dine innovative løsninger – du får +1 Udvikling!",
    effect: (gameState) => {
      gameState.development += 1;
    }
  },
  {
    name: "Erfaringsudveksling",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 15,
    message: "Du deltager i erfaringsudveksling med andre IT-forvaltere – +1 Sikkerhed!",
    effect: (gameState) => {
      gameState.security += 1;
    }
  },
  {
    name: "Inspirationsworkshop",
    condition: (ratioDev, time) => time > 30,
    message: "En inspirationsworkshop giver nye ideer – du sparer 2 Tid!",
    effect: (gameState) => {
      gameState.time += 2;
    }
  },
  {
    name: "Perfekt Deploy",
    condition: (ratioDev, time) => ratioDev > 0.55 && time < 25,
    message: "En fejlfri deployment af nye features – +2 Udvikling!",
    effect: (gameState) => {
      gameState.development += 2;
    }
  },
  {
    name: "Automatiseret Backupløsning",
    condition: (ratioDev, time) => ratioDev < 0.45 && time > 20,
    message: "En ny automatiseret backupløsning forbedrer sikkerheden – +2 Sikkerhed!",
    effect: (gameState) => {
      gameState.security += 2;
    }
  },

  // -- NEGATIVE EVENTS (20 stk.) --
  {
    name: "Hackerangreb",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Et hackerangreb rammer systemerne hårdt – du mister 3 Tid for at håndtere det.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Ineffektiv drift",
    condition: (ratioDev, time) => ratioDev < 0.35,
    message: "Arbejdsgangene er ineffektive – du bruger 2 Tid på at rette fejl og frustrationer.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Systemfejl",
    condition: (ratioDev, time) => time < 10,
    message: "Kritisk systemfejl! Du bruger 5 Tid på akut fejlretning.",
    effect: (gameState) => {
      gameState.time -= 5;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Compliance-problem",
    condition: (ratioDev, time) => ratioDev < 0.4 && time < 25,
    message: "Audit finder flere compliance-problemer – du mister 4 Tid.",
    effect: (gameState) => {
      gameState.time -= 4;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Bug-overflod",
    condition: (ratioDev, time) => ratioDev > 0.6 && time < 20,
    message: "Mange bugs i nye features – du bruger 3 Tid på bugfix.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Hårdhedstest",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "En ekstern hårdhedstest afslører sårbarheder – du mister 2 Tid.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Utilfredse Brugere",
    condition: (ratioDev, time) => ratioDev < 0.35 && time > 15,
    message: "Brugerne klager over manglende nye features – du mister 3 Tid på support.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "DDoS-angreb",
    condition: (ratioDev, time) => ratioDev > 0.7,
    message: "Et DDoS-angreb har lagt netværket ned – du mister 4 Tid på at afbøde!",
    effect: (gameState) => {
      gameState.time -= 4;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Datatab",
    condition: (ratioDev, time) => ratioDev < 0.35 && time < 20,
    message: "Manglende udviklingsfokus koster et datatab – du mister 2 Tid på gendannelse.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Omfattende Refactoring",
    condition: (ratioDev, time) => ratioDev > 0.6 && time < 15,
    message: "Koden er rod. Du skal udføre en stor refactoring – du mister 3 Tid!",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Konflikt i Teamet",
    condition: (ratioDev, time) => time < 15,
    message: "Intern konflikt sinker arbejdet – du mister 2 Tid på at mægle.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Lokal Strømafbrydelse",
    condition: (ratioDev, time) => time < 10,
    message: "En strømafbrydelse rammer dit primære datacenter – du mister 4 Tid.",
    effect: (gameState) => {
      gameState.time -= 4;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Forældet Hardware",
    condition: (ratioDev, time) => ratioDev < 0.4 && time < 25,
    message: "Forældet hardware skaber flaskehalse – du mister 3 Tid på akut opgradering.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Sikkerhedsbrud",
    condition: (ratioDev, time) => ratioDev > 0.65 && time > 15,
    message: "Et sikkerhedsbrud opstår pga. svag fokus på security – du mister 3 Tid.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Flugt af Nøglemedarbejder",
    condition: (ratioDev, time) => ratioDev > 0.6 && time < 25,
    message: "En nøglemedarbejder siger op – du mister 2 Tid på rekruttering.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Kompetencegab",
    condition: (ratioDev, time) => ratioDev < 0.35 && time < 25,
    message: "Dit team mangler nyeste udviklingskompetencer – du mister 3 Tid på oplæring.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "IT-politik strammes",
    condition: (ratioDev, time) => ratioDev < 0.4,
    message: "Ledelsen strammer sikkerhedspolitikken – du mister 2 Tid på bureaukrati.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Fejlslagen Release",
    condition: (ratioDev, time) => ratioDev > 0.6 && time < 20,
    message: "En ny release fejler kritisk i drift – du mister 4 Tid på rollback.",
    effect: (gameState) => {
      gameState.time -= 4;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Store Koordineringsproblemer",
    condition: (ratioDev, time) => ratioDev > 0.65,
    message: "Fokus på udvikling men mangel på dokumentation giver koordineringsproblemer – du mister 3 Tid.",
    effect: (gameState) => {
      gameState.time -= 3;
      if (gameState.time < 0) gameState.time = 0;
    }
  },
  {
    name: "Manglende Dokumentation",
    condition: (ratioDev, time) => ratioDev > 0.7,
    message: "Udviklingen kører så hurtigt, at dokumentation halter – du mister 2 Tid for at rette op.",
    effect: (gameState) => {
      gameState.time -= 2;
      if (gameState.time < 0) gameState.time = 0;
    }
  },

  // -- NEUTRALE EVENTS (5 stk.) --
  {
    name: "Feedback-session",
    condition: (ratioDev, time) => time > 20,
    message: "Du holder en konstruktiv feedback-session. Ingen direkte ændring i Tid eller point.",
    effect: (gameState) => {
      // Ingen justering
    }
  },
  {
    name: "CAB-møde",
    condition: (ratioDev, time) => ratioDev >= 0.35 && ratioDev <= 0.65,
    message: "CAB bemærker din pæne balance. Ingen ændring, men stemningen er god!",
    effect: (gameState) => {
      // Ingen justering
    }
  },
  {
    name: "Strategimøde",
    condition: (ratioDev, time) => time > 30,
    message: "Du holder et strategimøde – det er et langt møde, men ingen direkte konsekvens.",
    effect: (gameState) => {
      // Ingen justering
    }
  },
  {
    name: "Intern Branding",
    condition: (ratioDev, time) => ratioDev < 0.5 && time > 25,
    message: "Du præsenterer nye sikkerhedsinitiativer for medarbejderne. Ingen ændring i Tid.",
    effect: (gameState) => {
      // Ingen justering
    }
  },
  {
    name: "Workshop med Ekstern Partner",
    condition: (ratioDev, time) => ratioDev > 0.5 && time > 25,
    message: "En ekstern partner præsenterer nye udviklingsmetoder. Ingen direkte effekt.",
    effect: (gameState) => {
      // Ingen justering
    }
  },
];

/**
 * triggerRandomEvent(gameState)
 * - eventChance: sandsynlighed for, at event overhovedet sker
 * - ratioDev: andel af valg, der er udvikling
 * - Filtrerer eventsList for dem, hvis condition(ratioDev, time) == true
 * - Vælger en tilfældigt, hvis der er mindst én
 * - Viser en modal med eventens message
 */
export function triggerRandomEvent(gameState) {
  const eventChance = 0.5;  // 50% chance for event – justér efter behov
  if (Math.random() > eventChance) return;

  const total = gameState.totalDevelopmentChoices + gameState.totalSecurityChoices;
  if (total === 0) return; // ratioDev giver ikke mening, hvis ingen valg er foretaget

  // ratioDev = andel udviklingsvalg ift. total
  const ratioDev = total > 0 ? (gameState.totalDevelopmentChoices / total) : 0;

  // Filtrer event, der opfylder betingelsen
  const possibleEvents = eventsList.filter(ev => ev.condition(ratioDev, gameState.time));
  if (possibleEvents.length === 0) return;

  // Vælg tilfældigt en event blandt de mulige
  const chosenEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
  // Udfør effect
  chosenEvent.effect(gameState);

  // Vis event i modal
  openModal(
    `<h2>Hændelse!</h2><p>${chosenEvent.message}</p>`,
    `<button id="eventOk" class="modern-btn">OK</button>`
  );

  // Ved klik lukkes modal
  document.getElementById('eventOk').addEventListener('click', () => closeModal());
}
