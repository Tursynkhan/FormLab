// src/comments/comments.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Add a new comment to a template' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully', type: Comment })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('template/:templateId')
  @ApiOperation({ summary: 'Get all comments for a template' })
  @ApiParam({ name: 'templateId', type: Number })
  @ApiResponse({ status: 200, description: 'List of comments', type: [Comment] })
  async findByTemplate(@Param('templateId') templateId: number) {
    return this.commentsService.findAllByTemplate(+templateId);
  }
}
