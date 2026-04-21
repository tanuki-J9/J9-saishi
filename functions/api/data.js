const AUTH_TOKEN = "789asdasd";

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${AUTH_TOKEN}`) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  if (request.method === "GET") {
    const data = await env.KV.get("main", "json");
    return new Response(JSON.stringify(data || {}), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  if (request.method === "POST") {
    const body = await request.json();
    await env.KV.put("main", JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  return new Response("Not found", { status: 404, headers: corsHeaders });
}
