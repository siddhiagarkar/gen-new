import React, { useState } from 'react';

const Chatbot = ({ headline, onRefresh }) => {
  const [messages, setMessages] = useState([
    { text: headline.summary, from: 'bot' },
    { text: 'What would you like to know next?', from: 'bot' },
    { text: '1. Why did this happen?', from: 'suggestion' },
    { text: '2. Who is affected?', from: 'suggestion' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const question = e.target.question.value;
    setMessages([...messages, { text: question, from: 'user' }]);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-[#fdf5f1] p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-2xl text-[#222222]">
          Chatting about: <span className="text-[#d66c3e]">{headline.title}</span>
        </h1>
        <button 
          onClick={onRefresh}
          className="px-3 py-1 bg-[#d66c3e] text-white rounded-md hover:bg-[#e9967a]"
        >
          🔄 New Headlines
        </button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm max-w-3xl mx-auto">
        <div className="space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.from === 'bot' 
                  ? 'bg-[#f0d8cc] text-[#222222]' 
                  : msg.from === 'suggestion' 
                    ? 'bg-[#e9967a] text-white cursor-pointer hover:bg-[#d66c3e]'
                    : 'bg-white border border-[#f0d8cc]'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            name="question"
            type="text"
            placeholder="Ask anything..."
            className="flex-1 p-3 border border-[#f0d8cc] rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[#d66c3e]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#d66c3e] text-white rounded-lg hover:bg-[#e9967a]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;