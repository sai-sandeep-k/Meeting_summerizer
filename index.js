import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY in .env file.");
  process.exit(1);
}

app.post('/api/summarize', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded.' });
  }

  try {
    console.log('Step 1: Transcribing audio with Groq...');
    const transcript = await transcribeAudio(req.file);
    console.log('Transcription successful.');

    console.log('Step 2: Summarizing transcript with Groq...');
    const summary = await summarizeTranscript(transcript);
    console.log('Summary successful.');

    res.json({
      transcript: transcript,
      summary: summary,
    });
  } catch (error) {
    console.error('Error in /api/summarize:', error.message);
    if (error.response) {
      console.error('API Error Data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to process audio.' });
  }
});

async function transcribeAudio(file) {
  const formData = new FormData();
  formData.append('file', file.buffer, file.originalname);
  formData.append('model', 'whisper-large-v3');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );
    return response.data.text;
  } catch (error) {
    console.error('Error during transcription:', error.response ? error.response.data : error.message);
    throw new Error('Groq Whisper API call failed');
  }
}

async function summarizeTranscript(transcript) {
  const systemPrompt = `You are an expert meeting assistant. Analyze the following meeting transcript. Provide a summary of the key decisions made and a list of action items.
Respond *only* with a JSON object in the following format:
{
  "key_decisions": ["Decision 1", "Decision 2", "..."],
  "action_items": [
    {"task": "Task description", "owner": "Name or 'Unassigned'"},
    {"task": "Another task", "owner": "Name"}
  ]
}`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Transcript: """\n${transcript}\n"""`,
          },
        ],
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error during summarization:', error.response ? error.response.data : error.message);
    throw new Error('Groq LLM API call failed');
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
