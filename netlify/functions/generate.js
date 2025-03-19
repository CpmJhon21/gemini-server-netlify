const fetch = require("node-fetch");

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const prompt = body.prompt || "Write a short story.";
        const API_KEY = process.env.GEMINI_API_KEY;



        if (!API_KEY) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "API Key not found!" })
            };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ response: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response." })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error." })
        };
    }
};
