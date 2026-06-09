let gamesList = [];
let sortCol = 'name';
let sortDir = 'asc';

async function loadGames() {
  const status = document.getElementById('status');
  status.textContent = 'Loading your library…';

  const res = await fetch('/api/games');
  if (!res.ok) {
    status.textContent = 'Failed to load games. Check your credentials.';
    return;
  }

  gamesList = await res.json();
  status.textContent = `${gamesList.length} games loaded.`;
  populate();
}

function setSort(col) {
  if (sortCol === col) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortCol = col;
    sortDir = col === 'playtime' ? 'desc' : 'asc';
  }
  document.getElementById('nameArrow').textContent = sortCol === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : '↕';
  document.getElementById('sortArrow').textContent = sortCol === 'playtime' ? (sortDir === 'asc' ? '↑' : '↓') : '↕';
  populate();
}

function populate() {
  const sorted = [...gamesList];
  if (sortCol === 'playtime') {
    const dir = sortDir === 'desc' ? -1 : 1;
    sorted.sort((a, b) => dir * ((parseFloat(a.hours) || 0) - (parseFloat(b.hours) || 0)));
  } else {
    const dir = sortDir === 'desc' ? -1 : 1;
    sorted.sort((a, b) => dir * a.name.localeCompare(b.name));
  }

  const table = document.getElementById('gameTable');
  while (table.rows.length > 1) table.deleteRow(1);

  for (const game of sorted) {
    const row = table.insertRow();
    row.insertCell(0).textContent = game.name;
    row.insertCell(1).textContent = game.hours !== null ? `${game.hours}h` : 'Not played';
    row.insertCell(2).innerHTML = `<img src="${game.logo}" alt="${game.name}">`;
  }
}

function pickMeOne() {
  const unplayed = gamesList.filter(g => g.hours === null);
  if (unplayed.length === 0) {
    document.getElementById('randombox').textContent = 'You\'ve played everything!';
    return;
  }
  const pick = unplayed[Math.floor(Math.random() * unplayed.length)];
  document.getElementById('randombox').textContent = pick.name;
}

document.addEventListener('DOMContentLoaded', loadGames);