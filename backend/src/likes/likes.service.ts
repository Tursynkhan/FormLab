// src/likes/likes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createLikeDto: CreateLikeDto): Promise<Like> {
    const like = this.likeRepository.create({
      template: { id: createLikeDto.templateId },
      user: { id: createLikeDto.userId },
    });
    return this.likeRepository.save(like);
  }

  async remove(templateId: number, userId: number): Promise<void> {
    await this.likeRepository.delete({ template: { id: templateId }, user: { id: userId } });
  }
}
