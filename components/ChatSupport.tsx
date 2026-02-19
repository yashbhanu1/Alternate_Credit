import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, HelpCircle } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am the INNOVIX support assistant. How can I help you understand your trust score today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const initChat = () => {
    if (!process.env.API_KEY) return null;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a friendly and knowledgeable support agent for INNOVIX AI. INNOVIX AI helps underbanked users in India get credit scores based on alternative data like utility bills, phone usage, and social connections, rather than just credit bureau history. Help users understand terms like 'Trust Score', 'Digital Affinity', and 'Stability Score'. Explain that a higher score leads to better loan terms. Keep responses concise, encouraging, and easy to understand for someone with potentially limited financial literacy.",
      },
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Check for API Key availability (in a real app, this would be handled differently)
    if (!process.env.API_KEY) {
      setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'model', text: 'I am currently offline (API Key missing). Please check your configuration.' }]);
      setInput('');
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = initChat();
      }

      if (chatSessionRef.current) {
        const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMsg });
        
        // Add placeholder for model response
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        let fullResponse = '';
        
        for await (const chunk of resultStream) {
           const c = chunk as GenerateContentResponse;
           if (c.text) {
             fullResponse += c.text;
             setMessages(prev => {
                const newHistory = [...prev];
                // Update the last message (model's response) with accumulated text
                newHistory[newHistory.length - 1].text = fullResponse;
                return newHistory;
             });
           }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center gap-2 group"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold hidden md:inline pr-1">Help & Support</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">INNOVIX Assistant</h3>
                <p className="text-xs text-blue-100 opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={toggleChat} 
              className="p-1.5 hover:bg-white/20 rounded-lg text-blue-100 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 flex-shrink-0 border border-indigo-200">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
               <div className="flex justify-start items-center">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 flex-shrink-0 border border-indigo-200">
                    <Bot size={16} />
                 </div>
                 <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 h-10 items-center">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 pl-4 pr-12 py-3 bg-slate-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">AI-generated responses can be inaccurate.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};