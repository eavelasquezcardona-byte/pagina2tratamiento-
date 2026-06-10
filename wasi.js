export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { endpoint, ...params } = req.query;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint' });
    }

    // Build Wasi URL with credentials
    const wasiParams = new URLSearchParams({
      id_company: '12948124',
      wasi_token: '4tlO_kur5_zXG7_EQ1C',
      ...params,
    });

    const wasiUrl = `https://api.wasi.co/v1/${endpoint}?${wasiParams.toString()}`;

    const response = await fetch(wasiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Wasi API error', status: response.status });
    }

    const data = await response.json();
    
    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error('Wasi proxy error:', error);
    return res.status(500).json({ error: 'Proxy error', message: error.message });
  }
}
