// api/chat.js
import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { context, question } = req.body;
    // 从Vercel Secret读取 DEEPSEEK_API_KEY
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing API Key on server' });
    }

    // 自动组装消息，适配塔罗上下文
    const messages = [
      { role: "system", content: "你是塔罗解读助手，根据牌面上下文做简短易懂的解读，不要长篇大论。" },
      { role: "system", content: `牌面上下文：${context || "无"}` },
      { role: "user", content: question }
    ];

    const data = JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.8,
      max_tokens: 800
    });

    const options = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req2 = https.request(options, (res2) => {
      let body = '';
      res2.on('data', (chunk) => { body += chunk; });
      res2.on('end', () => {
        const raw = JSON.parse(body);
        // 返回 {answer:"xxx"} 匹配前端app.js的读取逻辑
        const answer = raw?.choices?.[0]?.message?.content || "没有获取到回答";
        res.status(200).json({ answer });
      });
    });

    req2.on('error', (e) => {
      res.status(500).json({ error: 'Server error: ' + e.message });
    });

    req2.write(data);
    req2.end();
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
