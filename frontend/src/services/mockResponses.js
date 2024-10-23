const responses = [
    "Hello! How can I assist you today?",
    "Sure, I can help with that.",
    "What else can I do for you?",
    "Thank you for reaching out. What’s your query?",
    "I’m here to help. Please tell me more about your issue.",
    "Can you provide more details?",
    "That sounds interesting. Tell me a little more.",
    "How can I assist with your request today?",
    "Let’s tackle your issue together.",
    "Please hold on while I look that up for you.",
    "I understand. Let’s see what we can do about it.",
    "Thank you for your patience.",
    "We’re almost there. Bear with me a moment.",
    "That’s a good question. Let me find out for you.",
    "I’ll need to check that. One moment please."
];

export const getRandomResponse = () => {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
};
