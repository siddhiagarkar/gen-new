import React from 'react';
import Chatbot from '../components/Chatbot';

const Chat = () => {
  // Get headline data from URL params or context
  const headline = {
    id: 1,
    title: "Sample Headline",
    summary: "This is a sample news summary"
  };

  const fetchHeadlines = () => {
    // Your refresh logic here
    console.log("Refreshing headlines...");
  };


  return <Chatbot 
      headline={headline} 
      onRefresh={fetchHeadlines} 
    />;
};

export default Chat;