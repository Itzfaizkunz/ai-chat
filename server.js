import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Endpoint utama
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Gagal memproses pesan AI' });
  }
});

// Endpoint default untuk mengecek apakah server aktif
app.get('/', (req, res) => {
  res.send('Backend AI Chat Vercel berjalan!');
});

// PENTING UNTUK VERCEL: Ekspor app Express sebagai default
export default app;