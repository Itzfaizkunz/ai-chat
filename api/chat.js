import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Header CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Cek status via GET di browser
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'API Chat Gemini Aktif' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Gunakan method POST' });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY belum dipasang di Vercel Environment Variables' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(message);
    const text = result.response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    return res.status(500).json({ error: 'Gagal memproses AI', details: error.message });
  }
}