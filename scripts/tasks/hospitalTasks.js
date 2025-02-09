// hospitalTasks.js

const hospitalTasks = [
  // Opgave 1: Nyt LIMS (5 trin – kompleks opgave med leverandør)
  {
    title: "Nyt LIMS",
    shortDesc: "Implementer et nyt Laboratorie Informations Management System for at optimere workflow og datakvalitet.",
    narrativeIntro: "Da vi ikke udvikler systemet internt, skal vi samarbejde med en ekstern leverandør. Denne opgave kræver en grundig analyse, forhandling, integration, juridisk gennemgang og afsluttes med en komplet dokumentation.",
    focus: "udvikling",
    riskProfile: 5,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser den nuværende LIMS-løsning for mangler og ineffektiviteter.",
        stepContext: "Kortlæg systemets svagheder og identificer krav til den nye løsning.",
        choiceA: {
          label: "Grundig analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en ekstern leverandør om implementeringen af det nye LIMS.",
        stepContext: "Få en aftale om pris og implementeringsplan, da vi ikke udvikler systemet selv.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg integrationen af det nye system med de eksisterende IT-systemer.",
        stepContext: "Sørg for, at den nye LIMS-løsning kommunikerer korrekt med andre systemer.",
        choiceA: {
          label: "Omfattende integrationsplan",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Simpel integrationsplan",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå de it‑juridiske krav for den nye LIMS-løsning.",
        stepContext: "Sikre, at kontrakter og lovgivning overholdes.",
        choiceA: {
          label: "Omfattende juridisk vurdering",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis juridisk vurdering",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en fuld dokumentation af det nye LIMS-system.",
        stepContext: "Dokumentationen skal være komplet, så systemet kan vedligeholdes og opgraderes fremadrettet.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 2: Opgradering af Patientdata System (3 trin – simpel opgave)
  {
    title: "Opgradering af Patientdata System",
    shortDesc: "Forbedr dataintegration og brugergrænseflade i det nuværende patientdatasystem.",
    narrativeIntro: "Denne opgave fokuserer på at optimere de interne processer og sikre, at patientdata behandles effektivt.",
    focus: "udvikling",
    riskProfile: 4,
    steps: [
      {
        location: "hospital",
        stepDescription: "Kortlæg den nuværende struktur og identificer ineffektive processer.",
        stepContext: "Identificer de vigtigste problemområder i systemet.",
        choiceA: {
          label: "Grundig analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Sikre overholdelse af databeskyttelseslovgivningen.",
        stepContext: "Gennemgå relevante juridiske retningslinjer for patientdata.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis juridisk gennemgang",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér de implementerede opgraderinger.",
        stepContext: "Udarbejd en kort rapport over forbedringerne.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 3: Implementering af Elektroniske Journaler (3 trin)
  {
    title: "Implementering af Elektroniske Journaler",
    shortDesc: "Digitaliser papirjournaler for at forbedre datatilgængeligheden.",
    narrativeIntro: "Digitalisering af journaler vil effektivisere datahåndtering og forbedre patientplejen.",
    focus: "udvikling",
    riskProfile: 5,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser de eksisterende papirjournaler for ineffektivitet.",
        stepContext: "Identificer de kritiske data, der skal digitaliseres.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Hurtig analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Vælg en ekstern leverandør til digitaliseringsløsningen.",
        stepContext: "Samarbejde er nødvendigt, da vi ikke udvikler systemet internt.",
        choiceA: {
          label: "Omfattende forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+2 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 2 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en digitaliseringsrapport for de nye elektroniske journaler.",
        stepContext: "Dokumentationen skal være klar til vedligeholdelse og opfølgning.",
        choiceA: {
          label: "Detaljeret rapport",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort rapport",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 4: Opdatering af Laboratorie Software (3 trin)
  {
    title: "Opdatering af Laboratorie Software",
    shortDesc: "Forbedr funktionaliteten af det eksisterende laboratorie software.",
    narrativeIntro: "Opgraderingen skal gøre softwaren mere brugervenlig og effektiv for laboratoriepersonalet.",
    focus: "udvikling",
    riskProfile: 4,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser den nuværende software for fejl og mangler.",
        stepContext: "Identificer de vigtigste funktionalitetsproblemer.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå juridiske aspekter af softwaren.",
        stepContext: "Sikre at opgraderingen overholder relevante regler.",
        choiceA: {
          label: "Omfattende vurdering",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis vurdering",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér opgraderingen af softwaren.",
        stepContext: "Skriv en kort rapport over de udførte ændringer.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 5: Udvikling af Patientportal (4 trin)
  {
    title: "Udvikling af Patientportal",
    shortDesc: "Design og implementer en ny patientportal for bedre kommunikation.",
    narrativeIntro: "En ny portal vil forbedre patientoplevelsen og øge den digitale interaktion.",
    focus: "udvikling",
    riskProfile: 4,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser eksisterende kommunikationsflow og identificer mangler.",
        stepContext: "Fokusér på brugeroplevelse og behov for digitalisering.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en ekstern leverandør om udvikling af portalen.",
        stepContext: "Da vi ikke udvikler systemet selv, er et eksternt samarbejde nødvendigt.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+2 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 2 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Integrér patientportalen med hospitalets eksisterende IT-systemer.",
        stepContext: "Sørg for problemfri dataudveksling og brugeradgang.",
        choiceA: {
          label: "Omfattende integration",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Basis integration",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér den nye patientportal.",
        stepContext: "Udarbejd en rapport, der beskriver funktioner og integration.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 6: Integration af EHR System (4 trin)
  {
    title: "Integration af EHR System",
    shortDesc: "Integrer et nyt Electronic Health Record system med de eksisterende løsninger.",
    narrativeIntro: "En vellykket integration af EHR systemet vil sikre bedre dataudveksling og klinisk beslutningstagning.",
    focus: "udvikling",
    riskProfile: 5,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser de nuværende EHR-løsninger og kortlæg integrationsbehov.",
        stepContext: "Identificer nøgleområder for dataudveksling og systemkompatibilitet.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med EHR-leverandøren om integrationsløsningen.",
        stepContext: "Samarbejde er afgørende for en vellykket integration.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+2 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 2 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå lovmæssige krav for EHR integration.",
        stepContext: "Sørg for overholdelse af GDPR og andre standarder.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis juridisk gennemgang",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér integrationsprocessen for EHR systemet.",
        stepContext: "Skriv en rapport, der beskriver alle tekniske og juridiske aspekter.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 7: Opgradering af IT-Systemer (4 trin)
  {
    title: "Opgradering af IT-Systemer",
    shortDesc: "Moderniser de eksisterende IT-systemer på hospitalet for bedre ydeevne.",
    narrativeIntro: "Opgraderingerne skal optimere systemernes drift og understøtte fremtidig udvikling.",
    focus: "udvikling",
    riskProfile: 4,
    steps: [
      {
        location: "hospital",
        stepDescription: "Evaluer de nuværende IT-systemer og identificer forbedringsmuligheder.",
        stepContext: "Find områder, hvor systemerne halter.",
        choiceA: {
          label: "Detaljeret evaluering",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk evaluering",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg tekniske opgraderinger og systemintegrationer.",
        stepContext: "Sørg for, at de nye systemer kan integreres problemfrit.",
        choiceA: {
          label: "Omfattende plan",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort plan",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå kontrakter og juridiske forpligtelser.",
        stepContext: "Sikre at opgraderingerne overholder alle regler.",
        choiceA: {
          label: "Omfattende juridisk review",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis juridisk review",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér de opgraderede IT-systemer og integrationer.",
        stepContext: "Udarbejd en detaljeret rapport over ændringerne.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 8: Digitalisering af Administrationssystem (4 trin)
  {
    title: "Digitalisering af Administrationssystem",
    shortDesc: "Moderniser det papirbaserede administrationssystem for at øge effektiviteten.",
    narrativeIntro: "Digitalisering vil automatisere processerne og reducere fejl i administrationen.",
    focus: "udvikling",
    riskProfile: 4,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser de nuværende administrative processer for ineffektivitet.",
        stepContext: "Identificer de manuelle flaskehalse i systemet.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med en ekstern leverandør om digitaliseringsløsningen.",
        stepContext: "Eksternt samarbejde er nødvendigt for at implementere en digital løsning.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+2 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 2 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Implementér digitalisering af de manuelle processer.",
        stepContext: "Sørg for, at systemet kan håndtere den nye digitale arbejdsproces.",
        choiceA: {
          label: "Omfattende implementering",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Basis implementering",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér digitaliseringsprocessen og resultaterne.",
        stepContext: "Udarbejd en rapport, der beskriver den nye digitale løsning.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 9: Udvikling af Avanceret Patientportal (5 trin)
  {
    title: "Udvikling af Avanceret Patientportal",
    shortDesc: "Design og implementer en avanceret patientportal med ekstra funktioner.",
    narrativeIntro: "Denne opgave kræver et højt niveau af digital udvikling og integration for at skabe en portal, der imødekommer fremtidens krav.",
    focus: "udvikling",
    riskProfile: 5,
    steps: [
      {
        location: "hospital",
        stepDescription: "Analysér den nuværende patientkommunikation og identificer mangler.",
        stepContext: "Kortlæg behovene for en avanceret portal.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Vælg en ekstern leverandør til udviklingen af den avancerede portal.",
        stepContext: "Samarbejde er essentielt for avancerede digitale løsninger.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+2 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 2 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå de juridiske aspekter ved den avancerede portal.",
        stepContext: "Sikre overholdelse af alle relevante regler og standarder.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis juridisk gennemgang",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Integrér den avancerede portal med hospitalets eksisterende IT-systemer.",
        stepContext: "Sørg for sømløs dataudveksling og systemintegration.",
        choiceA: {
          label: "Omfattende integration",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Basis integration",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en detaljeret dokumentation af den avancerede patientportal.",
        stepContext: "Dokumentationen skal give en fuld oversigt over funktioner og integration.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // Opgave 10: Total Digital Transformation af Hospitalets IT-Infrastruktur (6 trin)
  {
    title: "Total Digital Transformation af Hospitalets IT-Infrastruktur",
    shortDesc: "En omfattende digital transformation, der moderniserer alle IT-systemer på hospitalet.",
    narrativeIntro: "Denne opgave omfatter en total omstilling, der kræver intensiv analyse, eksternt samarbejde og integration på tværs af systemer. Opgaven er kompleks og kræver mange trin.",
    focus: "udvikling",
    riskProfile: 6,
    steps: [
      {
        location: "hospital",
        stepDescription: "Foretag en overordnet analyse af alle IT-systemer og identificer forbedringsmuligheder.",
        stepContext: "Vurder systemernes samlede effektivitet og identificer kritiske svagheder.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk analyse",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Indgå samarbejde med eksterne specialister for at designe den nye infrastruktur.",
        stepContext: "Da vi ikke udvikler internt, er en leverandør nødvendig for denne transformation.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+4 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 4 } }
        },
        choiceB: {
          label: "Hurtig beslutning",
          text: "+2 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 2 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Planlæg og implementer omfattende tekniske opgraderinger.",
        stepContext: "Sørg for at alle systemer kan kommunikere og integreres effektivt.",
        choiceA: {
          label: "Omfattende opgradering",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Basis opgradering",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Gennemgå alle juridiske og compliance-aspekter for transformationen.",
        stepContext: "Sikre at transformationen opfylder alle lovkrav og standarder.",
        choiceA: {
          label: "Omfattende juridisk review",
          text: "+2 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis juridisk review",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Evaluer og opgrader sikkerhedsforanstaltninger i den nye infrastruktur.",
        stepContext: "Selvom fokus er på udvikling, skal sikkerheden sikres for at beskytte systemerne.",
        choiceA: {
          label: "Omfattende sikkerhedsopgradering",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Basis sikkerhedsopgradering",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en omfattende dokumentation af hele den digitale transformation.",
        stepContext: "Dokumentationen skal indeholde detaljer om alle opgraderinger, integrationer og juridiske overvejelser.",
        choiceA: {
          label: "Detaljeret dokumentation",
          text: "+3 Udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 Udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  }
];
