import { streamText } from 'ai';

async function main() {
  const result = await streamText({
    model: {
       id: "mock",
       provider: "mock",
       doStream: async () => ({
          stream: new ReadableStream(),
          rawCall: { rawPrompt: null, rawSettings: {} }
       })
    },
    messages: [{role: 'user', content: 'hello'}],
  });
  console.log(Object.keys(result));
}
main().catch(console.error);
