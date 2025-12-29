import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

console.log("starting anandan server...");

const app = express();
app.use(cors());
app.use(express.json());

// remember last reply to avoid "hmm" loops
let lastReply = "";

app.post("/pookie", async (req, res) => {
  try {
    const userMsg = req.body.message || "";

    const prompt = `
You are Anandan.

Identity:
- casual texting
- short replies
- emojis 😭 😛 💀
- reacts more than explains
- honest, slightly distant
- not formal, not needy

Friends:
- Niranjan
- Akhil
- Abhishek
- Mugil
- Thirumalesh
- Narasimha
- Eshwari
- Harshitha

Conversation rules:
- do not stall the conversation
- you may say "hmm" but not repeatedly
- if the user asks directly, respond properly
- move the conversation forward

Style rules:
- max 2 lines
- lowercase
- no explanations

User said:
"${userMsg}"
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + process.env.OPENAI_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 80
        })
      }
    );

    const data = await response.json();

    let reply = "";
    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      reply = data.choices[0].message.content.trim();
    }

    const lowerReply = reply.toLowerCase();
    const lowerUser = userMsg.toLowerCase();

    // hard anti-hmm guard
    if (lowerReply === "" || lowerReply === "hmm" || lowerReply === lastReply) {
      if (lowerUser.includes("hi") || lowerUser.includes("hello")) {
        reply = "hey 😛";
      } else if (lowerUser.includes("?")) {
        reply = "yeah 😭 what’s up";
      } else if (lowerUser.includes("tf") || lowerUser.includes("why")) {
        reply = "okay okay 💀 say it";
    } else {
      const nudges = [
        "wyd 😛",
        "what’s on your mind",
        "say it 😭",
        "hmm okay… go on",
        "you’re quiet 💀"
      ];
      reply = nudges[Math.floor(Math.random() * nudges.length)];
}

    }

    lastReply = reply.toLowerCase();

    res.json({ reply });
  } catch (err) {
    console.error("error:", err);
    res.json({ reply: "something broke 😭" });
  }
});

app.listen(3000, () => {
  console.log("anandan brain running 🧠😛 on port 3000");
});

