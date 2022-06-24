import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { GuildBanLog } from 'src/utils/typeorm/entities/GuidBanLog';
import { GuildConfiguration } from 'src/utils/typeorm/entities/GuildConfiguration';
import { ModerationLog } from '../../utils/typeorm/entities/ModerationLog';
import { IGuildsService } from '../interfaces/guilds';

@Injectable()
export class GuildService implements IGuildsService {
  constructor(
    @InjectRepository(GuildConfiguration)
    private readonly guildConfigRepository: Repository<GuildConfiguration>,
    @InjectRepository(GuildBanLog)
    private readonly banLogRepository: Repository<GuildBanLog>,
    @InjectRepository(ModerationLog)
    private readonly modLogRepository: Repository<ModerationLog>,
  ) {}

  getGuildConfig(guildId: string) {
    return this.guildConfigRepository.findOne({ guildId });
  }

  async updateGuildPrefix(guildId: string, prefix: string) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Guild Configuration not found',
        HttpStatus.BAD_REQUEST,
      );
    return this.guildConfigRepository.save({
      ...guildConfig,
      prefix,
    });
  }

  async updateWelcomeChannel(
    guildId: string,
    welcomeChannelId: string,
    welcomeMessage: string,
  ) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Guild Configuration not found',
        HttpStatus.BAD_REQUEST,
      );
    return this.guildConfigRepository.save({
      ...guildConfig,
      welcomeChannelId,
      welcomeMessage,
    });
  }

  async updateBdayChannelId(
    guildId: string,
    bdayChannelId: string,
    bdayMessage: string,
  ) {
    const guildConfig = await this.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Guild Configuration not found',
        HttpStatus.BAD_REQUEST,
      );
    return this.guildConfigRepository.save({
      ...guildConfig,
      bdayChannelId,
      bdayMessage,
    });
  }

  getGuildBans(guildId: string, fromDate?: Date): Promise<GuildBanLog[]> {
    console.log(new Date(fromDate));
    return fromDate
      ? this.banLogRepository.find({
          where: {
            guildId,
            issuedOn: MoreThanOrEqual(new Date(fromDate)),
          },
        })
      : this.banLogRepository.find({ guildId });
  }
  getGuildLogs(guildId: string, fromDate?: Date): Promise<ModerationLog[]> {
    return fromDate
      ? this.modLogRepository.find({
          where: {
            guildId,
            issuedOn: MoreThanOrEqual(new Date(fromDate)),
          },
        })
      : this.modLogRepository.find({ guildId });
  }
}
