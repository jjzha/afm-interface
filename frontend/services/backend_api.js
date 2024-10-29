// should use axios eventually


const API_BASE_URL = 'http://localhost:8000/api/v1/chat';

export const postChatCompletions = async (messages, userMessage) => {
    const controller = new AbortController();
    try {
        const response = await fetch(`${API_BASE_URL}/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [...messages, userMessage],
                model: "meta-llama/Llama-3.1-8B-Instruct",
                max_tokens: 300,
                temperature: 0.7,
                stream: true,
                n: 1,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let assistantMessageContent = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const dataStr = line.slice(5);
                    const data = JSON.parse(dataStr);
                    if (data.choices && data.choices[0].delta) {
                        assistantMessageContent += data.choices[0].delta.content;
                    }
                }
            }
        }
        return { assistantMessageContent };
    } catch (error) {
        console.error("Error fetching LLM response:", error);
        throw error;
    } finally {
        controller.abort();
    }
};
