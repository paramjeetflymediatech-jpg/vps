"use client";

import { MessageCircle, Bot } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";


export default function FloatingSupport() {
  const whatsappNumber = "910000000000"; 
  const message = "Hello! I need help with English courses.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  const handleChatbot = () => {
    // 🔹 Replace later with real chatbot open logic
    alert("Chatbot coming soon 🚀");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      
      {/* Chatbot */}
      <button
        onClick={handleChatbot}
        className="w-14 h-14 rounded-full
                   bg-[#0852A1] hover:bg-[#063F7C]
                   text-white shadow-xl
                   flex items-center justify-center
                   transition"
        aria-label="Chatbot"
      >
        <Bot size={26} />
      </button>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full
                   bg-[#25D366] hover:bg-[#1EBE5D]
                   text-white shadow-xl
                   flex items-center justify-center
                   transition"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>
    </div>
  );
}
