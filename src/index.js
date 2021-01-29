require('dotenv').config();
var moment = require('moment');

const User = require('./models/user');

const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = '!';

// <userId, User>
const userMap = new Map();

// ==========================================================================================
// Functions

function registerUser(msg) {
  if (userMap.has(msg.author.id)) {
    msg.reply("You've already registered. Use !check to check your time.");
    return;
  }

  const newUser = new User(msg.author.id);
  userMap.set(msg.author.id, newUser);  
  msg.reply("Registered. Use !check to check your time.");
}

function checkUser(msg) {
  if (!userMap.has(msg.author.id)) {
    msg.reply("To check your time, you need to register using !register first.");
    return;
  }

  msg.channel.send(`You've registered ${userMap.get(msg.author.id).registeredTime.fromNow()}.`);
}


// ==========================================================================================
// EVENT HANDLERS

client.on("ready", () => {
  console.log(User);
});

client.on("voiceStateUpdate", (preVoiceState, newVoiceState) => {});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith("hi")) message.reply("shut up");
  if (message.content.startsWith("aw")) message.reply("you gonna cry?")
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "ping":
      const timeTaken = message.createdTimestamp - Date.now();
      message.channel.send(`this message had a latency of ${timeTaken}ms.`);
      break;
    case "register":
      registerUser(message);
      break;
    case "check":
      checkUser(message);
      break;
    default:
      message.reply("Man oh man, I'm too dumb to understand that command.");
  }
});

client.login(process.env.BOT_TOKEN);
