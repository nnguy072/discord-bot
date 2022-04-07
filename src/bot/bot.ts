import Discord, { Util } from 'discord.js';
import { CMD_PING } from '../constants';
import moment from 'moment';
import { Utility } from '../utility/Utility';

export default class DiscordBot {
  private _prefix: string = "!";
  private _client: Discord.Client = new Discord.Client();

  constructor() {
    this.initEventHandlers();
  }

  private initEventHandlers(): void {
    this._client.on("ready", () => console.log("Bot is ready!"));
    
    this._client.on("voiceStateUpdate", async (prev: Discord.VoiceState, curr: Discord.VoiceState) => {
      await this.onVoiceStateUpdate(prev, curr);
    });
    
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

  private async onVoiceStateUpdate(preVoiceState: Discord.VoiceState, newVoiceState: Discord.VoiceState): Promise<void> {
    const userId = newVoiceState.id;
    let channelId = newVoiceState.channelID;
    return;
  }

  private async onMessage(message: Discord.Message): Promise<void> {
    if (message.author.bot) return;
    if (message.content.startsWith("hi")) message.reply("shut up");
    if (message.content.startsWith("aw")) message.reply("you gonna cry?");
    if (!message.content.startsWith(this._prefix)) return;
  
    const commandBody = message.content.slice(this._prefix.length);
    const args = commandBody.split(" ");
    const command = args.shift()?.toLowerCase();

    switch (command?.toUpperCase()) {
      case CMD_PING:
        const timeTaken = message.createdTimestamp - Date.now();
        message.channel.send(`this message had a latency of ${timeTaken}ms.`);
        break;
      default:
        message.reply("Man oh man, I'm too dumb to understand that command.");
    }
  }
}