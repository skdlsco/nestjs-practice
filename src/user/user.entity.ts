import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 255 })
  nickname: string;

  @Column({ nullable: false, unique: true, length: 255 })
  intraLogin: string;

  @Column()
  avatar: string;

  @Column()
  status: number;

  @Column()
  useTwoFactor: boolean;

  @Column()
  ladderPoint: number;

  @Column()
  ladderLevel: number;

  @ManyToMany((type) => User, { cascade: true })
  @JoinTable({ name: 'friend' })
  friends: User[];
}
