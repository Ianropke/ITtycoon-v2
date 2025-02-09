// scripts/utils.js
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getIcon(location) {
  const icons = {
    'hospital': '🏥',
    'dokumentation': '📄',
    'leverandør': '📦',
    'infrastruktur': '🔧',
    'it‑jura': '⚖️',
    'cybersikkerhed': '💻'
  };
  return icons[location.toLowerCase()] || '';
}
