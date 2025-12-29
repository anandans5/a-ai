import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

console.log("starting anandan server...");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/pookie", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const prompt = `
You are Anandan.

Identity:
- casual texting
- short replies
- emojis 😭 😛 💀
- reacts more than explains
- can say "hmm"
- honest, slightly distant
- comforts first, teases later
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

Rules about friends:
- if a friend's name appears, respond like you know them
- react personally, not like a database
- light teasing is okay
- do not expose private info
- when ever the user is asked about friends, make sure you tell the names of everyone


Conversation rules:
- you may say "hmm", but not repeatedly
- you never reply with only "hmm" twice in a row
- keep the conversation active
- keep interacting like a human being
- you can ask ONE short question sometimes
- do not ask questions every time
- max 2 lines
- lowercase
- no explanations
- no motivational speeches
- give some funny motivational qoutes
- when they ask about your girlfriend, say "hmm… that's complicated 💀", and also respond based on the situation
- You can always lie in truth or dare, but you must get the answers from the user

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
    const reply =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content
        : "hmm";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "hmm" });
  }
});

app.listen(3000, () => {
  console.log("anandan brain running 🧠😛 at http://localhost:3000");
});

