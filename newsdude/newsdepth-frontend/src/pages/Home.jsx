import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from '../components/Dashboard';

const Home = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual NewsAPI key
      const API_KEY = '36cf9bdd661c48f39136e2029c3b7f9a';
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );
      
      setHeadlines(response.data.articles.slice(0, 6)); // Get first 6 articles
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
      {/* ... rest of your JSX ... */}
      <Dashboard 
        headlines={headlines} 
        refreshHeadlines={fetchHeadlines} 
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Home;