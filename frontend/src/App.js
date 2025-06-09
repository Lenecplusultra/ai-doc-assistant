
import React, { useState, useEffect, useRef } from "react";
import "./index.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // default to dark mode

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "you", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("https://ai-doc-assistant-lve1.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      let index = 0;
      let botMessage = { sender: "bot", text: "" };
      setMessages((prev) => [...prev, botMessage]);

      const interval = setInterval(() => {
        if (index < data.response.length) {
          botMessage.text += data.response.charAt(index);
          setMessages((prev) => [...prev.slice(0, -1), { ...botMessage }]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);

    } catch (err) {
      console.error("❌ Fetch error:", err); // view error
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error contacting backend" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className={darkMode ? "dark" : "light"} style={{
      backgroundColor: "var(--bg)",
      color: "var(--text)",
      minHeight: "100vh",
      padding: 20,
      fontFamily: "sans-serif"
    }}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "1px solid var(--text)",
          padding: "6px 12px",
          borderRadius: 6,
          cursor: "pointer",
          color: "var(--text)"  // 👈 This makes text follow light/dark theme
        }}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h2 style={{
        textAlign: "center",
        fontSize: "1.8rem",
        fontFamily: "var(--header-font)",
        marginBottom: 24
      }}>
        🌺 Welcome
      </h2>

      <div style={{
        background: "var(--chat-bg)",
        padding: 20,
        borderRadius: 12,
        maxWidth: 800,
        margin: "auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.sender === "you" ? "flex-end" : "flex-start",
              marginBottom: 10
            }}
          >
            {m.sender === "bot" && (
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=GPT"
                alt="Bot"
                style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 10 }}
              />
            )}

            <div
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: m.sender === "you" ? "var(--bubble-user)" : "var(--bubble-bot)",
                color: "var(--text)",
                maxWidth: "75%",
                wordBreak: "break-word",
                fontSize: 15,
                lineHeight: 1.5
              }}
            >
              {m.text}
            </div>

            {m.sender === "you" && (
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=TexYY"
                alt="You"
                style={{ width: 32, height: 32, borderRadius: "50%", marginLeft: 10 }}
              />
            )}
          </div>
        ))}

        {loading && <div><i>Bot is thinking...</i></div>}
        <div ref={bottomRef} />
      </div>

      <div style={{
        marginTop: 20,
        display: "flex",
        maxWidth: 800,
        marginInline: "auto",
        background: "#2a2a2a",
        borderRadius: 12,
        padding: 10
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="How can I help you today?"
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "transparent",
            color: "var(--text)",
            border: "none",
            outline: "none",
            fontSize: 16
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginLeft: 10,
            padding: "10px 16px",
            borderRadius: 6,
            background: "#007BFF",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer"
          }}
        >
          ⬆️
        </button>
      </div>
    </div>
  );
}

export default App;
