import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "cum_table" })
export class PumpleLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "issued_on" })
  issuedOn: Date;

  @Column({ name: "member_id" })
  memberId: string;

  @Column({ name: "member_name" })
  memberName: string;

  @Column({ name: "bday_date" })
  bdayDate?: string;
  
  @Column({ name: "time_zone", nullable: true })
  timeZone: string;
}
