// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember, TextChannel } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import DiscordClient from '../client/client';
import { getRepository } from 'typeorm';
import { GuildConfiguration } from '../typeorm/entities/GuildConfiguration';
import { config } from 'dotenv';


export default class GuildMemberAddEvent extends BaseEvent {
  constructor(
    private readonly guildConfigRepository = getRepository(GuildConfiguration)
  ) {
    super('guildMemberAdd');
  }
  
  async run(client: DiscordClient, member: GuildMember) {
    console.log('new memeber joined')
    console.log(`joined ${member.displayName} to ${member.guild.name} `)
    // const config = client.configs.get(member.guild.id)
    const config = await this.guildConfigRepository.findOne({
      where: { guildId: member.guild.id }
    });
    const wMessage = config?.welcomeMessage || 'Welcome to the server'
    console.log(config)
    if (!config) return;
    if(config?.welcomeChannelId) {
      const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
      if(!channel) console.log('no welcome channel found')
      else
        channel.send(`${wMessage} ${member}`)
    } else {
      console.log('no welcome channel set')
    }
  }
}