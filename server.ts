import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res
          .status(500)
          .json({ error: "GEMINI_API_KEY environment variable is missing." });
      }

      const { contents } = req.body;
      if (!contents || !Array.isArray(contents)) {
        return res.status(400).json({
          error: "Invalid request format: 'contents' array is required.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
      });

      // Set headers for Server-Sent Events (SSE)
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let responseStream;
      let retries = 0;
      const maxRetries = 3;

      while (retries <= maxRetries) {
        try {
          responseStream = await ai.models.generateContentStream({
            model: "gemini-3.6-flash",
            contents: contents,
          });
          break; // Success, exit loop
        } catch (err: any) {
          if (
            (err?.message?.includes("503") ||
              err?.status === 503 ||
              err?.status === "UNAVAILABLE") &&
            retries < maxRetries
          ) {
            retries++;
            const waitTime = Math.pow(2, retries) * 1000; // 2s, 4s, 8s
            console.log(
              `503 High Demand Error. Retrying in ${waitTime / 1000} seconds (Attempt ${retries} of ${maxRetries})...`,
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          } else {
            throw err;
          }
        }
      }

      // Ensure responseStream is defined, although the throw above should guarantee it
      if (!responseStream) {
        throw new Error("Failed to initialize response stream.");
      }

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Gemini API Error:", error);

      let errorMessage =
        error.message || "An error occurred while communicating with the AI.";

      // Try to parse the nested JSON error message if it exists
      try {
        if (error.message && error.message.includes("{")) {
          const parsed = JSON.parse(error.message);
          if (parsed.error && parsed.error.message) {
            errorMessage = parsed.error.message;
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }

      // Provide a friendlier message for 503
      if (errorMessage.includes("high demand") || error.status === 503) {
        errorMessage =
          "The AI is currently experiencing high demand and is temporarily unavailable. Please wait a moment and try again.";
      }

      if (!res.headersSent) {
        res.status(500).json({ error: errorMessage });
      } else {
        res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
