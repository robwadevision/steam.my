export default async function handler(req, res) {
  const { STEAM_API_KEY, STEAM_ID } = process.env;

  if (!STEAM_API_KEY || !STEAM_ID) {
    return res.status(500).json({ error: 'Missing Steam credentials' });
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&include_appinfo=true&include_played_free_games=true&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    return res.status(502).json({ error: 'Steam API request failed', status: response.status });
  }

  const data = await response.json();
  const games = (data.response?.games ?? []).map(g => ({
    appid: g.appid,
    name: g.name,
    logo: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/capsule_184x69.jpg`,
    hours: g.playtime_forever > 0 ? (g.playtime_forever / 60).toFixed(1) : null,
    last_played: g.rtime_last_played ?? null,
  }));

  games.sort((a, b) => a.name.localeCompare(b.name));

  res.setHeader('Cache-Control', 's-maxage=300');
  res.status(200).json(games);
}