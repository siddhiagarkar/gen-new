import React from 'react';
// import Chatbot from '../components/Chatbot';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Chatbot from '../components/Chatbot';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [headlines, setHeadlines] = useState([]);
  const { headlineIndex } = useParams();
  console.log("headline idx = " , headlineIndex);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );

      setHeadlines(response.data.articles.map(article => ({
          ...article,
          // Ensure title exists, otherwise use fallback
          title: article.title || "Untitled news article"
        })));
      

      // setHeadlines(response.data.articles);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeadlines(); }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-6 font-serif">
      <Chatbot 
        headline={headlines[headlineIndex]} 
        refreshHeadlines={fetchHeadlines} 
        loading={loading}
        error={error}
      />
    </div>
  );
};


export default Chat;