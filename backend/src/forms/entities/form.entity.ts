// src/forms/entities/form.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { User } from '../../users/entities/user.entity';
import { Answer } from './answer.entity';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Template, (template) => template.id)
  template: Template;

  @ManyToOne(() => User, (user) => user.forms)
  user: User;

  @CreateDateColumn()
  submittedAt: Date;

  @OneToMany(() => Answer, (answer) => answer.form, { cascade: true })
  answers: Answer[];
}
