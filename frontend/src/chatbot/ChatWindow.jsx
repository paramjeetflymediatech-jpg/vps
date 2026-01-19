"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ChatWindow = ({ messages, onSendMessage, isTyping }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden font-sans"
        >
            {/* Header */}
            <div className="bg-[#0852A1] p-4 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Support Assistant</h3>
                    <p className="text-blue-100 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="text-center text-xs text-slate-400 my-2">Today</div>

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-slate-200" : "bg-blue-100"
                                }`}
                        >
                            {msg.sender === "user" ? (
                                <User size={16} className="text-slate-600" />
                            ) : (
                                <Bot size={16} className="text-[#0852A1]" />
                            )}
                        </div>
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                                ? "bg-[#0852A1] text-white rounded-tr-none"
                                : "bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
                                }`}
                        >
                            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                            <p className={`text-[10px] mt-1 text-right opacity-70 ${msg.sender === "user" ? "text-blue-200" : "text-slate-400"}`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bot size={16} className="text-[#0852A1]" />
                        </div>
                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#0852A1]/20 focus:bg-white transition-all text-sm outline-none"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 bg-[#0852A1] text-white rounded-xl hover:bg-[#063d7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </form>
        </motion.div>
    );
};

export default ChatWindow;
