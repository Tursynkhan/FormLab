// src/comments/entities/comment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Template, (template) => template.id)
  template: Template;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
