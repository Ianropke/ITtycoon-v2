// scripts/events.js

/**
 * checkForEvents – Gennemgår en liste af 20 hændelser og returnerer den første, der udløses.
 * 
 * @param {Object} gameState - Det globale spiltilstandsobjekt.
 * @returns {Object} { eventOccurred: boolean, eventMessage: string }
 */
export function checkForEvents(gameState) {
  const events = [
    {
      name: "Hackerangreb",
      condition: (gs) => {
        const total = gs.totalDevelopmentChoices + gs.totalSecurityChoices;
        return total > 0 && (gs.totalDevelopmentChoices / total) > 0.65;
      },
      probability: 0.3,
      message: "Et hackerangreb rammer din infrastruktur! Du mister 4 Tid.",
      effect: (gs) => { gs.time = Math.max(0, gs.time - 4); }
    },
    {
      name: "Audit Udført",
      condition: (gs) => {
        const total = gs.totalDevelopmentChoices + gs.totalSecurityChoices;
        return total > 0 && (gs.totalSecurityChoices / total) > 0.65;
      },
      probability: 0.25,
      message: "En audit afslører mangler i sikkerheden! Du mister 3 Tid.",
      effect: (gs) => { gs.time = Math.max(0, gs.time - 3); }
    },
    {
      name: "Systemfejl",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.4,
      message: "En systemfejl opstår – dine point reduceres med 20%.",
      effect: (gs) => {
        gs.security = Math.floor(gs.security * 0.8);
        gs.development = Math.floor(gs.development * 0.8);
      }
    },
    {
      name: "Held og Lykke",
      condition: (gs) => Math.random() < 0.3,
      probability: 0.5,
      message: "Du får et heldigt gennembrud – 5 ekstra Tid til din rådighed!",
      effect: (gs) => { gs.time += 5; }
    },
    {
      name: "Budgetnedskæringer",
      condition: (gs) => Math.random() < 0.15,
      probability: 0.4,
      message: "Budgetnedskæringer reducerer dine ressourcer – du mister 2 Tid.",
      effect: (gs) => { gs.time = Math.max(0, gs.time - 2); }
    },
    {
      name: "Innovationsgennembrud",
      condition: (gs) => Math.random() < 0.25,
      probability: 0.5,
      message: "Et innovativt gennembrud øger dine udviklingspoint med 3!",
      effect: (gs) => { gs.development += 3; }
    },
    {
      name: "Medarbejdersamarbejde",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.5,
      message: "Dine medarbejdere arbejder effektivt sammen – du får 2 ekstra sikkerhedspoint.",
      effect: (gs) => { gs.security += 2; }
    },
    {
      name: "IT-Support Intervention",
      condition: (gs) => Math.random() < 0.3,
      probability: 0.4,
      message: "En hurtig IT-support intervention forhindrer større problemer – du får 2 ekstra Tid.",
      effect: (gs) => { gs.time += 2; }
    },
    {
      name: "Kritisk Systemnedbrud",
      condition: (gs) => Math.random() < 0.1,
      probability: 0.7,
      message: "Et kritisk systemnedbrud rammer – du mister 5 Tid.",
      effect: (gs) => { gs.time = Math.max(0, gs.time - 5); }
    },
    {
      name: "Kunde Klager",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.3,
      message: "Kunder klager over ineffektivitet – dine point reduceres med 2.",
      effect: (gs) => {
        gs.security = Math.max(0, gs.security - 2);
        gs.development = Math.max(0, gs.development - 2);
      }
    },
    {
      name: "Netværksoptimering",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.4,
      message: "Netværket optimeres – du får 3 ekstra sikkerhedspoint!",
      effect: (gs) => { gs.security += 3; }
    },
    {
      name: "Ny Softwareudrulning",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.4,
      message: "Ny softwareudrulning øger dine udviklingspoint med 3.",
      effect: (gs) => { gs.development += 3; }
    },
    {
      name: "Træningssession",
      condition: (gs) => Math.random() < 0.25,
      probability: 0.5,
      message: "Effektiv træning øger både sikkerhed og udviklingspoint med 2!",
      effect: (gs) => { gs.security += 2; gs.development += 2; }
    },
    {
      name: "Sikkerhedsopgradering",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.4,
      message: "En sikkerhedsopgradering giver dig 3 ekstra sikkerhedspoint!",
      effect: (gs) => { gs.security += 3; }
    },
    {
      name: "Udviklingskonference",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.4,
      message: "Deltagelse i en udviklingskonference øger dine udviklingspoint med 3.",
      effect: (gs) => { gs.development += 3; }
    },
    {
      name: "Forbedret Systemovervågning",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.5,
      message: "Forbedret systemovervågning reducerer risikoen – du får 2 ekstra Tid.",
      effect: (gs) => { gs.time += 2; }
    },
    {
      name: "Mindre Systemfejl",
      condition: (gs) => Math.random() < 0.15,
      probability: 0.5,
      message: "En mindre systemfejl opstår – du mister 1 Tid.",
      effect: (gs) => { gs.time = Math.max(0, gs.time - 1); }
    },
    {
      name: "Opgraderingsbonus",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.5,
      message: "En vellykket opgradering giver dig 4 ekstra Tid!",
      effect: (gs) => { gs.time += 4; }
    },
    {
      name: "Datafejl",
      condition: (gs) => Math.random() < 0.15,
      probability: 0.4,
      message: "En datafejl reducerer dine point med 20%.",
      effect: (gs) => {
        gs.security = Math.floor(gs.security * 0.8);
        gs.development = Math.floor(gs.development * 0.8);
      }
    },
    {
      name: "Teknologisk Gennembrud",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.5,
      message: "Et teknologisk gennembrud øger både sikkerhed og udviklingspoint med 4!",
      effect: (gs) => { gs.security += 4; gs.development += 4; }
    },
    {
      name: "Ekspert Rådgivning",
      condition: (gs) => Math.random() < 0.2,
      probability: 0.5,
      message: "Ekspert rådgivning øger din samlede score med 5 point.",
      effect: (gs) => { gs.security += 2; gs.development += 3; }
    }
  ];

  for (let event of events) {
    if (event.condition(gameState)) {
      if (Math.random() < event.probability) {
        event.effect(gameState);
        return { eventOccurred: true, eventMessage: event.message };
      }
    }
  }
  return { eventOccurred: false, eventMessage: "" };
}
