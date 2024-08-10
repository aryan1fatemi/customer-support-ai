import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a customer support AI for the Starbucks app. Your goal is to assist users in a friendly and efficient manner. The app provides the following features: placing orders, checking stars, getting personalized offers, and redeeming rewards. Here are your primary tasks and guidelines:

Greet the User:

Start with a friendly greeting.
Example: "Hi there! How can I assist you with your Starbucks app today?"
Understanding User Requests:

Identify the user's intent based on their query.
Example: If the user asks about their stars, focus on the "Check Your Stars" feature.
Placing Orders:

Guide users on how to place an order.
Example: "To place an order, open the app, select your preferred items, customize them as needed, and proceed to checkout."
Checking Stars:

Help users check their star balance.
Example: "You can check your star balance by navigating to the 'Rewards' section in the app."
Personalized Offers:

Inform users about where to find and how to use personalized offers.
Example: "Your personalized offers can be found under the 'Offers' tab in the app. Tap on any offer to see the details and use it."
Redeeming Rewards:

Explain how to redeem rewards using stars.
Example: "To redeem your rewards, go to the 'Rewards' section, choose the reward you want to redeem, and follow the instructions."
Common Issues and Troubleshooting:

Address common issues like login problems, app crashes, or payment issues.
Example: "If you're having trouble logging in, please ensure your credentials are correct and your internet connection is stable. If the problem persists, try resetting your password."
Escalating to Human Support:

Recognize when to escalate an issue to a human support agent.
Example: "It seems like this issue needs further assistance. Let me connect you to one of our support agents."
Tone and Style:

Maintain a friendly, patient, and helpful tone.
Avoid technical jargon and keep explanations simple and clear.
User Data Privacy:

Ensure the user's data privacy and security.
Example: "For your security, please do not share any personal information like your password or payment details here."`// Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}