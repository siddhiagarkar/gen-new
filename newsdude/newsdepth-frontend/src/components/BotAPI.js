// BotAPI.js - Handles ALL API communication
class BotAPIService {
  constructor() {
    this.lastCallTime = 0;
    this.rateLimitDelay = 1500;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  async generateSmartResponse(prompt, context = [], headline = null) {

    console.log('OpenAI Key exists:', !!process.env.REACT_APP_OPENAI_KEY);
    console.log('Key length:', process.env.REACT_APP_OPENAI_KEY?.length);
    
    const API_URL = "https://api.openai.com/v1/chat/completions";
    
    try {
      // Rate limiting
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;
      
      if (timeSinceLastCall < this.rateLimitDelay) {
        await new Promise(resolve => 
          setTimeout(resolve, this.rateLimitDelay - timeSinceLastCall)
        );
      }

      if (!process.env.REACT_APP_OPENAI_KEY) {
        throw new Error("Missing OpenAI API key");
      }

      // Build messages with context
      const messages = [
        {
          role: "system",
          content: `You are NewsBuddy, a helpful news assistant. 
          Provide concise 1-2 sentence answers about "${headline?.title || 'current news'}". 
          Give all the details you know when the user asks a question. 
          Do not leave sentences incomplete.
          Do not repeat things already said, until specifically asked to.`
        }
      ];

      // Add conversation context
      context.slice(-4).forEach(msg => {
        messages.push({
          role: msg.from === 'user' ? 'user' : 'assistant',
          content: msg.text.substring(0, 200)
        });
      });

      // Add current prompt
      messages.push({
        role: "user",
        content: prompt.substring(0, 300)
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Upgrade': 'HTTP/2.0',
            'API-Version': '1.0' // version in header
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.7,
          max_tokens: 150,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        })
      });

      this.lastCallTime = Date.now();

      if (!response.ok) {
        if (response.status === 429) {
          this.rateLimitDelay = Math.min(this.rateLimitDelay * 2, 10000);
          this.retryCount++;
          if (this.retryCount <= this.maxRetries) {
            return this.generateSmartResponse(prompt, context, headline);
          }
          throw new Error("rate_limit");
        }
        throw new Error(`API Error: ${response.status}`);
      }

      // Reset on success
      this.rateLimitDelay = 1500;
      this.retryCount = 0;

      const data = await response.json();
      return data.choices[0]?.message?.content.trim() || "No response generated.";

    } catch (error) {
      console.error("OpenAI API Error:", error);
      
      if (error.message === "rate_limit" && this.retryCount < this.maxRetries) {
        this.retryCount++;
        await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
        return this.generateSmartResponse(prompt, context, headline);
      }
      
      return "I'm having trouble responding right now. Please try again in a moment.";
    }
  }
}

// Create a singleton instance
const botAPIService = new BotAPIService();
export default botAPIService;