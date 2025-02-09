// cybersikkerhedTasks.js

const cybersikkerhedTasks = [
  // Opgave 1: Opgradering af Antivirus Software (3 trin)
  {
    title: "Opgradering af Antivirus Software",
    shortDesc: "Opgrader det eksisterende antivirus software for at forbedre beskyttelsen mod malware.",
    narrativeIntro: "Denne opgave sigter mod at implementere den nyeste antivirus-teknologi, som bedre kan opdage og neutralisere moderne trusler.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Analyser den nuværende antivirusløsning for svagheder.",
        stepContext: "Gennemgå systemets effektivitet og identificer områder, hvor beskyttelsen kan forbedres.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig analyse",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om opgradering af antivirusløsningen.",
        stepContext: "Få en aftale, der sikrer adgang til den nyeste teknologi og support.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en detaljeret dokumentation af opgraderingsprocessen.",
        stepContext: "Dokumentationen skal forklare de nye funktioner og vedligeholdelsesprocedurer.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 2: Implementering af Intrusion Detection System (3 trin)
  {
    title: "Implementering af Intrusion Detection System",
    shortDesc: "Installer et IDS for at opdage uautoriserede indtrængen i netværket.",
    narrativeIntro: "Et effektivt IDS er essentielt for at opdage og reagere på potentielle cyberangreb.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Vurder den nuværende trusselsdetektion og identificer huller.",
        stepContext: "Kortlæg kritiske områder, hvor netværket er sårbart.",
        choiceA: {
          label: "Omfattende vurdering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig vurdering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå it‑juridiske aspekter ved implementeringen af IDS.",
        stepContext: "Sørg for, at den nye løsning overholder gældende lovgivning.",
        choiceA: {
          label: "Detaljeret juridisk gennemgang",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis juridisk gennemgang",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér implementeringsprocessen for IDS.",
        stepContext: "Skriv en rapport, der beskriver konfigurationen og de forventede fordele.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 3: Opdatering af Log Management System (3 trin)
  {
    title: "Opdatering af Log Management System",
    shortDesc: "Opgrader log-systemet for bedre overvågning og sporing af aktiviteter.",
    narrativeIntro: "Et opdateret log management system hjælper med at identificere og reagere på sikkerhedsbrud hurtigere.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Analyser det nuværende log management system for mangler.",
        stepContext: "Identificer områder, hvor logs ikke indsamles korrekt eller rettidigt.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig analyse",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en ekstern leverandør om opgradering af log systemet.",
        stepContext: "Sikre, at den nye løsning kan håndtere store datamængder og integreres med andre sikkerhedsværktøjer.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér opgraderingen af log management systemet.",
        stepContext: "Udarbejd en rapport, der beskriver den nye opsætning og vedligeholdelsesprocedurer.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 4: Cyberangrebssimulering (4 trin)
  {
    title: "Cyberangrebssimulering",
    shortDesc: "Gennemfør en simulation af et cyberangreb for at teste beredskabet.",
    narrativeIntro: "En realistisk simulation hjælper med at identificere sårbarheder og forberede organisationen på et reelt angreb.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Planlæg og design simuleringsscenariet.",
        stepContext: "Definér mål, trusselsaktører og angrebsvektorer.",
        choiceA: {
          label: "Detaljeret planlægning",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk planlægning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Involver eksterne eksperter for at simulere angrebet.",
        stepContext: "Få hjælp fra specialister, da intern kapacitet ofte er begrænset.",
        choiceA: {
          label: "Detaljeret inddragelse",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Kort inddragelse",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå juridiske rammer for cyberangrebssimulering.",
        stepContext: "Sikre, at simuleringen foregår i overensstemmelse med lovgivning og etiske retningslinjer.",
        choiceA: {
          label: "Omfattende juridisk review",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis review",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér simuleringen og læringspunkterne.",
        stepContext: "Skriv en rapport, der beskriver de identificerede sårbarheder og anbefalinger.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 5: Sikkerhedsmonitorering af IT-systemer (4 trin)
  {
    title: "Sikkerhedsmonitorering af IT-systemer",
    shortDesc: "Implementér et system til løbende overvågning af IT-systemernes sikkerhed.",
    narrativeIntro: "Et effektivt monitoreringssystem hjælper med at opdage angreb og systemsvigt i realtid.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Analyser de eksisterende monitoreringsværktøjer.",
        stepContext: "Identificer huller i overvågningen og mulige forbedringer.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig analyse",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Udarbejd en plan for implementering af et nyt monitoreringssystem.",
        stepContext: "Planlæg systemets arkitektur og integration med eksisterende løsninger.",
        choiceA: {
          label: "Detaljeret plan",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Kort plan",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå juridiske aspekter af monitoreringssystemet.",
        stepContext: "Sikre, at overvågningsdata håndteres i overensstemmelse med lovgivningen.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis gennemgang",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér monitoreringssystemets implementering.",
        stepContext: "Udarbejd en detaljeret dokumentation for fremtidig support og revision.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 6: Implementering af SIEM-løsning (4 trin)
  {
    title: "Implementering af SIEM-løsning",
    shortDesc: "Installer en Security Information and Event Management (SIEM) løsning for centraliseret logning og overvågning.",
    narrativeIntro: "En SIEM-løsning samler og analyserer sikkerhedsdata på tværs af systemer for at opdage anomalier og potentielle angreb.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Vurder det nuværende sikkerhedsovervågningsmiljø og identificer mangler.",
        stepContext: "Kortlæg eksisterende logdata og hændelser for at se, hvor SIEM kan tilføre værdi.",
        choiceA: {
          label: "Omfattende evaluering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig evaluering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om den nye SIEM-løsning.",
        stepContext: "Få en løsning, der kan integreres med eksisterende systemer og opfylde sikkerhedskravene.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg integrationen af SIEM-løsningen med eksisterende systemer.",
        stepContext: "Sikre en centraliseret logning og realtidsanalyse af sikkerhedshændelser.",
        choiceA: {
          label: "Omfattende integrationsplan",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Basis integrationsplan",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér implementeringen af SIEM-løsningen.",
        stepContext: "Udarbejd en detaljeret dokumentation, der beskriver integrationsprocessen og konfigurationen.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 7: Opdatering af Endpoint Protection (4 trin)
  {
    title: "Opdatering af Endpoint Protection",
    shortDesc: "Opgrader sikkerheden på alle slutpunkter med ny endpoint protection software.",
    narrativeIntro: "En opdatering af endpoint protection beskytter enheder mod malware og uautoriseret adgang.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Evaluér den nuværende endpoint protection-løsning.",
        stepContext: "Identificer sårbarheder på de enkelte enheder.",
        choiceA: {
          label: "Omfattende evaluering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig evaluering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om opgradering af endpoint protection.",
        stepContext: "Få adgang til den nyeste teknologi og support.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg implementeringen af den nye endpoint protection-løsning.",
        stepContext: "Sikre, at løsningen kan deployeres på tværs af alle enheder.",
        choiceA: {
          label: "Omfattende plan",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort plan",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér opgraderingen af endpoint protection.",
        stepContext: "Udarbejd en rapport, der beskriver den nye sikkerhedspolitik og konfigurationen.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 8: Implementering af Zero-Day Vulnerability Scanner (5 trin)
  {
    title: "Implementering af Zero-Day Vulnerability Scanner",
    shortDesc: "Installer et scanner-system for at opdage ukendte sårbarheder i systemerne.",
    narrativeIntro: "En Zero-Day Vulnerability Scanner hjælper med at identificere og reagere på nye, ukendte trusler i realtid.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Analyser de nuværende sårbarheder i systemerne.",
        stepContext: "Identificer potentielle Zero-Day trusler gennem en grundig sikkerhedsevaluering.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om scanner-løsningen.",
        stepContext: "Få en avanceret løsning med høj præcision i sårbarhedsdetektionen.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå de juridiske aspekter ved brug af vulnerability scanning.",
        stepContext: "Sikre overholdelse af lovgivning ved brug af avanceret scanner-teknologi.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis gennemgang",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg integrationen af scanner-løsningen med IT-systemerne.",
        stepContext: "Sikre, at den nye scanner kan modtage og analysere data fra alle relevante systemer.",
        choiceA: {
          label: "Omfattende integrationsplan",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort integrationsplan",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér scanner-løsningens implementering og konfiguration.",
        stepContext: "Lav en detaljeret dokumentation, der kan bruges til efterfølgende revision og vedligeholdelse.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 9: Implementering af Zero Trust Network Access (5 trin)
  {
    title: "Implementering af Zero Trust Network Access",
    shortDesc: "Implementér en Zero Trust strategi for at sikre, at intet netværk er implicit tillid.",
    narrativeIntro: "Zero Trust Network Access (ZTNA) hjælper med at beskytte mod interne og eksterne trusler ved at validere alle forbindelser kontinuerligt.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Analyser det nuværende netværk for sårbarheder i tillidssystemet.",
        stepContext: "Identificer, hvilke dele af netværket der kræver streng adgangskontrol.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om en ZTNA-løsning.",
        stepContext: "Få en løsning, der kan håndtere den komplekse sikkerhedsarkitektur.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå juridiske konsekvenser af en Zero Trust implementering.",
        stepContext: "Sørg for at overholde alle lovkrav ved implementering af streng adgangskontrol.",
        choiceA: {
          label: "Omfattende juridisk review",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis review",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Planlæg integrationen af Zero Trust med eksisterende sikkerhedssystemer.",
        stepContext: "Sikre, at den nye tilgang kan implementeres uden at forstyrre driften.",
        choiceA: {
          label: "Detaljeret integrationsplan",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort integrationsplan",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér implementeringen af Zero Trust Network Access.",
        stepContext: "Udarbejd en detaljeret dokumentation, der beskriver alle aspekter af implementeringen.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // Opgave 10: Total Cybersecurity Transformation af Infrastruktur (6 trin)
  {
    title: "Total Cybersecurity Transformation af Infrastruktur",
    shortDesc: "Gennemfør en omfattende digital omstilling af hele hospitalets IT-sikkerhed.",
    narrativeIntro: "Denne opgave involverer en total transformation, der integrerer nye teknologier, eksternt samarbejde og en omfattende opgradering af alle sikkerhedssystemer for at imødekomme fremtidens trusler.",
    focus: "sikkerhed",
    riskProfile: 6,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Foretag en overordnet evaluering af IT-sikkerheden i infrastrukturen.",
        stepContext: "Identificer de største svagheder og områder med behov for modernisering.",
        choiceA: {
          label: "Omfattende evaluering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk evaluering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Indgå samarbejde med eksterne eksperter for at designe den nye sikkerhedsarkitektur.",
        stepContext: "Få adgang til de nyeste teknologier og metoder for at styrke IT-sikkerheden.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+2 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 2 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg og implementer omfattende opgraderinger af sikkerhedssystemerne.",
        stepContext: "Sikre en fuldstændig integration af nye sikkerhedsløsninger i infrastrukturen.",
        choiceA: {
          label: "Omfattende implementering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Basis implementering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå juridiske krav og compliance for transformationen.",
        stepContext: "Sikre at alle opgraderinger overholder gældende lovgivning og standarder.",
        choiceA: {
          label: "Omfattende juridisk review",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis review",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Opgrader de eksisterende sikkerhedssystemer med nye teknologier.",
        stepContext: "Implementer avancerede løsninger, der kan modstå moderne trusler.",
        choiceA: {
          label: "Omfattende sikkerhedsopgradering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Basis opgradering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en omfattende dokumentation af hele transformationen.",
        stepContext: "Dokumentationen skal beskrive alle tekniske, juridiske og operationelle ændringer.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  }
];
