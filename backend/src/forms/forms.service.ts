// src/forms/forms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from './entities/form.entity';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
  ) {}

  async create(createFormDto: CreateFormDto): Promise<Form> {
    const form = this.formRepository.create(createFormDto);
    return this.formRepository.save(form);
  }

  async findAll(): Promise<Form[]> {
    return this.formRepository.find({ relations: ['user', 'answers'] });
  }

  async findOne(id: number): Promise<Form> {
    const form = await this.formRepository.findOne({ where: { id }, relations: ['user', 'answers'] });
    if (!form) {
      throw new NotFoundException(`Форма с id ${id} не найдена`);
    }
    return form;
  }

  async remove(id: number): Promise<void> {
    await this.formRepository.delete(id);
  }
}
