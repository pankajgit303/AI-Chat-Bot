# AI ChatBot

An intelligent conversational web application developed as part of my BCA (Bachelor of Computer Applications) academic project. This application provides a modern, responsive interface for interacting with Google's Gemini AI.

## 👨‍💻 Developer
**Pankaj Singha**  
BCA – 2nd Year  
[Portfolio Website](https://pankajportfolioo.vercel.app/)

## ✨ Key Features
- **Modern User Interface**: Clean layout with responsive design for mobile, tablet, and desktop.
- **AI Integration**: Powered by the Google Gemini 2.5 Flash model for fast, intelligent responses.
- **Chat History**: Locally persisted sessions allowing users to resume past conversations.
- **Markdown & Code Support**: Full support for rendering Markdown syntax, code blocks with syntax highlighting, and easy copy-to-clipboard functionality.
- **Dark & Light Themes**: Accessible color schemes that adapt to user preferences.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Framer Motion
- **Backend/Proxy**: Node.js, Express (to securely handle API keys)
- **AI Platform**: Google Gemini API
- **Build Tool**: Vite, ESBuild

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pankajgit303/AI-Chat-Bot-.git
   cd AI-Chat-Bot-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the project and add your API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## 📦 Deployment
This project uses a full-stack architecture (Vite frontend + Express backend) to securely protect the API key. 
For production deployment, use `npm run build` to compile both the frontend assets and the backend server, followed by `npm run start` to serve the application.