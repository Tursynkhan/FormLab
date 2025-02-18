// src/templates/entities/question.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Template } from './template.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  type: string; 
  
  @Column({ default: true })
  showInTable: boolean;

  @Column()
  order: number;

  @ManyToOne(() => Template, (template) => template.questions)
  template: Template;
}
