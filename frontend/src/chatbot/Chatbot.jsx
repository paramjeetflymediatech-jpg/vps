"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ChatBubble from "./ChatBubble";
import ChatWindow from "./ChatWindow";
import { FaWhatsapp } from "react-icons/fa";


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi there! 👋 Welcome to The English Raj. How can I help you today?",
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        },
    ]);

    const generateResponse = (userText) => {
        const lowerText = userText.toLowerCase();

        if (lowerText.includes("hello") || lowerText.includes("hi")) {
            return "Hello! Are you looking for a tutor or checking out our courses?";
        }
        if (lowerText.includes("tutor") || lowerText.includes("teacher")) {
            return "We have expert tutors available for 1-on-1 sessions. You can verify their profiles on the 'Find Tutors' page!";
        }
        if (lowerText.includes("price") || lowerText.includes("cost")) {
            return "Our pricing is flexible based on the tutor's experience. Check the packages section for details.";
        }
        if (lowerText.includes("course") || lowerText.includes("class")) {
            return "We offer courses for IELTS, Spoken English, and Business Communication. Which one interests you?";
        }
        if (lowerText.includes("contact") || lowerText.includes("support")) {
            return `You can reach our support team at 
    <a href="mailto:support@theenglishraj.com" class="text-blue-600 underline font-bold" target="_blank" rel="noopener noreferrer">
      support@theenglishraj.com
    </a> 
    or call us directly.`;
        }
        return "I'm just a bot 🤖 but our support team is available 24/7. Would you like me to connect you with them?";
    };

    const handleSendMessage = (text) => {
        const userMessage = {
            id: Date.now(),
            text,
            sender: "user",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: generateResponse(text),
                sender: "bot",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* CHATBOT */}
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {isOpen && (
                        <ChatWindow
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            isTyping={isTyping}
                        />
                    )}
                </AnimatePresence>

                <ChatBubble
                    isOpen={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {/* WHATSAPP BUTTON */}
            <a
                href="https://wa.me/919041323089?text=Hello! I need help with The English Raj courses."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-24 right-6 z-40
               w-14 h-14 rounded-full bg-[#25D366]
               hover:bg-[#1EBE5D] text-white shadow-xl
               flex items-center justify-center
               transition-transform hover:scale-110"
            >
                <FaWhatsapp className="w-8 h-8" />
            </a>
        </>
    );
};

export default Chatbot;
