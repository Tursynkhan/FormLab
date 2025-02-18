// src/templates/entities/template.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from './question.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 'public' })
  accessType: string; // 'public' или 'restricted'

  @ManyToOne(() => User, (user) => user.templates)
  creator: User;

  @OneToMany(() => Question, (question) => question.template, { cascade: true })
  questions: Question[];

}
