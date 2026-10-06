// What the scene remembers from page to page within one visit: how far the sky
// has turned to day, where the cow stood, which hills grew. It lives in the
// tab's session, so a new visit starts again in daylight. The same record
// is read in Base.astro, before the first paint.
const KEY = 'scene';
const keepers = [];

export function recall() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? {};
  } catch {
    return {};                    // storage is blocked or the record is damaged: start fresh
  }
}

// register what to save when the page is left; `snapshot` returns the fields to store
export function keep(snapshot) {
  keepers.push(snapshot);
}

addEventListener('pagehide', () => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(Object.assign(recall(), ...keepers.map(snapshot => snapshot()))));
  } catch {}
});
