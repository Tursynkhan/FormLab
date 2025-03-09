// src/likes/likes.controller.ts
import { Controller, Post, Body, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Like } from './entities/like.entity';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a like for a template' })
  @ApiBody({ type: CreateLikeDto })
  @ApiResponse({ status: 201, description: 'Like created successfully', type: Like })
  async create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Remove a like from a template' })
  @ApiQuery({ name: 'templateId', type: Number })
  @ApiQuery({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Like removed successfully' })
  async remove(@Query('templateId') templateId: number, @Query('userId') userId: string) {
    return this.likesService.remove(+templateId, userId);
  }
}
