export class DiscordUtility {
  static MENTION_REGEX = /<@!?(\d+)>/;
  
  static createMention(id: string): string {
    return `<@${id}>`;
  }
}