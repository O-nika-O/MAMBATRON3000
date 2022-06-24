import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ROUTES, SERVICES } from 'src/utils/constants';
import { WebsocketHandler } from 'src/websockets/socket';
import { IGuildsService } from '../interfaces/guilds';

@Controller(ROUTES.GUILDS)
export class GuildsController {
  constructor(
    @Inject(SERVICES.GUILDS) private readonly guildsService: IGuildsService,
    @Inject(WebsocketHandler) private readonly wsHandler: WebsocketHandler,
  ) {}

  @Get('config/:guildId')
  async getGuildConfig(@Param('guildId') guildId: string) {
    const guildConfig = await this.guildsService.getGuildConfig(guildId);
    if (!guildConfig)
      throw new HttpException(
        'Guild Configuration not found',
        HttpStatus.NOT_FOUND,
      );
    return guildConfig;
  }

  // @Get('bday/:guildId')
  // async getCumConfig(@Param('guildId') guildId: string) {
  //   const guildConfig = await this.guildsService.getGuildConfig(guildId);
  //   if (!guildConfig)
  //     throw new HttpException(
  //       'Guild Configuration not found',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   return guildConfig;
  // }

  @Post(':guildId/config/prefix')
  async updateGuildPrefix(
    @Param('guildId') guildId: string,
    @Body('prefix') prefix: string,
  ) {
    const config = await this.guildsService.updateGuildPrefix(guildId, prefix);
    this.wsHandler.guildPrefixUpdate(config);
    return config;
  }

  @Post(':guildId/config/welcome')
  async updateWelcomeChannel(
    @Param('guildId') guildId: string,
    @Body('channelId') channelId: string,
    @Body('message') message: string,
  ) {
    return this.guildsService.updateWelcomeChannel(guildId, channelId, message);
  }

  @Post(':guildId/config/bday')
  async updateBdayChannelId(
    @Param('guildId') guildId: string,
    @Body('channelId') channelId: string,
    @Body('message') message: string,
  ) {
    return this.guildsService.updateBdayChannelId(guildId, channelId, message);
  }

  @Get(':guildId/bans')
  async getGuildBans(
    @Param('guildId') guildId: string,
    @Query('fromDate') fromDate: Date,
  ) {
    return this.guildsService.getGuildBans(guildId, fromDate);
  }

  @Get(':guildId/logs')
  async getGuildLogs(
    @Param('guildId') guildId: string,
    @Query('fromDate') fromDate: Date,
  ) {
    return this.guildsService.getGuildLogs(guildId, fromDate);
  }
}
