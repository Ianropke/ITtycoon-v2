// infrastrukturTasks.js

const infrastrukturTasks = [
  // Opgave 1: Installation af Nyt Routerudstyr (3 trin)
  {
    title: "Installation af Nyt Routerudstyr",
    shortDesc: "Installer nyt routerudstyr for at forbedre netværkets stabilitet og sikkerhed.",
    narrativeIntro: "En opgradering af routerudstyret er nødvendig for at sikre et robust og sikkert netværk.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Vurder det nuværende netværksudstyr og identificer behov for opgradering.",
        stepContext: "En grundig evaluering af routerens ydeevne og kapacitet er nødvendig.",
        choiceA: {
          label: "Grundig vurdering",
          text: "+3 sikkerhed, −2 tid",
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
        stepDescription: "Forhandl med en ekstern leverandør om det nye routerudstyr.",
        stepContext: "Få de bedste priser og en klar implementeringsplan, da vi er afhængige af eksterne partnere.",
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
        stepDescription: "Udarbejd en detaljeret dokumentation af installationen.",
        stepContext: "Dokumentationen skal sikre, at fremtidige vedligeholdelser kan udføres effektivt.",
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

  // Opgave 2: Opdatering af Firewall-system (3 trin)
  {
    title: "Opdatering af Firewall-system",
    shortDesc: "Forbedr firewall-konfigurationen for at beskytte netværket mod trusler.",
    narrativeIntro: "En opdatering af firewall-systemet er kritisk for at sikre mod uautoriseret adgang og cyberangreb.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Evaluer den nuværende firewall-konfiguration og identificer sårbarheder.",
        stepContext: "Identificer de primære risikoområder i firewallens beskyttelse.",
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
        location: "it‑jura",
        stepDescription: "Gennemgå de it‑juridiske krav for firewall-systemet.",
        stepContext: "Sikre at systemet overholder de seneste lovkrav og standarder.",
        choiceA: {
          label: "Detaljeret juridisk review",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis juridisk review",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér opdateringerne af firewall-systemet.",
        stepContext: "En klar dokumentation er nødvendig for fremtidig support og revision.",
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

  // Opgave 3: Implementering af Backup-løsninger (3 trin)
  {
    title: "Implementering af Backup-løsninger",
    shortDesc: "Sikre kontinuiteten ved at implementere robuste backup-løsninger.",
    narrativeIntro: "For at beskytte data mod tab og nedbrud skal der implementeres backup-løsninger, der understøtter sikkerheden i systemet.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Kortlæg de nuværende backup-procedurer og identificer mangler.",
        stepContext: "Fokusér på kritiske systemer og databeskyttelse.",
        choiceA: {
          label: "Grundig analyse",
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
        stepDescription: "Forhandl med en leverandør om backup-løsninger.",
        stepContext: "Samarbejde med en ekstern part er nødvendigt for en effektiv løsning.",
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
        location: "dokumentation",
        stepDescription: "Udarbejd en dokumentation af backup-løsningen.",
        stepContext: "Dokumentationen skal sikre, at løsningen kan vedligeholdes og testes regelmæssigt.",
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

  // Opgave 4: Modernisering af Serverrum (4 trin)
  {
    title: "Modernisering af Serverrum",
    shortDesc: "Opgrader og moderniser serverrummet for bedre ydeevne og sikkerhed.",
    narrativeIntro: "En modernisering af serverrummet vil forbedre driftssikkerheden og sikre et mere effektivt miljø.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Evaluer det nuværende serverrum og identificer de primære forbedringsområder.",
        stepContext: "Vurder serverrummets fysiske tilstand og kølesystem.",
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
        stepDescription: "Forhandl med eksterne leverandører om opgraderingen af serverrummet.",
        stepContext: "Samarbejde med eksterne specialister er afgørende for et optimalt resultat.",
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
        location: "it‑jura",
        stepDescription: "Gennemgå it‑juridiske krav for opgraderingen af serverrummet.",
        stepContext: "Sikre overholdelse af alle relevante sikkerheds- og lovkrav.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
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
        stepDescription: "Dokumentér alle opgraderinger i serverrummet.",
        stepContext: "Udarbejd en detaljeret rapport, der kan bruges til fremtidig vedligeholdelse.",
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

  // Opgave 5: Netværksovervågningssystem (4 trin)
  {
    title: "Netværksovervågningssystem",
    shortDesc: "Implementér et system til at overvåge netværkets drift og sikkerhed.",
    narrativeIntro: "Et effektivt overvågningssystem er essentielt for at opdage og reagere på netværksproblemer og sikkerhedstrusler.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Analyser det nuværende netværksovervågningssystem for svagheder.",
        stepContext: "Identificer de mest kritiske overvågningsmangler og potentielle trusler.",
        choiceA: {
          label: "Grundig analyse",
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
        location: "infrastruktur",
        stepDescription: "Udarbejd en plan for et nyt overvågningssystem.",
        stepContext: "Planlæg systemets opsætning for at sikre optimal dækning af netværket.",
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
        stepDescription: "Gennemgå lovkrav for netværksovervågning.",
        stepContext: "Sikre, at den nye løsning overholder alle relevante standarder.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
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
        stepDescription: "Dokumentér det nye overvågningssystem.",
        stepContext: "Udarbejd en klar dokumentation, så systemets drift kan understøttes i fremtiden.",
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

  // Opgave 6: Opgradering af IT-Sikkerhedssystemer (4 trin)
  {
    title: "Opgradering af IT-Sikkerhedssystemer",
    shortDesc: "Forbedr de eksisterende sikkerhedssystemer for at beskytte netværket.",
    narrativeIntro: "Denne opgave sigter mod at styrke IT-sikkerheden ved at opgradere firewall, antivirus og overvågningsløsninger.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Analyser de nuværende sikkerhedssystemer og identificer potentielle svagheder.",
        stepContext: "Identificer, hvor systemet kan forbedres for bedre beskyttelse.",
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
        location: "it‑jura",
        stepDescription: "Gennemgå it‑juridiske krav for de opgraderede sikkerhedssystemer.",
        stepContext: "Sikre, at de nye systemer overholder alle lovkrav.",
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
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om opgraderinger af sikkerhedssystemerne.",
        stepContext: "Få en aftale om den nødvendige hardware og softwareopgradering.",
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
        stepDescription: "Dokumentér opgraderingen af sikkerhedssystemerne.",
        stepContext: "Udarbejd en rapport, der beskriver ændringerne og den nye sikkerhedstilstand.",
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

  // Opgave 7: Installation af Redundant Strømforsyning (4 trin)
  {
    title: "Installation af Redundant Strømforsyning",
    shortDesc: "Sikr netværkets drift med en redundant strømforsyning.",
    narrativeIntro: "En redundant strømforsyning er kritisk for at undgå nedbrud og sikre, at systemerne forbliver online under strømsvigt.",
    focus: "sikkerhed",
    riskProfile: 4,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Vurder behovet for en redundant strømforsyning i netværket.",
        stepContext: "Analyser nuværende strømforsyning og identificer sårbarheder.",
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
        location: "leverandør",
        stepDescription: "Forhandl med en leverandør om installation af den redundante strømforsyning.",
        stepContext: "Få de bedste vilkår og en klar implementeringsplan.",
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
        location: "it‑jura",
        stepDescription: "Sikre, at installationen overholder lovkrav.",
        stepContext: "Gennemgå juridiske retningslinjer for installation af kritisk infrastruktur.",
        choiceA: {
          label: "Omfattende juridisk gennemgang",
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
        stepDescription: "Dokumentér installationen af den redundante strømforsyning.",
        stepContext: "Udarbejd en detaljeret rapport, så installationen kan efterprøves og vedligeholdes.",
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

  // Opgave 8: Opgradering af Kabelføring (5 trin)
  {
    title: "Opgradering af Kabelføring",
    shortDesc: "Moderniser den eksisterende kabelføring for at sikre en stabil infrastruktur.",
    narrativeIntro: "En opgradering af kabelføringen reducerer nedbrud og forbedrer netværkets samlede sikkerhed.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Kortlæg den nuværende kabelføring og identificer kritiske svagheder.",
        stepContext: "Analysér kabler og forbindelser for slid og ineffektivitet.",
        choiceA: {
          label: "Omfattende kortlægning",
          text: "+3 sikkerhed, −2 tid",
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
        location: "dokumentation",
        stepDescription: "Udarbejd en rapport om den nuværende kabelføring.",
        stepContext: "Dokumentér de identificerede svagheder og mulige forbedringer.",
        choiceA: {
          label: "Detaljeret rapport",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Kort rapport",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandl med leverandører om opgradering af kabelføringen.",
        stepContext: "Få en løsning, der forbedrer både hastighed og sikkerhed.",
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
        location: "cybersikkerhed",
        stepDescription: "Evaluer, om den nye kabelføring understøtter netværkssikkerheden.",
        stepContext: "Sikre, at opgraderingen øger beskyttelsen mod cyberangreb.",
        choiceA: {
          label: "Detaljeret sikkerhedsvurdering",
          text: "+2 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Basis sikkerhedsvurdering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér opgraderingen af kabelføringen.",
        stepContext: "Lav en komplet dokumentation, så fremtidige vedligeholdelser kan udføres nemt.",
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

  // Opgave 9: Opgradering af Netværksinfrastruktur (5 trin)
  {
    title: "Opgradering af Netværksinfrastruktur",
    shortDesc: "Moderniser netværkets infrastruktur for at øge robustheden og sikkerheden.",
    narrativeIntro: "En opgradering af netværksinfrastrukturen er nødvendig for at imødekomme fremtidens krav og minimere driftsforstyrrelser.",
    focus: "sikkerhed",
    riskProfile: 5,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Analyser den nuværende netværksinfrastruktur for svagheder.",
        stepContext: "Kortlæg flaskehalse og ældre komponenter, der skal udskiftes.",
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
        stepDescription: "Forhandl med leverandører om opgradering af netværkskomponenter.",
        stepContext: "Samarbejde med eksterne partnere er nødvendigt for en effektiv opgradering.",
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
        location: "it‑jura",
        stepDescription: "Gennemgå juridiske krav og kontrakter for opgraderingen.",
        stepContext: "Sikre, at opgraderingen lever op til alle lovkrav.",
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
        location: "cybersikkerhed",
        stepDescription: "Evaluer sikkerheden i den opgraderede infrastruktur.",
        stepContext: "Test systemets modstandsdygtighed mod cybertrusler.",
        choiceA: {
          label: "Detaljeret sikkerhedsevaluering",
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
        location: "dokumentation",
        stepDescription: "Dokumentér opgraderingen af netværksinfrastrukturen.",
        stepContext: "Udarbejd en komplet dokumentation, der beskriver alle ændringer.",
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

  // Opgave 10: Total Digital Transformation af Infrastruktur (6 trin)
  {
    title: "Total Digital Transformation af Infrastruktur",
    shortDesc: "Gennemfør en omfattende digital omstilling af hospitalets infrastruktur.",
    narrativeIntro: "Denne opgave involverer en total omstilling, der integrerer nye teknologier, eksterne samarbejder og omfattende opgraderinger på tværs af systemer.",
    focus: "sikkerhed",
    riskProfile: 6,
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Foretag en overordnet evaluering af hele netværksinfrastrukturen.",
        stepContext: "Identificer kritiske svagheder og behov for modernisering.",
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
        stepDescription: "Indgå samarbejde med eksterne eksperter for design af den nye infrastruktur.",
        stepContext: "For at implementere de nyeste teknologier er et eksternt samarbejde nødvendigt.",
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
        stepDescription: "Planlæg og implementer omfattende tekniske opgraderinger på tværs af systemerne.",
        stepContext: "Sørg for en fuldstændig integration af nye teknologier i den eksisterende infrastruktur.",
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
        stepDescription: "Gennemgå alle juridiske krav for transformationen.",
        stepContext: "Sikre at alle nye systemer overholder gældende lovgivning og standarder.",
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
        stepDescription: "Evaluer og opgrader de eksisterende sikkerhedssystemer.",
        stepContext: "For at beskytte mod cybertrusler skal systemerne moderniseres.",
        choiceA: {
          label: "Detaljeret sikkerhedsopgradering",
          text: "+3 sikkerhed, −2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Basis sikkerhedsopgradering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en omfattende dokumentation af hele transformationen.",
        stepContext: "Dokumentationen skal dække alle aspekter – teknisk, juridisk og operationel.",
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
