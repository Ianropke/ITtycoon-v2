window.infrastrukturTasks = [
  // 1) Netværksopgradering
  {
    title: "Netværksopgradering",
    shortDesc: "Opgrader netværksinfrastrukturen for øget båndbredde og sikkerhed.",
    narrativeIntro: "En opgradering af netværket sikrer bedre performance og forhindrer datatab, samtidig med at det øger systemets sikkerhed.",
    riskProfile: 3,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Kortlæg den nuværende netværksarkitektur.",
        stepContext: "Analyser designet for flaskehalse og sikkerhedshuller.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 sikkerhed, -2 tid",
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
        stepDescription: "Forhandle med netværksleverandøren.",
        stepContext: "Sikre bedre hardware og supportaftaler.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
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
        stepDescription: "Opdater netværksdokumentationen.",
        stepContext: "Nøjagtig dokumentation sikrer korrekt vedligeholdelse og fremtidig fejlretning.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Kortfattet dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // 2) Serveropgradering
  {
    title: "Serveropgradering",
    shortDesc: "Opgrader serverne for at øge ydeevnen og sikkerheden.",
    narrativeIntro: "Moderne servere sikrer en stabil drift og reducerer risikoen for nedbrud og datatab.",
    riskProfile: 3,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Vurder den nuværende serverkapacitet og belastning.",
        stepContext: "Identificér flaskehalse og forældet hardware.",
        choiceA: {
          label: "Detaljeret vurdering",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk vurdering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandle med hardwareleverandører.",
        stepContext: "Sikre gode priser og serviceaftaler.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
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
        stepDescription: "Opdater serverdokumentationen.",
        stepContext: "Dokumentér de nye konfigurationer og procedurer.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
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

  // 3) Datacenter Optimering
  {
    title: "Datacenter Optimering",
    shortDesc: "Optimer driften i datacentret for bedre effektivitet og sikkerhed.",
    narrativeIntro: "En effektiv datacenteroptimering kan reducere driftsomkostninger og øge systemets robusthed.",
    riskProfile: 3,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Analyser datacenterets energiforbrug og kølesystem.",
        stepContext: "Identificér ineffektive processer og risikoområder.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 sikkerhed, -2 tid",
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
        location: "dokumentation",
        stepDescription: "Opdater datacenterprocedurerne.",
        stepContext: "Dokumentér nye optimerede processer for fremtidig reference.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandle med leverandører om bedre hardwareløsninger.",
        stepContext: "Få adgang til ny teknologi og sikre fremragende support.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // 4) Implementering af Virtualisering
  {
    title: "Implementering af Virtualisering",
    shortDesc: "Virtualisér servere for at øge fleksibilitet og reducere omkostninger.",
    narrativeIntro: "Virtualisering konsoliderer hardware, forbedrer driftseffektivitet og øger sikkerheden ved at isolere arbejdsbelastninger.",
    riskProfile: 4,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Vurder det nuværende servermiljø og virtualiseringspotentiale.",
        stepContext: "Identificér systemer, der egner sig til virtualisering.",
        choiceA: {
          label: "Detaljeret vurdering",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk vurdering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandle om virtualiseringssoftware og licenser.",
        stepContext: "Få de bedste vilkår og supportaftaler til den nye teknologi.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
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
        stepDescription: "Opdater dokumentationen for virtualiseringsmiljøet.",
        stepContext: "Dokumentér de nye processer og procedurer grundigt.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
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

  // 5) Forbedring af Backup-system
  {
    title: "Forbedring af Backup-system",
    shortDesc: "Opgrader backup-systemet for at beskytte data og reducere nedetid.",
    narrativeIntro: "Et robust backup-system er afgørende for at forhindre datatab ved systemfejl og cyberangreb.",
    riskProfile: 3,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Analyser det nuværende backup-system for svagheder.",
        stepContext: "Identificér flaskehalse og risikoområder i data-backup processerne.",
        choiceA: {
          label: "Detaljeret evaluering",
          text: "+3 sikkerhed, -2 tid",
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
        location: "dokumentation",
        stepDescription: "Opdater backup-procedurerne.",
        stepContext: "Sørg for, at de nye procedurer er veldokumenterede og nemme at følge.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Test backup-systemet grundigt.",
        stepContext: "Udfør tests for at sikre, at systemet hurtigt kan gendanne data ved fejl.",
        choiceA: {
          label: "Detaljeret test",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Standard test",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // 6) Opgradering af Routere
  {
    title: "Opgradering af Routere",
    shortDesc: "Opgrader routere for forbedret netværkssikkerhed og hastighed.",
    narrativeIntro: "Moderne routere øger både netværkshastigheden og sikkerheden ved at integrere avancerede sikkerhedsfunktioner.",
    riskProfile: 2,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Analyser den nuværende routerkonfiguration.",
        stepContext: "Identificér eventuelle sikkerhedshuller og flaskehalse.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 sikkerhed, -2 tid",
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
        stepDescription: "Forhandle med routerproducenter.",
        stepContext: "Sikre de bedste priser og supportaftaler for de nye routere.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
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
        stepDescription: "Opdater routerdokumentationen.",
        stepContext: "Dokumentér de nye routerindstillinger og konfigurationer.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
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

  // 7) Switch Optimering
  {
    title: "Switch Optimering",
    shortDesc: "Opgrader og optimer netværksswitches for bedre datatransmission.",
    narrativeIntro: "Optimerede switches reducerer latency og øger den samlede netværkseffektivitet.",
    riskProfile: 2,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Kortlæg nuværende switch-konfigurationer.",
        stepContext: "Identificér muligheder for optimering af netværksflowet.",
        choiceA: {
          label: "Detaljeret kortlægning",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overfladisk kortlægning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Opgrader switch-hardware.",
        stepContext: "Udskift forældet hardware for at sikre bedre ydeevne.",
        choiceA: {
          label: "Omfattende opgradering",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Standard opgradering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater dokumentationen for switch-konfigurationer.",
        stepContext: "Dokumentér alle ændringer for fremtidig reference.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
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

  // 8) Strømsikkerhed i Datacenter
  {
    title: "Strømsikkerhed i Datacenter",
    shortDesc: "Sikr datacenterets strømforsyning for at forhindre nedbrud.",
    narrativeIntro: "En stabil strømforsyning er afgørende for datacentrets drift og beskytter mod uventede nedbrud.",
    riskProfile: 3,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Analyser den nuværende strømforsyning og identificér risici.",
        stepContext: "Find de svage punkter, hvor strømforsyningen kan fejle.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 sikkerhed, -2 tid",
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
        stepDescription: "Forhandle med el-leverandøren om bedre serviceaftaler.",
        stepContext: "Sikre en stabil strømforsyning med forbedrede garantier.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
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
        stepDescription: "Opdater procedurerne for strømforsyning i datacentret.",
        stepContext: "Dokumentér de nye standarder og procedurer for en mere sikker drift.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
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

  // 9) IT-infrastruktur Modernisering
  {
    title: "IT-infrastruktur Modernisering",
    shortDesc: "Modernisér hele IT-infrastrukturen for bedre performance og robusthed.",
    narrativeIntro: "En omfattende modernisering opdaterer hardware og software, hvilket øger driftssikkerheden og sikkerheden.",
    riskProfile: 4,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Udfør en fuldstændig evaluering af den nuværende infrastruktur.",
        stepContext: "Identificér forældet hardware og ineffektive processer.",
        choiceA: {
          label: "Detaljeret evaluering",
          text: "+3 sikkerhed, -2 tid",
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
        location: "dokumentation",
        stepDescription: "Opdater al IT-dokumentation til at afspejle den nye infrastruktur.",
        stepContext: "Dokumentationen skal være klar og detaljeret for fremtidig vedligeholdelse.",
        choiceA: {
          label: "Omfattende opdatering",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Kort opdatering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandle med leverandører om de nyeste IT-løsninger.",
        stepContext: "Sikre adgang til den nyeste teknologi og bedre supportaftaler.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // 10) Cloud Migration
  {
    title: "Cloud Migration",
    shortDesc: "Migrér IT-systemer til skyen for øget fleksibilitet og sikkerhed.",
    narrativeIntro: "Cloud migration kan reducere omkostninger, øge skalerbarheden og forbedre systemets robusthed.",
    riskProfile: 4,
    focus: "sikkerhed",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Evaluér hvilke systemer der skal migreres til skyen.",
        stepContext: "Identificér de systemer, der vil have størst fordel af cloud-teknologi.",
        choiceA: {
          label: "Detaljeret evaluering",
          text: "+3 sikkerhed, -2 tid",
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
        stepDescription: "Forhandle med cloud-udbydere om migreringsbetingelser.",
        stepContext: "Få de bedste vilkår og supportaftaler for en problemfri migration.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
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
        stepDescription: "Udarbejd en detaljeret migreringsplan og dokumentation.",
        stepContext: "Sikre, at alle trin i migreringsprocessen er klart dokumenteret og testet.",
        choiceA: {
          label: "Omfattende plan",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Standard plan",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  }
];
