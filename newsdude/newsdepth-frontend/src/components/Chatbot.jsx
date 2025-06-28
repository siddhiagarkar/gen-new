import React, { useState } from 'react';

const Chatbot = ({ headline, onRefresh }) => {
  const [messages, setMessages] = useState([
    { 
      text: headline?.description, 
      from: 'bot',
      isTitle: true  // Special flag for the title message
    },
    { 
      text: 'Why did this happen?', 
      from: 'suggestion' 
    },
    { 
      text: 'Who is affected?', 
      from: 'suggestion' 
    },
    { 
      text: 'What are the implications?', 
      from: 'suggestion' 
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    if (question.trim()) {
      setMessages([...messages, { text: question, from: 'user' }]);
      e.target.reset();
    }
  };

  const handleSuggestionClick = (text) => {
    setMessages([...messages, { text, from: 'user' }]);
  };

  return (
    <div className="min-h-screen bg-[#e6ebf5] flex flex-col">
      {/* Header */}
      <div className="bg-[#2a5c8d] text-white p-4 shadow-md">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <h1 className="font-sans text-lg font-medium">
            NewsChat Bot
          </h1>
          <button 
            onClick={onRefresh}
            className="p-2 bg-[#3a6ea5] text-white rounded-full hover:bg-[#4d7eb3]"
            title="Refresh headlines"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-4 space-y-4 max-w-3xl w-full mx-auto overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 ${
                msg.isTitle
                  ? 'bg-[#3a6ea5] text-white font-medium'
                  : msg.from === 'bot'
                    ? 'bg-[#3a6ea5] text-white'
                    : msg.from === 'suggestion'
                      ? 'bg-[#e1e8f0] text-[#2a5c8d] border border-[#cad3e0] cursor-pointer hover:bg-[#d0d9e5]'
                      : 'bg-[#dcf8c6] text-gray-800'
              }`}
              onClick={() => msg.from === 'suggestion' && handleSuggestionClick(msg.text)}
            >
              <div className="px-2 py-1">{msg.text}</div>
              {msg.from === 'user' && (
                <div className="text-xs text-gray-500 text-right mt-2">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area - Centered with good padding */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="max-w-3xl w-full mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4">
            <input
              name="question"
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2a5c8d]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="p-3 bg-[#2a5c8d] text-white rounded-full hover:bg-[#3a6ea5]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;