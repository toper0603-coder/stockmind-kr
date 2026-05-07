export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, appkey, appsecret, tr_id');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path, mode, ...params } = req.query;
  const base = mode === 'real'
    ? 'https://openapi.koreainvestment.com:9443'
    : 'https://openapivts.koreainvestment.com:29443';

  const headers = {
    'Content-Type': 'application/json',
    'authorization': req.headers['authorization'] || '',
    'appkey': req.headers['appkey'] || '',
    'appsecret': req.headers['appsecret'] || '',
    'tr_id': req.headers['tr_id'] || '',
  };

  try {
    let url = `${base}/${path}`;
    let options = { method: req.method, headers };

    if (req.method === 'GET') {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += '?' + qs;
    } else {
      options.body = JSON.stringify(req.body);
    }

    const r = await fetch(url, options);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
