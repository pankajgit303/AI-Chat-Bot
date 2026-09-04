import { Message } from "../types";

export async function sendMessageToGeminiStream(
  messages: Message[],
  onChunk: (text: string) => void,
): Promise<void> {
  const contents = messages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate response");
    }

    if (!response.body) {
      throw new Error("ReadableStream not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const chunkString = decoder.decode(value, { stream: true });
        const lines = chunkString.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.substring(6).trim();
            if (dataStr === "[DONE]") {
              return;
            }
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.text) {
                  onChunk(data.text);
                }
              } catch (e) {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }
    }
  } catch (error: any) {
    console.error("Error in sendMessageToGeminiStream:", error);
    throw new Error(error.message || "A network error occurred.");
  }
}
