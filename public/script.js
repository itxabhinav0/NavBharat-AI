const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const themeBtn = document.getElementById("themeBtn");

function addMessage(text, type) {

  const div = document.createElement("div");

  div.className = `message ${type}`;

  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");

  userInput.value = "";

  const typingDiv = document.createElement("div");

  typingDiv.className = "message bot";

  typingDiv.innerText = "Typing...";

  chatBox.appendChild(typingDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {

    const response = await fetch("/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })

    });

    const data = await response.json();

    typingDiv.remove();

    addMessage(data.reply, "bot");

  } catch (error) {

    typingDiv.remove();

    addMessage("Something went wrong.", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {

  if (event.key === "Enter") {
    sendMessage();
  }
});

themeBtn.addEventListener("click", function() {

  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {

    themeBtn.innerText = "☀️";

  } else {

    themeBtn.innerText = "🌙";
  }
});