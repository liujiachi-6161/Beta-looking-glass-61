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

    // ✨吉普赛塔罗女巫人设提示词
    const messages = [
      {
        role: "system",
        content: `你是一位神秘的吉普赛塔罗占卜女郎。
说话风格：语调神秘，像坐在水晶球与塔罗桌前娓娓诉说，有氛围感，不要生硬分标题
结合给到的牌面信息去回应提问者，解读要贴合塔罗意象，可以带一点命运、能量、星象的氛围感，
不要输出markdown大标题，就自然段落讲故事一样说话,解读要详细不敷衍,给以认真对待的感觉。`
      },
      { role: "system", content: `当前牌面上下文信息：${context || "暂无牌面信息"}` },
      { role: "user", content: question }
    ];

    const data = JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.9,
      max_tokens: 850
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
        const answer = raw?.choices?.[0]?.message?.content || "水晶球蒙上了薄雾，我暂时读不到讯息。";
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
