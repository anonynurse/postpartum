export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (req.method !== "POST" || new URL(req.url).pathname !== "/api/tts") {
      return new Response("Not found", { status: 404 });
    }

    const { text } = await req.json();
    if (!text) return new Response("No text", { status: 400 });

    const resp = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",   // you can change: alloy, verse, sage, etc.
        input: text
      })
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(err, { status: 500 });
    }

    return new Response(resp.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
