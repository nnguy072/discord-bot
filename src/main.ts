import dotenv from 'dotenv';
import DiscordBot from './bot/bot';

dotenv.config();

const bot = new DiscordBot();
bot.startBot(process.env.BOT_TOKEN ?? "");
