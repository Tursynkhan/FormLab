// src/forms/forms.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { Answer } from './entities/answer.entity';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Form, Answer])],
  providers: [FormsService],
  controllers: [FormsController],
})
export class FormsModule {}
