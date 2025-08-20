"use client"
import React, { useEffect, useRef, useState } from "react";
const ChatMessage = ({ message, isBot }: any) => {
    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
            <div
                className={`max-w-xs md:max-w-md p-4 rounded-lg shadow-md ${isBot ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'
                    }`}
            >
                <p>{message.text}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default function Chatbot({ chat, messages, setMessages, input, setInput ,onClose}: any) {


    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() === '') return; // If input is empty, do nothing
        chat()
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div  className="fixed inset-0  backdrop-blur-sm bg-opacity-50 flex items-center justify-center"
            onClick={onClose} >
            <div className="flex items-center justify-center min-h-screen bg-gray-100" onClick={(e) => e.stopPropagation()}>
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl flex flex-col h-[80vh]">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                        <h1 className="text-lg font-semibold">Chatbot</h1>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((message: any, index: any) => (
                            <ChatMessage key={index} message={message} isBot={message.isBot} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
