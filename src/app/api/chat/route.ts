import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export async function POST(req: Request) {
  try {
    console.log("Chat request received");
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing.");
      return new Response(
        JSON.stringify({ 
          error: "GEMINI_API_KEY is missing." 
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const body = await req.json();
    const { messages } = body;
    console.log("Messages received:", messages);

    const systemPrompt = `You are an intelligent, friendly AI assistant for the FORTIVEX.AI CRM. 
You help counselors manage leads, schedule follow-ups, and answer questions about the sales pipeline. 
Always be concise, professional, and use markdown formatting to make your responses easy to read.
Never mention you are a mock or demo assistant; you are a fully functional AI.`;

    console.log("Calling Gemini...");
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    console.log("Gemini responded");
    return new Response(result.text, { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' } 
    });
  } catch (error: any) {
    console.error('Error if any:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unable to generate AI response. Please try again.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
