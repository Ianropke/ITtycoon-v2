// scripts/events.js
export function checkForEvents(gameState) {
  const totalChoices = (gameState.totalSecurityChoices || 0) + (gameState.totalDevelopmentChoices || 0);
  let eventOccurred = false;
  let eventMessage = "";
  if (totalChoices > 0) {
    const ratioDevelopment = (gameState.totalDevelopmentChoices || 0) / totalChoices;
    // Hvis mere end 65% af valg er udviklingsvalg, udløses hackerangreb med 50% sandsynlighed
    if (ratioDevelopment > 0.65) {
      if (Math.random() < 0.5) {
        gameState.time -= 4;
        if (gameState.time < 0) gameState.time = 0;
        eventOccurred = true;
        eventMessage = "Hackerangreb! Du mistede 4 Tid for at håndtere angrebet.";
      }
    }
    // Hvis mindre end 35% af valg er udviklingsvalg, udløses ineffektivitet med 50% sandsynlighed
    else if (ratioDevelopment < 0.35) {
      if (Math.random() < 0.5) {
        gameState.time -= 3;
        if (gameState.time < 0) gameState.time = 0;
        eventOccurred = true;
        eventMessage = "Ineffektive arbejdsgange! Du mistede 3 Tid pga. ineffektivitet.";
      }
    }
  }
  return { eventOccurred, eventMessage };
}
