"use client";

import { MessageCircle, X } from "lucide-react";
import { motion } from "framer-motion";

const ChatBubble = ({ isOpen, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${isOpen ? "bg-red-500 rotate-90" : "bg-[#0852A1] rotate-0"
                }`}
        >
            {isOpen ? (
                <X size={28} className="text-white" />
            ) : (
                <MessageCircle size={28} className="text-white" />
            )}

            {/* Notification Dot (Optional) */}
            {!isOpen && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
            )}
        </motion.button>
    );
};

export default ChatBubble;
