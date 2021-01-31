import Discord from 'discord.js';
import { CMD_REGISTER, CMD_CHECK, CMD_RANK, CMD_PING } from '../constants';
import moment from 'moment';
import { User } from '../models';

export default class DiscordBot {
  private _prefix: string = "!";
  private _client: Discord.Client = new Discord.Client();
  private _userMap: Map<string, User> = new Map<string, User>();

  constructor() {
    this.initEventHandlers();
  }

  private initEventHandlers(): void {
    this._client.on("channelCreate", () => {});
    
    this._client.on("voiceStateUpdate", this.onVoiceStateUpdate);
    
    this._client.on("message", async message => this.onMessage);
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
      // console.log("VOICE STATE\n", newVoiceState.toJSON());
      // console.log("GUID\n", newVoiceState.guild.toJSON());
      // console.log("CHANNELS\n", newVoiceState.guild.channels.cache.toJSON());
      // console.log("MEMBERS\n", newVoiceState.guild.members.cache.toJSON());
      // console.log(newVoiceState.guild.voiceStates.cache.toJSON());
      const now = moment();
      const userId = newVoiceState.id;
      let channelId = newVoiceState.channelID;
      // const channelName = newVoiceState.guild.channels.cache.has(channelId) ? 
      //   newVoiceState.guild.channels.cache.get(channelId).name :
      //   preVoiceState.guild.channels.cache.get(channelId).name;
    
      const currentMembers = newVoiceState.guild.members.cache;
      const member = currentMembers.get(userId);
      console.log(member?.voice.channel);
    
      return;
      // if (member === null || member === undefined) return;
    
      // const displayName = member.nickname ? member.nickname : member.user.username;
      // if (channelId !== null) {
      //   console.log(`${displayName} joined ${channelName} at ${now.format('MMMM Do YYYY, h:mm:ss a')}`);
      // }
      // else if (channelId === null) {
      //   channelId = preVoiceState.channelID;
      //   console.log(`${displayName} left ${channelName} at ${now.format('MMMM Do YYYY, h:mm:ss a')}`);
      // }
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
      case CMD_REGISTER:
        this.registerUser(message);
        break;
      case CMD_CHECK:
        this.checkUser(message);
        break;
      case CMD_RANK:
      default:
        message.reply("Man oh man, I'm too dumb to understand that command.");
    }
  }

  private async registerUser(msg: Discord.Message): Promise<void> {
    if (this._userMap.has(msg.author.id)) {
      msg.channel.send("You've already registered. Use !check to check your time.");
      return;
    }
  
    const newUser = new User(msg.author.id);
    this._userMap.set(msg.author.id, newUser);  
    msg.channel.send("Registered. Use !check to check your time.");
  }
  
  private async checkUser(msg: Discord.Message): Promise<void> {
    if (!this._userMap.has(msg.author.id)) {
      msg.channel.send("To check your time, you need to register using !register first.");
      return;
    }
  
    msg.channel.send(`You've registered ${this._userMap.get(msg.author.id)?.registeredTime.fromNow()}.`);
  }
}