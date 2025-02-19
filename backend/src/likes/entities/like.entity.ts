// src/likes/entities/like.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['template', 'user'])
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Template, (template) => template.id)
  template: Template;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
