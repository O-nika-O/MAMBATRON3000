import { GuildBanLog } from 'src/utils/typeorm/entities/GuidBanLog';
import { GuildConfiguration } from '../../utils/typeorm/entities/GuildConfiguration';
import { ModerationLog } from '../../utils/typeorm/entities/ModerationLog';

export interface IGuildsService {
  getGuildConfig(guildId: string): Promise<GuildConfiguration>;
  updateGuildPrefix(
    guildId: string,
    prefix: string,
  ): Promise<GuildConfiguration>;
  updateWelcomeChannel(
    guildId: string,
    welcomeChannelId: string,
    welcomeMessage: string,
  ): Promise<GuildConfiguration>;
  updateBdayChannelId(
    guildId: string,
    bdayChannelId: string,
    bdayMessage: string,
  ): Promise<GuildConfiguration>;
  getGuildBans(guildId: string, fromDate?: Date): Promise<GuildBanLog[]>;
  getGuildLogs(guildId: string, fromDate?: Date): Promise<ModerationLog[]>;
}
