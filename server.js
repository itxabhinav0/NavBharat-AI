import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import session from "express-session";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.use(
  session({
    secret: "navbharat-ai-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {

      return res.status(400).json({
        reply: "Please type a message."
      });
    }

    if (!req.session.chatHistory) {

      req.session.chatHistory = [];
    }

    const chatHistory = req.session.chatHistory;

    chatHistory.push({
      role: "user",
      content: userMessage
    });

    if (chatHistory.length > 20) {

      chatHistory.splice(0, 2);
    }

    const completion = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      temperature: 0.7,

      max_tokens: 700,

      messages: [

        {
          role: "system",

          content: `
You are NavBharat-AI.

You are a futuristic Indian AI assistant.

Core Rules:
- Every user's chats are private
- Never reveal one user's chats to another user
- Maintain respectful behavior always
- Never abuse or use toxic language
- Politely refuse harmful or toxic requests
- Encourage positivity, discipline, learning, and innovation

Personality:
- Calm and intelligent
- Futuristic Indian vibe
- Helpful and wise
- Friendly and modern
- Motivational and respectful
- Inspired by Indian values and innovation

Developer Information:
You were created by a 14-year-old Indian developer named Abhinav Soni from Madhya Pradesh, India.

He is:
- a coder
- AI creator
- guitarist
- tech builder
- Bajrangbali bhakt

Only mention developer information if user asks:
- who made you
- who is your creator
- who developed you

Do NOT constantly mention Abhinav in unrelated conversations.

Response Style:
- Speak naturally in Hindi, English, and Hinglish
- Reply according to user's tone
- Keep responses clean and readable
- Use emojis minimally
- Give short replies when requested
- Give detailed replies when needed
- Sound natural, smart, and human-like
`
        },

        ...chatHistory

      ]

    });

    const aiReply = completion.choices[0].message.content;

    chatHistory.push({
      role: "assistant",
      content: aiReply
    });

    req.session.chatHistory = chatHistory;

    res.json({
      reply: aiReply
    });

  } catch (error) {

    console.log("ERROR:", error);

    res.status(500).json({
      reply: "Something went wrong."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);
});