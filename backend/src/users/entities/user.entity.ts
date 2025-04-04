// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { Form } from '../../forms/entities/form.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'user' })
  role: string;
  
  @Column({ nullable: true })
  refreshTokenHash?: string;


  @Column({ default: false })
  isBlocked: boolean;

  @OneToMany(() => Template, (template) => template.creator)
  templates: Template[];

  @OneToMany(() => Form, (form) => form.user)
  forms: Form[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
