import React, { useContext, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaRobot,
  FaUserCircle,
  FaCopy,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";
import instance from "../../Api/axios";
import classes from "./Chatbot.module.css";
import { AppState } from "../../context/DataContext";
import axios from "../../Api/axios";

const Chatbot = () => {
  const { user, setUser } = useContext(AppState);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendChatMessage = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ You must be logged in to chat with AI.",
        },
      ]);
      return;
    }

    if (!chatInput.trim()) return;

    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    try {
      setChatLoading(true);
      const response = await instance.post(
        "/ai/ask",
        { prompt: userMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = { role: "assistant", content: response.data.aiAnswer };
      setChatMessages((prev) => [...prev, aiMessage]);
      const userRequest = axios.get("/user/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const [userResponse] = await Promise.all([userRequest]);
      setUser(userResponse.data.username);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to get AI response." },
      ]);
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMessage("Copied ✅");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        className={classes.ai_circle_btn}
        onClick={() => setShowChat(!showChat)}
      >
        <FaRobot size={22} />
      </button>

      <AnimatePresence>
        {showChat && (
          <motion.div
            className={classes.chat_sidebar}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            {/* Header */}
            <div className={classes.chat_header}>
              <h3>Your AI Assistant 🤖</h3>
              <button onClick={() => setShowChat(false)}>
                <FaTimes size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className={classes.chat_body}>
              {/* Background greeting if no messages */}
              {chatMessages.length === 0 && !chatLoading && (
                <div className={classes.chat_greeting_container}>
                  <p className={classes.chat_greeting}>
                    Hey {user}, how can I help you today? 🤖
                  </p>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? classes.user_container
                      : classes.ai_container
                  }
                >
                  <div className={classes.avatar}>
                    {msg.role === "user" ? (
                      <FaUserCircle size={28} />
                    ) : (
                      <FaRobot size={28} />
                    )}
                  </div>
                  <div
                    className={
                      msg.role === "user"
                        ? classes.user_bubble
                        : classes.ai_bubble
                    }
                  >
                    {msg.content}
                    {msg.role === "assistant" && (
                      <button
                        className={classes.copy_btn}
                        onClick={() => copyToClipboard(msg.content)}
                      >
                        <FaCopy size={12} /> Copy
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <p className={classes.typing_indicator}>AI is typing...</p>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={classes.chat_input}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="Ask AI..."
              />
              <button onClick={sendChatMessage} disabled={chatLoading}>
                <FaPaperPlane size={16} /> Send
              </button>
            </div>

            {copyMessage && (
              <p className={classes.copy_feedback}>{copyMessage}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
