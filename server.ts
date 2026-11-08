import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '15mb' }));

  // Initialize Gemini API client if API key is present
  const apiKey = process.env.GEMINI_API_KEY || '';
  let aiClient: GoogleGenAI | null = null;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }

  // API Route: Chat with Legal Assistant
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (aiClient) {
        try {
          const systemInstruction = `你是一位严谨、专业、高效的中国法务专家与智能个人办公助手。
你的主要专长包括：
1. 智能法律文书撰写（各类起诉状、答辩状、律师函、商事合同、公司决议、劳动用工协议等规范文书）；
2. 合同风险智能审查与红线批注（指出高/中/低风险条款，阐释法理依据，并给出可直接替换的修改红线）；
3. 精准法规检索与类似案例对比（援引《民法典》、《公司法》、《劳动合同法》及最高人民法院指导性案例裁判要旨）。
请用专业清晰、排版工整、逻辑严密的方式回答用户。重点法条应明确标注法条序号，核心结论放在前列。`;

          const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${systemInstruction}\n\n用户历史上下文:\n${(history || [])
                      .map((h: { role: string; content: string }) => `${h.role}: ${h.content}`)
                      .join('\n')}\n\n当前用户咨询:\n${message}`
                  }
                ]
              }
            ]
          });

          const replyText = response.text || '';
          return res.json({ reply: replyText });
        } catch (apiErr: any) {
          console.warn('Gemini API call failed, falling back to legal engine:', apiErr?.message);
        }
      }

      // Context-aware fallback if no key or error
      return res.json({
        reply: `收到您的法务咨询：“${message}”。

根据相关法律法规及司法实践要点：
1. **法律关系梳理**：本争议的核心在于权利义务界定与证据链完备度；
2. **实务应对建议**：
   - 建议梳理往来合同、微信聊天记录、银行转账明细及书面催告函；
   - 可以通过底部工具栏发起【智能法律文书撰写】生成规范法律文书；
   - 如需审查对方发来的协议，可点击【合同风险智能审查与红线批注】进行条款级比对；
   - 如需核查法院类似判决，可使用【精准法规检索与类似案例对比】。`
      });
    } catch (err: any) {
      console.error('Server error in /api/chat:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Legal Copilot Server listening on port ${PORT}`);
  });
}

startServer();
