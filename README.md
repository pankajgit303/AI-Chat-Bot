# AI ChatBot – Intelligent Virtual Assistant

An academic AI chatbot project developed to explore conversational AI, API integration, and modern web application development. The application uses Google's Gemini API to generate intelligent responses and provides a responsive, user-friendly chat experience.

## Features

- **Modern Chat Interface**: Clean, ChatGPT-style layout with message timestamps and animations.
- **AI Integration**: Powered by Google Gemini API.
- **Local History**: Chat history is persisted locally using `localStorage`.
- **Theming**: Dark and light mode support.
- **Fully Responsive**: Works on desktop, tablet, and mobile devices.

## Technologies Used

- React 19 (TypeScript)
- Tailwind CSS v4
- Google Gemini API (`@google/genai`)
- Vite
- Express (Backend for secure API proxying)
- Lucide React (Icons)
- React Markdown (Formatting)

## Project Structure

- `/src/components/`: Reusable UI components (Sidebar, ChatMessage, ChatInput, etc.)
- `/src/hooks/`: Custom React hooks (`useLocalStorage`, `useTheme`)
- `/src/services/`: API integration services
- `/src/types.ts`: TypeScript definitions
- `/server.ts`: Express backend proxy for securely handling the Gemini API Key

## Local Development Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Rename `.env.example` to `.env` and add your Gemini API Key:
```env
GEMINI_API_KEY="your_api_key_here"
```
*Note: Never commit your `.env` file to version control.*

### 3. Run the Development Server
```bash
npm run dev
```
This command starts both the Vite frontend and the Express backend simultaneously via `tsx`. The application will be available at `http://localhost:3000`.

## Vercel Deployment Instructions

Since this project requires a backend to keep the Gemini API key secure, you can deploy it to Vercel as a full-stack Next.js app or use Vercel's serverless functions. 

However, since this is a Vite + Express setup, the easiest way to deploy on Vercel is to rewrite the Express routes to Vercel Serverless Functions. 

1. Create an `api/chat.js` file at the root of the project to act as a Vercel serverless function:
```javascript
// api/chat.js
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: req.body.contents,
    });
    res.status(200).json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```
2. Configure `vercel.json`:
```json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }]
}
```
3. Push to GitHub and import the project into Vercel.
4. Add the `GEMINI_API_KEY` to the **Environment Variables** section in the Vercel project settings.
5. Deploy!
