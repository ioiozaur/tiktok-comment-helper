export default async function handler(req, res) {
    // Enable CORS for Chrome Extension
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // respond to preflight
    }
  
    // Parse JSON body
    let prompt;
    try {
      const body = await req.json(); // for Vercel Edge Functions
      prompt = body.prompt;
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // use gpt-4 only if you’re sure your API key supports it
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        })
      });
  
      const data = await response.json();
  
      if (data.error) {
        console.error("OpenAI API Error:", data.error);
        return res.status(500).json({ error: data.error.message || "OpenAI error" });
      }
  
      return res.status(200).json(data);
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({ error: "Failed to get response from OpenAI" });
    }
  }
  