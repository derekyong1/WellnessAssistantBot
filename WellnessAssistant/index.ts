import { BotFrameworkAdapter, MemoryStorage, ConversationState, TurnContext } from 'botbuilder';
import * as restify from 'restify';
import * as dotenv from 'dotenv';
import { WellnessBot } from './teamsBot';

// Load environment variables from env/.env.local
dotenv.config({ path: './env/.env.local' });

// Bot adapter for Teams
const adapter = new BotFrameworkAdapter({
    appId: process.env.BOT_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Memory storage for conversation state
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);

// Debug environment variables
console.log('BOT_ID:', process.env.BOT_ID);
console.log('MICROSOFT_APP_PASSWORD:', process.env.MICROSOFT_APP_PASSWORD);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
console.log('OPENAI_ENDPOINT:', process.env.OPENAI_ENDPOINT);

// Start the bot server
const server = restify.createServer();
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context: TurnContext) => {
        const bot = new WellnessBot();
        await bot.onTurn(context);
    });
});

const port: number = parseInt(process.env.PORT || '3978', 10);
server.listen(port, () => {
    console.log(`Server listening on ${server.url}`);
});