window.hospitalTasks = [
  // 1) Nyt LIMS (3 trin)
  {
    title: "Nyt LIMS",
    shortDesc: "Implementér et nyt LIMS-system for at modernisere patientdatahåndtering.",
    narrativeIntro: "Et nyt LIMS-system vil forbedre workflowet, reducere fejl og sikre bedre datakvalitet på hospitalet.",
    riskProfile: 3,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser den nuværende patientjournal for at identificere ineffektive processer.",
        stepContext: "Gennemgå patientjournalerne for at finde fejl og ineffektivitet.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk evaluering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandle med leverandøren om integrationen af det nye system.",
        stepContext: "En god forhandling sikrer en problemfri integration med eksisterende IT-løsninger.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Hurtig aftale",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater systemdokumentationen med de fundne forbedringspunkter.",
        stepContext: "Dokumentationen skal revideres grundigt for at reflektere de nye processer.",
        choiceA: {
          label: "Omfattende opdatering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Kort opdatering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 2) Opgradering af EHR (3 trin)
  {
    title: "Opgradering af EHR",
    shortDesc: "Modernisér det elektroniske patientjournalssystem.",
    narrativeIntro: "Opgradering af EHR-systemet forbedrer datasikkerhed og tilgængelighed for sundhedspersonale.",
    riskProfile: 2,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Vurder det nuværende EHR-system og identificer forbedringsmuligheder.",
        stepContext: "En grundig evaluering sikrer, at den nye løsning dækker alle behov.",
        choiceA: {
          label: "Detaljeret evaluering",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk evaluering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Sikre, at opgraderingen overholder gældende IT-reguleringer.",
        stepContext: "Juridiske aspekter skal tages i betragtning for at undgå fremtidige problemer.",
        choiceA: {
          label: "Grundig juridisk gennemgang",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Minimal gennemgang",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Revider systemets dokumentation for at reflektere nye standarder.",
        stepContext: "Dokumentationen skal opdateres, så den afspejler de nyeste krav og procedurer.",
        choiceA: {
          label: "Omfattende opdatering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Kort opdatering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 3) Implementering af telemedicin (4 trin)
  {
    title: "Implementering af telemedicin",
    shortDesc: "Integrér telemedicinløsninger for at udvide patientplejen.",
    narrativeIntro: "Telemedicin øger tilgængeligheden af sundhedsydelser og gør behandlinger mere effektive.",
    riskProfile: 3,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Identificér nøgleområder, hvor telemedicin kan erstatte fysiske konsultationer.",
        stepContext: "Analyser patientdata for at afgøre, hvor telemedicin har størst effekt.",
        choiceA: {
          label: "Omfattende analyse",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Rask evaluering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Opgradér den eksisterende IT-infrastruktur for at understøtte telemedicin.",
        stepContext: "En stabil infrastruktur er essentiel for pålidelig videokommunikation og dataoverførsel.",
        choiceA: {
          label: "Omfattende opgradering",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Mindre opgradering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Implementér sikkerhedsforanstaltninger til telemedicin-løsningen.",
        stepContext: "Beskyt patientdata under videokonsultationer og fjernovervågning.",
        choiceA: {
          label: "Avanceret sikkerhed",
          text: "+2 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis sikkerhed",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd retningslinjer for brug af telemedicin.",
        stepContext: "Sikre, at alle sundhedspersonale kender procedurerne for telemedicin.",
        choiceA: {
          label: "Detaljeret retningslinje",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Kortfattet retningslinje",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 4) Optimering af patientflow (4 trin)
  {
    title: "Optimering af patientflow",
    shortDesc: "Forbedr processerne for at reducere ventetider og øge effektiviteten.",
    narrativeIntro: "Effektivt patientflow minimerer ventetider og forbedrer patienttilfredsheden.",
    riskProfile: 2,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Kortlæg den nuværende patientstrøm og identificer flaskehalse.",
        stepContext: "Analyser data for at finde de mest belastede områder i hospitalet.",
        choiceA: {
          label: "Detaljeret kortlægning",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk kortlægning",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Opgrader IT-systemerne til bedre at spore patientbevægelser.",
        stepContext: "Bedre IT-løsninger letter registreringen af patientdata og bevægelser.",
        choiceA: {
          label: "Omfattende opgradering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Enkel opgradering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Involver eksterne konsulenter til at forbedre patientflow-design.",
        stepContext: "Eksperter kan hjælpe med at optimere layout, logistik og planlægning.",
        choiceA: {
          label: "Fuldt samarbejde",
          text: "+2 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Kort samarbejde",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater procedurerne for patientflow i den officielle dokumentation.",
        stepContext: "Retningslinjer skal afspejle de nye processer og sikre overholdelse.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 5) Digitalisering af recepter (3 trin)
  {
    title: "Digitalisering af recepter",
    shortDesc: "Implementér et system til digital håndtering af recepter.",
    narrativeIntro: "Digitalisering af recepter øger sikkerheden og reducerer fejl i udleveringen.",
    riskProfile: 2,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser de nuværende processer for receptudskrivning.",
        stepContext: "Identificér, hvor digitalisering kan reducere fejl og spildt tid.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Rask evaluering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Implementér et digitalt system for receptudstedelse.",
        stepContext: "Systemet skal integreres med eksisterende løsninger for at sikre effektivitet.",
        choiceA: {
          label: "Omfattende implementering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Standard implementering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Sikre overholdelse af lovgivning og dokumentér receptprocessen.",
        stepContext: "En juridisk gennemgang og ajourført dokumentation minimerer fremtidige tvister.",
        choiceA: {
          label: "Detaljeret review",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Hurtigt review",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 6) Forbedring af laboratoriedata (3 trin)
  {
    title: "Forbedring af laboratoriedata",
    shortDesc: "Opgrader laboratorieinformationssystemet for bedre datahåndtering.",
    narrativeIntro: "Et optimeret laboratorieinformationssystem sikrer hurtigere og mere nøjagtig dataudveksling.",
    riskProfile: 3,
    focus: "udvikling",
    steps: [
      {
        location: "infrastruktur",
        stepDescription: "Evaluér det nuværende system for laboratoriedata.",
        stepContext: "Identificér flaskehalse og fejl i dataindsamlingen.",
        choiceA: {
          label: "Detaljeret evaluering",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk evaluering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "hospital",
        stepDescription: "Test og valider det opgraderede system i praksis.",
        stepContext: "Udfør tests, så systemet fungerer optimalt, før det implementeres fuldt.",
        choiceA: {
          label: "Omfattende test",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Standard test",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater standardprocedurerne for dataindsamling og -rapportering.",
        stepContext: "Nøjagtig dokumentation er nøglen til at sikre datakvaliteten.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 7) Integration af wearable enheder (4 trin)
  {
    title: "Integration af wearable enheder",
    shortDesc: "Integrér wearable enheder for at monitorere patienters vitale data.",
    narrativeIntro: "Wearables kan levere kontinuerlig data om patientens tilstand og forbedre forebyggelse og behandling.",
    riskProfile: 3,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Vurder potentialet for wearable integration i patientovervågning.",
        stepContext: "Undersøg hvordan wearables kan forbedre plejen og identificér relevante parametre.",
        choiceA: {
          label: "Detaljeret vurdering",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Hurtig vurdering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Opgradér netværket for at understøtte dataoverførsel fra wearables.",
        stepContext: "Et stabilt netværk er essentielt for at modtage og behandle data i realtid.",
        choiceA: {
          label: "Omfattende opgradering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Standard opgradering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Implementér sikkerhedsforanstaltninger for wearable-data.",
        stepContext: "Data fra wearables skal krypteres og sikres mod uautoriseret adgang.",
        choiceA: {
          label: "Avanceret datasikkerhed",
          text: "+2 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis datasikkerhed",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd retningslinjer for anvendelse af wearables.",
        stepContext: "Retningslinjer sikrer korrekt og sikker håndtering af patientdata.",
        choiceA: {
          label: "Detaljeret retningslinje",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort retningslinje",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 8) Automatisering af journalføring (3 trin)
  {
    title: "Automatisering af journalføring",
    shortDesc: "Automatisér dataindtastning i patientjournaler.",
    narrativeIntro: "Automatisering kan reducere manuelle fejl og frigive tid for sundhedspersonale.",
    riskProfile: 2,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Analyser nuværende manuelle processer i journalføring.",
        stepContext: "Find de områder, hvor automatisering kan spare tid og minimere fejl.",
        choiceA: {
          label: "Detaljeret analyse",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Rask evaluering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Implementér et automatiseringsværktøj til journalføring.",
        stepContext: "Værktøjet skal integreres med eksisterende systemer uden afbrydelser.",
        choiceA: {
          label: "Omfattende implementering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Standard implementering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Test systemet i klinisk drift og opdater procedurerne.",
        stepContext: "Sørg for, at alt er veldokumenteret og personalet er informeret.",
        choiceA: {
          label: "Omfattende test og dokumentation",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort test og dokumentation",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 9) Forbedring af patientkommunikation (5 trin)
  {
    title: "Forbedring af patientkommunikation",
    shortDesc: "Implementér digitale løsninger til effektiv kommunikation med patienter.",
    narrativeIntro: "Digitale kommunikationsværktøjer kan øge patienttilfredsheden og forbedre behandlingsresultater.",
    riskProfile: 2,
    focus: "udvikling",
    steps: [
      {
        location: "dokumentation",
        stepDescription: "Kortlæg nuværende kommunikationskanaler og identificér mangler.",
        stepContext: "En analyse af kommunikationen vil vise, hvor forbedringer er mulige.",
        choiceA: {
          label: "Detaljeret kortlægning",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk kortlægning",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Sikre, at de nye kommunikationsløsninger opfylder lovkravene.",
        stepContext: "Juridisk compliance er afgørende for at beskytte patientdata.",
        choiceA: {
          label: "Omfattende review",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Hurtigt review",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "hospital",
        stepDescription: "Implementér og test det nye kommunikationssystem.",
        stepContext: "Systemet skal testes i en klinisk kontekst for at sikre effektiv forbedring.",
        choiceA: {
          label: "Omfattende implementering",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Standard implementering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Indfør feedback-mekanismer, så patienter kan vurdere kommunikationen.",
        stepContext: "Feedback hjælper med løbende at justere og forbedre løsningen.",
        choiceA: {
          label: "Avanceret feedbacksystem",
          text: "+2 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Enkel feedback",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater vejledninger med den nye kommunikationsløsning.",
        stepContext: "Sikre, at personalet har klare procedurer og vejledninger.",
        choiceA: {
          label: "Omfattende dokumentation",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort dokumentation",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  },

  // 10) Implementering af AI-diagnoseværktøj (6 trin)
  {
    title: "Implementering af AI-diagnoseværktøj",
    shortDesc: "Integrér AI til at assistere læger i diagnosticering.",
    narrativeIntro: "Et AI-diagnoseværktøj kan hjælpe med at identificere sygdomme hurtigere og mere præcist.",
    riskProfile: 4,
    focus: "udvikling",
    steps: [
      {
        location: "hospital",
        stepDescription: "Identificér relevante kliniske data til AI-analysen.",
        stepContext: "Dataindsamling er kritisk for at træne AI-modellen korrekt.",
        choiceA: {
          label: "Detaljeret dataindsamling",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Overfladisk dataindsamling",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Opgrader IT-systemerne for at understøtte AI-analyse.",
        stepContext: "En robust infrastruktur er nødvendig for at køre AI-algoritmer effektivt.",
        choiceA: {
          label: "Omfattende opgradering",
          text: "+2 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Standard opgradering",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Sørg for sikker datahåndtering i forbindelse med AI-træning.",
        stepContext: "Beskyt data mod uautoriseret adgang under træning og modeludvikling.",
        choiceA: {
          label: "Avanceret datasikkerhed",
          text: "+2 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Basis datasikkerhed",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Forhandle med AI-leverandør om licenser og support.",
        stepContext: "Sikre gode betingelser for løbende vedligehold og opdatering af AI-modellen.",
        choiceA: {
          label: "Detaljeret forhandling",
          text: "+3 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Hurtig forhandling",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "it‑jura",
        stepDescription: "Sikre juridisk compliance for AI-diagnoser og databehandling.",
        stepContext: "Overhold databeskyttelsesregler og patientsamtykke i forbindelse med AI.",
        choiceA: {
          label: "Grundig juridisk review",
          text: "+2 udvikling, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { development: 2 } }
        },
        choiceB: {
          label: "Overfladisk review",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Udarbejd en manual til brug af AI-diagnoseværktøjet.",
        stepContext: "Brugervejledningen skal sikre, at lægerne kan anvende værktøjet korrekt og effektivt.",
        choiceA: {
          label: "Omfattende manual",
          text: "+3 udvikling, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { development: 3 } }
        },
        choiceB: {
          label: "Kort manual",
          text: "+1 udvikling, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { development: 1 } }
        }
      }
    ]
  }
];
