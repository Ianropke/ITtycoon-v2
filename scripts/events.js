// scripts/events.js (eller i main.js, hvis du vil have det samlet)

// 20 events, hvor condition(...) returnerer true, hvis eventet kan udløses
// effect(...) udfører eventets konsekvenser (f.eks. minus tid)
// message er den tekst, der vises i pop-up'en
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
    message: "Et massivt databrud koster dig tid og sikkerhed! -5 Tid og -3 Sikkerhed."
  },
  {
    name: "Crypto-miner infiltration",
    condition: (devRatio, secRatio) => secRatio < 0.3,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 2);
      gameState.security = Math.max(0, gameState.security - 1);
    },
    message: "Fjendtlig crypto-mining software opdaget! -2 Tid og -1 Sikkerhed."
  },
  {
    name: "Botched Dev Release",
    condition: (devRatio, secRatio) => devRatio > 0.7,
    effect: (gameState) => {
      gameState.development = Math.max(0, gameState.development - 2);
    },
    message: "Et nyt release fejler i produktion – du mister 2 Udvikling."
  },
  {
    name: "Burnout i dev team",
    condition: (devRatio, secRatio) => devRatio > 0.7,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 4);
    },
    message: "Dev-teamet oplever burnout! Du bruger 4 ekstra Tid på at reorganisere."
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
    message: "Brugerne klager over mangel på funktioner og stabilitet – du mister 2 Tid på damage control."
  },
  {
    name: "Unexpected synergy",
    condition: (devRatio, secRatio) => devRatio > 0.8,
    effect: (gameState) => {
      gameState.development += 3;
    },
    message: "En fantastisk synergi opstår i dev-teamet! +3 Udvikling."
  },
  {
    name: "Legal compliance snag",
    condition: (devRatio, secRatio) => secRatio > 0.8,
    effect: (gameState) => {
      gameState.security = Math.max(0, gameState.security - 2);
      gameState.development = Math.max(0, gameState.development - 1);
    },
    message: "Overfokusering på sikkerhed har skabt juridiske flaskehalse – -2 Sikkerhed og -1 Udvikling."
  },
  {
    name: "IT meltdown",
    condition: (devRatio, secRatio) => devRatio > 0.9,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 6);
      gameState.development = Math.max(0, gameState.development - 3);
    },
    message: "Et total meltdown i systemet efter for stor dev-eksperimentering! -6 Tid og -3 Udvikling."
  },
  {
    name: "Massive server crash",
    condition: (devRatio, secRatio) => secRatio > 0.9,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 5);
      gameState.security = Math.max(0, gameState.security - 2);
    },
    message: "Serverne bryder sammen under ekstrem sikkerhedsprotokol! -5 Tid, -2 Sikkerhed."
  },
  {
    name: "Generous sponsor",
    condition: (devRatio, secRatio) => devRatio > 0.6,
    effect: (gameState) => {
      gameState.time += 3;
    },
    message: "En sponsor er imponeret over jeres innovation – +3 Tid!"
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
    message: "Du hyrer en ekstern sikkerhedskonsulent – +2 Sikkerhed!"
  },
  {
    name: "Bureaucratic overhead",
    condition: (devRatio, secRatio) => Math.random() < 0.3, // 30% chance generelt
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 2);
    },
    message: "Bureaukrati og møder stjæler tid – -2 Tid."
  },
  {
    name: "Lightning meltdown",
    condition: (devRatio, secRatio) => devRatio < 0.4, 
    effect: (gameState) => {
      gameState.development = Math.max(0, gameState.development - 2);
    },
    message: "Et lynnedslag lammer dele af systemet, og dev-teamet må rulle kode tilbage! -2 Udvikling."
  },
  {
    name: "Power outage",
    condition: (devRatio, secRatio) => secRatio < 0.4,
    effect: (gameState) => {
      gameState.time = Math.max(0, gameState.time - 3);
    },
    message: "Strømsvigt i datacentret! -3 Tid på at genoprette systemerne."
  },
  {
    name: "Public acclaim",
    condition: (devRatio, secRatio) => devRatio > 0.7,
    effect: (gameState) => {
      gameState.development += 3;
    },
    message: "Offentligheden roser jeres nye features! +3 Udvikling."
  },
  {
    name: "Audit fiasco",
    condition: (devRatio, secRatio) => secRatio < 0.3,
    effect: (gameState) => {
      gameState.security = Math.max(0, gameState.security - 3);
      gameState.time = Math.max(0, gameState.time - 2);
    },
    message: "En ekstern audit afslører alvorlige sikkerhedsbrister! -3 Sikkerhed, -2 Tid."
  }
];
