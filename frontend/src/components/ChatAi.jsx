import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hi! I'm your AI coding assistant. How can I help you with this problem?" }] }
    ]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {
        // Add user message to UI
        const userMessage = { role: 'user', parts: [{ text: data.message }] };
        setMessages(prev => [...prev, userMessage]);
        reset();

        try {
            // Prepare conversation history (only send last few messages to avoid token limits)
            const conversationHistory = messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.parts[0].text
            }));

            // Add the current user message
            conversationHistory.push({
                role: 'user',
                content: data.message
            });

            const response = await axiosClient.post("/ai/chat", {
                messages: conversationHistory, // Send array of messages with role and content
                title: problem?.title || "",
                description: problem?.description || "",
                testCases: problem?.visibleTestCases || [],
                startCode: problem?.startCode || []
            });

            // Add AI response to UI
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message || response.data.response || "I'm here to help!" }]
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again in a moment." }]
            }]);
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 bg-gray-900 border-t border-gray-800"
            >
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Ask me anything about this problem..."
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...register("message", { required: "Message is required", minLength: 1 })}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={errors.message}
                    >
                        <Send size={20} />
                    </button>
                </div>
                {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                )}
            </form>
        </div>
    );
}

export default ChatAi;