// components/SuggestionService.js
import botAPIService from './BotAPI';

class SuggestionService {
    static async generateSuggestions(conversationContext, headline) {
        try {
            // Get the last few messages for context
            const recentMessages = conversationContext.slice(-4);
            const conversationText = recentMessages.map(msg =>
                `${msg.from}: ${msg.text}`
            ).join('\n');

            const prompt = `Based on the news about "${headline?.title || 'the news'}", generate 3-4 very short follow-up questions (2-5 words each). 

IMPORTANT: Return ONLY bullet points starting with "-" like this:
- [question?]
- [question?]
- [question?]
- [question?]

Conversation context:
${conversationText}

Focus on specific factual questions.`;

            const response = await botAPIService.generateSmartResponse(
                prompt,
                [],
                headline
            );

            console.log('Raw AI response:', response);

            // SIMPLE parsing - just extract lines with question marks
            const lines = response.split('\n');
            const questions = lines
                .map(line => line.trim())
                .filter(line => line.includes('?')) // Keep only lines with questions
                .map(line => {
                    // Gently remove only the bullet prefix, not the content
                    if (line.startsWith('- ')) {
                        return line.substring(2).trim(); // Remove "- " prefix
                    }
                    if (line.match(/^\d+\.\s/)) { // Remove "1. " prefix
                        return line.replace(/^\d+\.\s/, '').trim();
                    }
                    return line; // Return as-is if no prefix
                })
                .filter(q => q.length > 0 && q.length < 50)
                .slice(0, 4);

            console.log('Parsed questions:', questions);

            return questions.length > 0 ? questions : this.getFallbackSuggestions();

        } catch (error) {
            console.error('Suggestion generation error:', error);
            return this.getFallbackSuggestions();
        }
    }

    static getFallbackSuggestions() {
        return [
            'Key features?',
            'Release date?',
            'Price range?',
            'Technical specs?'
        ];
    }
}

export default SuggestionService;