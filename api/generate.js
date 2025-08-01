export const config = {
    api: {
      bodyParser: true,
    },
  };
  
  export default async function handler(req, res) {
    // Enable CORS for Chrome Extension
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // respond to preflight
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // updated model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
  
      const data = await response.json();
  
      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error("API error:", error);
      res.status(500).json({ error: "Failed to get response from OpenAI" });
    }
  }
  