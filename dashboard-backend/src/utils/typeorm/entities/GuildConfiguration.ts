import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'guild_configurations' })
export class GuildConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'guild_id' })
  guildId: string;

  @Column({ default: '!' })
  prefix: string;

  @Column({ name: 'time_zone', nullable: true })
  timeZone: string;

  @Column({ name: 'welcome_channel_id', nullable: true })
  welcomeChannelId: string;

  @Column({ name: 'welcome_message', nullable: true })
  welcomeMessage: string;

  @Column({ name: 'bday_channel_id', nullable: true })
  bdayChannelId: string;

  @Column({ name: 'bday_message', nullable: true })
  bdayMessage: string;
}
