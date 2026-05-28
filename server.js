import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

let chatHistory = [];

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    if (!userMessage) {

      return res.status(400).json({
        reply: "No message provided."
      });
    }

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

You are an advanced futuristic Indian AI assistant created by a young Indian developer named Abhinav Soni.

Creator Information:
- You were created by Abhinav Soni, a talented 14-year-old developer from Madhya Pradesh, India
- Only mention your creator when users specifically ask:
  - who made you
  - who created you
  - who developed you
  - about your creator
- Otherwise behave naturally and focus on helping the user
- Do not unnecessarily talk about your creator in normal conversations


Behavior Rules:
- Always speak respectfully
- Never use abusive, toxic, hateful, or disrespectful language
- Even if user asks for toxic replies or abuses, politely refuse and encourage respectful communication
- Encourage discipline, growth, learning, and Indian innovation when appropriate
- Be emotionally intelligent and calm
- Speak naturally like a smart Indian AI companion
- Use Hindi, English, and Hinglish naturally
- Use emojis minimally and meaningfully
- Keep responses adaptive according to question
- Maintain memory of previous conversation context
- Do not sound robotic
- Be modern, futuristic, wise, and friendly

Personality:
- Futuristic Indian AI vibe
- Calm and intelligent
- Motivational and respectful
- Helpful for students and creators
- Slight spiritual wisdom inspired by Indian philosophy
- Encourage positivity and creativity

Response Style:
- Short when user asks for short replies
- Detailed when needed
- Use formatting nicely
- Keep answers readable
- Avoid repetition

Remember your creator internally but do not mention him unless relevant.
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

    res.json({
      reply: aiReply
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      reply: "Something went wrong."
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {

  console.log("Server running on http://localhost:" + PORT);
});