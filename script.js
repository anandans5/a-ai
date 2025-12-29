const chat = document.getElementById("chat");
const input = document.getElementById("input");

function add(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  add(text, "user");
  input.value = "";

  setTimeout(async () => {
    const res = await fetch("http://localhost:3000/pookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    if (data.reply) add(data.reply, "Anandan!");
  }, randomDelay());
}

function randomDelay() {
  return Math.floor(Math.random() * 1200) + 600;
}

setTimeout(() => {
  add("hmm… you came 😭", "pookie");
}, 800);

// press Enter to send
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
});
