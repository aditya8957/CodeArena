const { GoogleGenAI } = require("@google/genai");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

const solveDoubt = async (req, res) => {
    try {
        const { messages, title, description, testCases, startCode } = req.body;
        
        // Initialize with GoogleGenAI (new SDK)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        
        // Get the last user message
        let userMessage = "";
        if (Array.isArray(messages)) {
            // Find the last message from user
            const lastUserMsg = [...messages].reverse().find(msg => msg.role === "user");
            userMessage = lastUserMsg ? lastUserMsg.content : messages[messages.length - 1]?.content || "Help me solve this problem";
        } else {
            userMessage = messages || "Help me solve this problem";
        }

        // Create the prompt with system instruction
        const prompt = `You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems. Your role is strictly limited to DSA-related assistance only.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${JSON.stringify(testCases)}
[startCode]: ${JSON.stringify(startCode)}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches (brute force, optimized, etc.)
6. **Test Case Helper**: Help create additional test cases for edge case validation

## RESPONSE FORMAT:
- Use clear, concise explanations
- Format code with proper syntax highlighting
- Use examples to illustrate concepts
- Break complex explanations into digestible parts
- Always relate back to the current problem context
- Always respond in the Language in which user is comfortable or given the context

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics (web development, databases, etc.)
- DO NOT provide solutions to different problems

## USER QUESTION:
Context: I'm working on the problem "${title}"

${userMessage}

Please provide DSA-related assistance only.`;

        console.log("Sending to Gemini 3 Flash Preview...");
        
        // Use the new GoogleGenAI SDK with the model from AI Studio
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        const text = response.text;

        res.status(200).json({
            success: true,
            message: text
        });

    } catch (err) {
        console.error("Gemini API Error:", err.message);
        console.error("Full error:", err);
        
        res.status(500).json({
            success: false,
            message: "AI service error",
            error: err.message
        });
    }
};

// Test API function
const testGemini = async (req, res) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Hello! Please respond with 'Gemini 3 Flash Preview is working correctly!'",
        });

        res.status(200).json({
            success: true,
            message: response.text,
            model: "gemini-3-flash-preview"
        });

    } catch (err) {
        console.error("Test API Error:", err.message);
        
        res.status(500).json({
            success: false,
            message: "Test API error",
            error: err.message
        });
    }
};

module.exports = { solveDoubt, testGemini };