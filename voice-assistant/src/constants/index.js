export const apiKey = process.env.OPENAI_API_KEY;

export const dummyMessages = [
    {
        role: 'user',
        content: 'How are you?'
    },
    {
        role: 'assistant',
        content: "I'm fine, How may I help you today."
    },
    {
        role: 'user',
        content: 'What is the total of 2 + 2?'
    }
]