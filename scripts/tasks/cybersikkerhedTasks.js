// scripts/tasks/cybersikkerhedTasks.js
window.cybersikkerhedTasks = [
  {
    title: "Styrk netværkssikkerhed",
    shortDesc: "Implementér avancerede sikkerhedsprotokoller for at beskytte netværket.",
    narrativeIntro: "Forbedring af netværkssikkerheden reducerer risikoen for databrud og cyberangreb.",
    riskProfile: 4,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Gennemfør en sårbarhedsvurdering af netværket.",
        stepContext: "Identificér potentielle svagheder i netværksinfrastrukturen ved hjælp af avancerede værktøjer.",
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
        location: "infrastruktur",
        stepDescription: "Opgrader firewall- og IDS-systemer.",
        stepContext: "En opgradering sikrer bedre overvågning og afvisning af uautoriseret trafik.",
        choiceA: { 
          label: "Omfattende opgradering", 
          text: "+3 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 3 } } 
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
        stepDescription: "Opdater netværkssikkerhedspolitikker.",
        stepContext: "Sørg for, at alle medarbejdere er opdateret med de nye sikkerhedspolitikker og procedurer.",
        choiceA: { 
          label: "Detaljeret opdatering", 
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
      }
    ]
  },
  {
    title: "Sikkerhedsopdatering af software",
    shortDesc: "Installer de seneste sikkerhedsopdateringer på alle systemer.",
    narrativeIntro: "Regelmæssige opdateringer forhindrer udnyttelse af kendte sårbarheder og øger systemets robusthed.",
    riskProfile: 3,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Identificér kritiske opdateringer for centrale systemer.",
        stepContext: "Sørg for, at alle opdateringer er kompatible med den eksisterende infrastruktur.",
        choiceA: { 
          label: "Detaljeret gennemgang", 
          text: "+3 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 3 } } 
        },
        choiceB: { 
          label: "Hurtig scanning", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Implementer opdateringerne og test systemets stabilitet.",
        stepContext: "Test er afgørende for at sikre, at opdateringer ikke forstyrrer driften.",
        choiceA: { 
          label: "Omfattende test", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Kort test", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér opdateringsprocessen og resultaterne.",
        stepContext: "En klar dokumentation sikrer, at processen kan gentages korrekt i fremtiden.",
        choiceA: { 
          label: "Detaljeret dokumentation", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Sammenfattet dokumentation", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      }
    ]
  },
  {
    title: "Phishing Awareness Kampagne",
    shortDesc: "Gennemfør en kampagne for at øge medarbejdernes opmærksomhed på phishing.",
    narrativeIntro: "Øget medarbejderbevidsthed kan betydeligt reducere risikoen for phishing-angreb.",
    riskProfile: 2,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "dokumentation",
        stepDescription: "Udarbejd informationsmateriale om phishing-teknikker.",
        stepContext: "Materialet skal forklare, hvad phishing er, og hvordan man genkender mistænkelige e-mails.",
        choiceA: { 
          label: "Detaljeret materiale", 
          text: "+3 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 3 } } 
        },
        choiceB: { 
          label: "Kort info", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        title: "Phishing Awareness Kampagne", // Duplicate title? No, we don't duplicate title here. I'll not duplicate.
        location: "hospital",
        stepDescription: "Afhold en træningssession for medarbejderne.",
        stepContext: "Interaktiv træning øger bevidstheden om phishing-angreb.",
        choiceA: { 
          label: "Interaktiv session", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Kort præsentation", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "cybersikkerhed",
        stepDescription: "Evaluer kampagnens effekt.",
        stepContext: "Mål ændringer i medarbejdernes respons på phishing-forsøg.",
        choiceA: { 
          label: "Detaljeret evaluering", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Hurtig evaluering", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      }
    ]
  },
  {
    title: "Implementering af to-faktor autentifikation",
    shortDesc: "Sikr systemadgangen med to-faktor autentifikation.",
    narrativeIntro: "To-faktor autentifikation reducerer markant risikoen for uautoriseret adgang.",
    riskProfile: 3,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Vurder eksisterende adgangskontroller og identificer svagheder.",
        stepContext: "En grundig vurdering er nødvendig for at bestemme, hvor to-faktor kan implementeres.",
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
        location: "infrastruktur",
        stepDescription: "Integrer to-faktor løsningen med eksisterende systemer.",
        stepContext: "Sørg for en glidende integration, så systemdriften ikke forstyrres.",
        choiceA: { 
          label: "Omfattende integration", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Standard integration", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater adgangspolitikker med de nye procedurer.",
        stepContext: "Retningslinjerne skal tydeligt beskrive den nye to-faktor autentifikation.",
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
  {
    title: "Sikkerhedstræning for ansatte",
    shortDesc: "Afhold obligatorisk sikkerhedstræning for alle ansatte.",
    narrativeIntro: "Regelmæssig træning øger medarbejdernes bevidsthed om cybersikkerhed og mindsker risikoen for fejl.",
    riskProfile: 2,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Udarbejd en træningsplan med fokus på aktuelle cybertrusler.",
        stepContext: "Træningsplanen skal dække de mest relevante trusler og bedste praksis.",
        choiceA: { 
          label: "Detaljeret plan", 
          text: "+3 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 3 } } 
        },
        choiceB: { 
          label: "Grundlæggende plan", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "hospital",
        stepDescription: "Afhold en interaktiv træningssession.",
        stepContext: "Interaktiv træning sikrer bedre forståelse af sikkerhedsprotokoller.",
        choiceA: { 
          label: "Omfattende session", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Kort session", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Opdater medarbejdermanualen med de nye sikkerhedsprocedurer.",
        stepContext: "Manualen skal afspejle den seneste sikkerhedstræning og procedurer.",
        choiceA: { 
          label: "Detaljeret manual", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Sammenfattet manual", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      }
    ]
  },
  {
    title: "Incident Response Plan",
    shortDesc: "Udarbejd en plan for håndtering af cyberangreb.",
    narrativeIntro: "En effektiv incident response plan minimerer skader og forbedrer genopretningstiden ved et angreb.",
    riskProfile: 3,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Kortlæg potentielle trusler og risikofaktorer.",
        stepContext: "En detaljeret analyse af trusselsbilledet er nødvendig for effektiv respons.",
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
        location: "it‑jura",
        stepDescription: "Udarbejd juridiske retningslinjer for incident response.",
        stepContext: "Retningslinjerne skal beskytte organisationen mod juridiske konsekvenser.",
        choiceA: { 
          label: "Omfattende retningslinjer", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Standard retningslinjer", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Træn medarbejderne i incident response procedurer.",
        stepContext: "Effektiv træning sikrer hurtig og præcis håndtering af angreb.",
        choiceA: { 
          label: "Detaljeret træning", 
          text: "+3 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 3 } } 
        },
        choiceB: { 
          label: "Kort træning", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      }
    ]
  },
  {
    title: "Sikkerhedsmonitorering med SIEM",
    shortDesc: "Implementér et SIEM-system for at overvåge sikkerhedshændelser.",
    narrativeIntro: "Et SIEM-system giver centraliseret logning og realtidsanalyse, der muliggør hurtig respons ved sikkerhedshændelser.",
    riskProfile: 4,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Evaluér de nuværende logningssystemer for mangler.",
        stepContext: "Identificér, hvilke systemer der har behov for opgradering for bedre overvågning.",
        choiceA: { 
          label: "Detaljeret evaluering", 
          text: "+3 sikkerhed, -2 tid", 
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
        location: "infrastruktur",
        stepDescription: "Integrer SIEM med eksisterende systemer.",
        stepContext: "Sørg for, at alle relevante data bliver sendt til SIEM-systemet for central analyse.",
        choiceA: { 
          label: "Omfattende integration", 
          text: "+2 sikkerhed, -2 tid", 
          recommended: true, 
          applyEffect: { timeCost: 2, statChange: { security: 2 } } 
        },
        choiceB: { 
          label: "Standard integration", 
          text: "+1 sikkerhed, 0 tid", 
          recommended: false, 
          applyEffect: { timeCost: 0, statChange: { security: 1 } } 
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér SIEM-implementeringen og hændelsesprocedurerne.",
        stepContext: "En klar dokumentation er afgørende for at kunne håndtere fremtidige sikkerhedshændelser.",
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
  }
];
