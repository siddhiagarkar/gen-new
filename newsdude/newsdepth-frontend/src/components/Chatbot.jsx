import React, { useState, useEffect, useCallback } from 'react';
import botAPIService from './BotAPI';
import SuggestionService from './SuggestionService'; // New service

const Chatbot = ({ headline = {}, onRefresh }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('ready');
  const [suggestions, setSuggestions] = useState([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // Initialize with headline
  useEffect(() => {
    if (headline?.title) {
      const initialMessages = [
        { 
          text: headline.title, 
          from: 'bot',
          isTitle: true 
        },
        { 
          text: headline.description || "What would you like to know about this story?", 
          from: 'bot' 
        }
      ];
      setMessages(initialMessages);
      generateSuggestions(initialMessages);
    }
  }, [headline]);

  // Generate dynamic suggestions based on conversation
  const generateSuggestions = useCallback(async (currentMessages) => {
    if (currentMessages.length < 2) {
      setSuggestions([
        'What are the key points?',
        'Who is involved?',
        'What are the implications?',
        'Can you summarize?'
      ]);
      return;
    }
    
    setIsGeneratingSuggestions(true);
    try {
      const newSuggestions = await SuggestionService.generateSuggestions(
        currentMessages,
        headline
      );
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      // Fallback suggestions
      setSuggestions([
        'Tell me more',
        'What happened next?',
        'Any updates?',
        'Main points?'
      ]);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [headline]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = e.target.question.value.trim();
    if (!question || isLoading) return;

    const newMessages = [...messages, { text: question, from: 'user' }];
    setMessages(newMessages);
    e.target.reset();
    setIsLoading(true);
    setApiStatus('processing');

    try {
      const botResponse = await botAPIService.generateSmartResponse(
        question, 
        newMessages, 
        headline
      );
      
      const updatedMessages = [...newMessages, { text: botResponse, from: 'bot' }];
      setMessages(updatedMessages);
      
      // Generate new suggestions based on updated conversation
      generateSuggestions(updatedMessages);
      setApiStatus('ready');
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Please try again in a moment.", 
        from: 'bot',
        isError: true 
      }]);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (text) => {
    if (isLoading) return;
    
    const newMessages = [...messages, { text, from: 'user' }];
    setMessages(newMessages);
    setIsLoading(true);
    setApiStatus('processing');

    try {
      const botResponse = await botAPIService.generateSmartResponse(
        text, 
        newMessages, 
        headline
      );
      
      const updatedMessages = [...newMessages, { text: botResponse, from: 'bot' }];
      setMessages(updatedMessages);
      
      // Generate new suggestions
      generateSuggestions(updatedMessages);
      setApiStatus('ready');
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Service is busy. Please wait.", 
        from: 'bot',
        isError: true 
      }]);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6ebf5] flex flex-col">
      {/* Header */}
      <div className="bg-[#2a5c8d] text-white p-4 shadow-md">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <h1 className="font-sans text-lg font-medium">
            NewsChat Bot {apiStatus !== 'ready' && `(${apiStatus})`}
          </h1>
          <button 
            onClick={onRefresh}
            className="p-2 bg-[#3a6ea5] text-white rounded-full hover:bg-[#4d7eb3]"
            title="Refresh headlines"
            disabled={isLoading}
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
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 ${
              msg.isTitle ? 'bg-[#3a6ea5] text-white font-medium' :
              msg.isError ? 'bg-red-100 text-red-800' :
              msg.from === 'bot' ? 'bg-[#3a6ea5] text-white' :
              'bg-[#dcf8c6] text-gray-800'
            }`}>
              <div className="px-2 py-1">{msg.text}</div>
              {msg.from === 'user' && (
                <div className="text-xs text-gray-500 text-right mt-2">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#3a6ea5] text-white rounded-2xl p-4 max-w-xs md:max-w-md">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Suggestions */}
        {!isLoading && messages.length > 0 && !isGeneratingSuggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 justify-center">
            {suggestions.map((text, i) => (
              <button
                key={i}
                className="bg-[#e1e8f0] text-[#2a5c8d] rounded-full px-4 py-2 cursor-pointer hover:bg-[#d0d9e5] transition text-sm font-medium disabled:opacity-50"
                onClick={() => handleSuggestionClick(text)}
                disabled={isLoading}
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {/* Loading state for suggestions */}
        {isGeneratingSuggestions && (
          <div className="flex flex-wrap gap-2 pt-4 justify-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#e1e8f0] rounded-full px-4 py-2">
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="max-w-3xl w-full mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4">
            <input
              name="question"
              type="text"
              placeholder={isLoading ? "Processing..." : "Ask about this news..."}
              className="flex-1 p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2a5c8d] disabled:opacity-75"
              autoComplete="off"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              className="p-3 bg-[#2a5c8d] text-white rounded-full hover:bg-[#3a6ea5] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
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