// src/forms/entities/answer.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Form } from './form.entity';
import { Question } from '../../templates/entities/question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Form, (form) => form.answers)
  form: Form;

  @ManyToOne(() => Question, (question) => question.id)
  question: Question;

  @Column('text')
  answerValue: string;
}
