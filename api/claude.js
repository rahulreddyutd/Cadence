// Vercel Serverless Function: /api/claude  (CommonJS)
//
// The browser calls THIS endpoint (same domain, no CORS). This function adds
// your Anthropic API key (kept server-side in an environment variable) and
// forwards the request to Anthropic, then returns the response to the browser.
//
// The key is NEVER sent to the browser and never appears in your source code.
// Set it in Vercel: Project -> Settings -> Environment Variables -> ANTHROPIC_API_KEY

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set. Add it in Vercel: Settings -> Environment Variables, then redeploy.");
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch (e) { payload = {}; }
    }
    payload = payload || {};
    const { model, max_tokens, messages } = payload;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Request must include a messages array" });
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1024,
        messages,
      }),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(502).json({ error: "Failed to reach Anthropic" });
  }
};
