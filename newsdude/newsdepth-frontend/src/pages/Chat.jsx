import React from 'react';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Chatbot from '../components/Chatbot';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [headlines, setHeadlines] = useState([]);
  const { headlineIndex } = useParams();
  console.log("headline idx = " , headlineIndex);  
  console.log("API Key:", process.env.REACT_APP_NEWS_API_KEY);
  console.log('URL param headlineIndex:', headlineIndex); // Should show a number
  console.log('Current headlines:', headlines); // Should show array with articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_KEY = process.env.REACT_APP_NEWS_API_KEY
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );


      setHeadlines(response.data.articles);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHeadlines(); }, []);

  if (loading) 
    // console.log('Loading the headline(s)')
    return <div>Loading...</div>;
  if (!headlines.length) return <div>No headlines found</div>;
  
  const selectedHeadline = headlines[Number(headlineIndex)];
  if (!selectedHeadline) return <div>Invalid article</div>;

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