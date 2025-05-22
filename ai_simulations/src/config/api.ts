export const API_CONFIG = {
    HUGGINGFACE_API_URL: 'https://api-inference.huggingface.co/models/',
    MODEL_NAME: 'mistralai/Mistral-7B-Instruct-v0.2',
    MAX_LENGTH: 1000,
    TEMPERATURE: 0.7,
    TOPICS: [
        'chemistry',
        'physics',
        'biology',
        'mathematics',
        'computer science'
    ]
} as const;

export const validateApiKey = () => {
    if (!API_CONFIG.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.');
    }
}; 