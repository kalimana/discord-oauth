import fetch from "node-fetch";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code");

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      })
    });

    const token = await tokenRes.json();
    if (!token.access_token) return res.status(400).json(token);

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });
    const user = await userRes.json();

    console.log("Verified:", user.id, user.username);

    res.send(`
      <h1>✅ Verified</h1>
      <p>You can close this tab.</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth error");
  }
}
