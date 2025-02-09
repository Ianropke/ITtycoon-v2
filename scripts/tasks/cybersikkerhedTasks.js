window.cybersikkerhedTasks = [
  // 1) Styrk netværkssikkerhed
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

  // 2) Sikkerhedsopdatering af software
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

  // 3) Phishing Awareness Kampagne
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

  // 4) Implementering af to-faktor autentifikation
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

  // 5) Sikkerhedstræning for ansatte
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
        stepDescription: "Afhold en interaktiv træningssession for medarbejderne.",
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

  // 6) Incident Response Plan
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

  // 7) Sikkerhedsmonitorering med SIEM
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
  },

  // 8) Overvågning af eksterne trusler (NY)
  {
    title: "Overvågning af eksterne trusler",
    shortDesc: "Etabler løbende monitorering af eksterne cybertrusler.",
    narrativeIntro: "Ved at holde øje med eksterne trusselsfeeds og dark web, kan man proaktivt imødegå kommende angreb.",
    riskProfile: 3,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Opsæt kontinuerlige trusselsscanninger mod eksterne kilder.",
        stepContext: "Brug specialiserede værktøjer, som automatisk alarmerer ved nye sårbarheder.",
        choiceA: {
          label: "Avanceret scanning",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Basis scanning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "leverandør",
        stepDescription: "Samarbejd med eksterne partnere om trusselsdata.",
        stepContext: "Deling af trusselsinformation giver et mere komplet billede af aktuelle angrebsmønstre.",
        choiceA: {
          label: "Tæt partnerintegration",
          text: "+2 sikkerhed, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Almindeligt datasamarbejde",
          text: "+1 sikkerhed, 0 tid",
          recommended: true,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Dokumentér processen for ekstern trusselsovervågning.",
        stepContext: "En fast procedure sikrer, at nye angrebsmønstre hurtigt kan integreres i systemet.",
        choiceA: {
          label: "Omfattende procedurebeskrivelse",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Korte retningslinjer",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // 9) Penetrationstest
  {
    title: "Penetrationstest",
    shortDesc: "Gennemfør en dybdegående penetrationstest for at afsløre sårbarheder.",
    narrativeIntro: "En penetrationstest simulerer et rigtigt angreb og hjælper med at afdække kritiske huller i sikkerheden.",
    riskProfile: 4,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Planlæg og forbered testscenarier.",
        stepContext: "Vælg relevante testmetoder (sort boks, hvid boks, etc.), og afklar omfanget.",
        choiceA: {
          label: "Grundig planlægning",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Simpel planlægning",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Gennemfør penetrationstesten på kritiske systemer.",
        stepContext: "Test bør foretages uden at forstyrre driften væsentligt.",
        choiceA: {
          label: "Fuldt testforløb",
          text: "+2 sikkerhed, -2 tid",
          recommended: false,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Kort testforløb",
          text: "+1 sikkerhed, 0 tid",
          recommended: true,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Rapportér fundne sårbarheder og løsninger.",
        stepContext: "Rapporten skal prioriteres efter alvorlighed, så de mest kritiske sårbarheder lukkes først.",
        choiceA: {
          label: "Udførlig rapport",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Overordnet rapport",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  },

  // 10) Zero Trust Arkitektur
  {
    title: "Zero Trust Arkitektur",
    shortDesc: "Implementér en Zero Trust-model, hvor intet netværkselement stoles på per default.",
    narrativeIntro: "Zero Trust sikrer, at alle brugere og enheder valideres løbende, hvilket minimerer skadens omfang ved et brud.",
    riskProfile: 4,
    focus: "cybersikkerhed",
    steps: [
      {
        location: "cybersikkerhed",
        stepDescription: "Design en overordnet Zero Trust-strategi.",
        stepContext: "Vurder, hvordan eksisterende sikkerhedsforanstaltninger skal tilpasses en streng Zero Trust-model.",
        choiceA: {
          label: "Dybtgående strategi",
          text: "+3 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 3 } }
        },
        choiceB: {
          label: "Overordnet strategi",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "infrastruktur",
        stepDescription: "Segmentér netværket og indfør mikrosegmentering.",
        stepContext: "Hvert netværkselement skal isoleres, så et angreb ikke kan brede sig.",
        choiceA: {
          label: "Omfattende mikrosegmentering",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Delvis segmentering",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      },
      {
        location: "dokumentation",
        stepDescription: "Fastsæt stramme adgangsregler og opdater alle brugere.",
        stepContext: "Brugerne skal forstå, at de kun har adgang til netop det, de har brug for – og ikke mere.",
        choiceA: {
          label: "Detaljeret adgangsregler",
          text: "+2 sikkerhed, -2 tid",
          recommended: true,
          applyEffect: { timeCost: 2, statChange: { security: 2 } }
        },
        choiceB: {
          label: "Delvist stramme adgangsregler",
          text: "+1 sikkerhed, 0 tid",
          recommended: false,
          applyEffect: { timeCost: 0, statChange: { security: 1 } }
        }
      }
    ]
  }
];
