import Discord, { Snowflake, Util } from 'discord.js';
import { CMD_KUDO, CMD_PING } from '../constants';
import moment from 'moment';
import { DiscordUtility, Utility } from '../utility';

export default class DiscordBot {
  private _prefix: string = "!";
  private _client: Discord.Client = new Discord.Client();
  private static KUDO_USAGE = "Kudo usage: !kudo @user <message>";

  private _users: Discord.Collection<string, Discord.User> = new Discord.Collection();

  constructor(prefix?: string) {
    if (prefix) this._prefix = prefix;
    this.initEventHandlers();
  }

  private initEventHandlers(): void {
    this._client.on("ready", () => console.log("Bot is ready!"));

    this._client.on("message", async (message: Discord.Message) => await this.onMessage(message));
  }

  public async startBot(botToken: string): Promise<boolean> {
    if (!botToken || botToken.trim() === "")
      throw "Bot Token required";    
    
    try {
      await this._client.login(botToken);
      return true;
    } 
    catch (error) {
      throw error;
    }
  }

  private async onMessage(message: Discord.Message): Promise<void> {
    if (message.author.bot) return;
    if (!message.content.startsWith(this._prefix)) return;
  
    const commandBody = message.content.slice(this._prefix.length);
    const params = commandBody.split(" ");
    const command = params.shift()?.toLowerCase();

    try {
      switch (command?.toUpperCase()) {
        case CMD_PING:
          const timeTaken = Date.now() - message.createdTimestamp;
          message.channel.send(`this message had a latency of ${timeTaken}ms.`);
          break;
        case CMD_KUDO:
          await this.handleKudo(message, params);
          break;
        default:
          message.reply("Man oh man, I'm too dumb to understand that command.");
      }
    } catch (error) {
      console.error("Something went wrong executing command", error);
      message.reply(`oof`);
    }
  }

  private async handleKudo(message: Discord.Message, params: string[]): Promise<void> {
    if (params.length < 1) {
      message.reply(DiscordBot.KUDO_USAGE);
      return;
    }
    
    const author = message.author;
    const kudoReason = params.join(" ");

    const targetMention = params.shift()?.toLowerCase();  // literally @user
    if (!targetMention) {
      message.reply(DiscordBot.KUDO_USAGE);
      return;
    }

    // ?:^<@\d+$>){1} matches <@{ID}>
    if (!targetMention.match(DiscordUtility.MENTION_REGEX)?.[1]) {
      message.reply(`Could not parse target user. ${DiscordBot.KUDO_USAGE}`);
      return;
    }

    const targetId = targetMention?.replace("<@", "").replace(">", "");
    const target = message.guild?.member(targetId);

    if (!target) {
      message.reply("Sorry, I couldn't find the person you're looking for.");
      return;
    }

    message.channel.send(`${DiscordUtility.createMention(author.id)} has given a kudo to ${targetMention} for: ${kudoReason}`);
  }
}