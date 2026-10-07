// "Samuel Calvert" in glass. The styles size the letters, place them and bring
// them up with the day; the only thing they cannot reach is the SVG filter, so
// the soft inner glow and shade are scaled to the letter size here.
const box = document.getElementById('name');

function fit() {
  const size = parseFloat(getComputedStyle(box).fontSize);
  document.getElementById('edge-glow-shift').setAttribute('dy', (size * 0.09).toFixed(2));
  document.getElementById('edge-glow-soft').setAttribute('stdDeviation', (size * 0.05).toFixed(2));
  document.getElementById('edge-shade-shift').setAttribute('dy', (-size * 0.08).toFixed(2));
  document.getElementById('edge-shade-soft').setAttribute('stdDeviation', (size * 0.05).toFixed(2));
  box.style.visibility = 'visible';                           // kept hidden until the filter fits the letters
}

addEventListener('resize', fit);
fit();
