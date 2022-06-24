import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "secret_froggy" })
export class SecretFroggyLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guild_id" })
  guildId: string;

  @Column({ name: "issued_on" })
  issuedOn: Date;

  @Column({ name: "member_id" })
  memberId: string;
  
  @Column({ name: "description" })
  description: string;
}
