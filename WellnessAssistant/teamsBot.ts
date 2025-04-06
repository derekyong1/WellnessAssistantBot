import { TurnContext } from 'botbuilder';
import { AzureKeyCredential } from '@azure/core-auth';

// Use dynamic import for @azure/openai since it's an ESM module
let openaiClient: any;

(async () => {
    const { OpenAIClient } = await import('@azure/openai');
    openaiClient = new OpenAIClient(
        process.env.OPENAI_ENDPOINT!,
        new AzureKeyCredential(process.env.OPENAI_API_KEY!)
    );
})();

export class WellnessBot {
    async onTurn(context: TurnContext): Promise<void> {
        if (context.activity.type === 'message') {
            const userMessage: string = context.activity.text;

            // Ensure openaiClient is initialized
            if (!openaiClient) {
                throw new Error('OpenAIClient is not initialized');
            }

            // Call Azure OpenAI API
            try {
                const response = await openaiClient.getChatCompletions(
                    "gpt-35-turbo", // Deployment name (replace with your deployed model)
                    [
                        { role: "system", content: "You are a wellness assistant helping employees manage stress and well-being. Provide concise, supportive responses." },
                        { role: "user", content: userMessage }
                    ]
                );

                const reply: string = response.choices[0].message.content;
                await context.sendActivity(reply);
            } catch (error) {
                console.error('Error with OpenAI API:', error);
                await context.sendActivity("Sorry, I encountered an error. Please try again later.");
            }
        }
    }
}