document.getElementById('generate').addEventListener('click', async () => {
  const input = document.getElementById('input').value.trim();
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copy');

  if (!input) {
    output.textContent = "Please enter some text from the video.";
    return;
  }

  output.textContent = "Analyzing...";

  const prompt = `
This is a caption or description from a TikTok video: "${input}"

Generate a short, friendly, science-based comment that adds context and helps clarify any misleading or exaggerated claims. Keep it neutral and helpful, not judgmental.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
       "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,

      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const comment = data.choices[0].message.content;
    output.textContent = comment;
    copyBtn.style.display = "block";

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(comment);
      copyBtn.textContent = "Copied!";
    };
  } catch (err) {
    output.textContent = "Error getting response. Check your API key or try again.";
  }
});
