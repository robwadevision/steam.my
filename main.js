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
  populateLetterFilter();
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

function populateLetterFilter() {
  const unplayed = gamesList.filter(g => g.hours === null);
  const letters = [...new Set(
    unplayed.map(g => {
      const first = g.name[0]?.toUpperCase();
      return /[A-Z]/.test(first) ? first : '#';
    })
  )].sort();

  const select = document.getElementById('letterFilter');
  // Remove old letter options (keep "Any" and "#")
  [...select.options].forEach(o => { if (o.value.length === 1 && /[A-Z]/.test(o.value)) o.remove(); });

  letters.filter(l => l !== '#').forEach(letter => {
    const opt = document.createElement('option');
    opt.value = letter;
    opt.textContent = letter;
    select.appendChild(opt);
  });
}

function pickFrom(pool, emptyMessage) {
  const letter = document.getElementById('letterFilter').value;

  if (letter === '#') {
    pool = pool.filter(g => !/^[A-Za-z]/.test(g.name));
  } else if (letter) {
    pool = pool.filter(g => g.name.toUpperCase().startsWith(letter));
  }

  document.getElementById('randombox').textContent = pool.length === 0
    ? emptyMessage
    : pool[Math.floor(Math.random() * pool.length)].name;
}

function pickRandom() {
  const letter = document.getElementById('letterFilter').value;
  const noGamesMsg = letter ? `No games starting with "${letter}".` : 'No games in your library.';
  pickFrom([...gamesList], noGamesMsg);
}

function pickUnplayed() {
  const letter = document.getElementById('letterFilter').value;
  const noGamesMsg = letter ? `No unplayed games starting with "${letter}".` : 'You\'ve played everything!';
  pickFrom(gamesList.filter(g => g.hours === null), noGamesMsg);
}

document.addEventListener('DOMContentLoaded', loadGames);