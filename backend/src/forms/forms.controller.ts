// src/forms/forms.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { CreateFormDto } from './dto/create-form.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Form } from './entities/form.entity';
@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new form' })
  @ApiBody({ type: CreateFormDto })
  @ApiResponse({ status: 201, description: 'Form created successfully', type: Form })
  async create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all forms' })
  @ApiResponse({ status: 200, description: 'List of forms', type: [Form] })
  async findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get form by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Form found', type: Form })
  async findOne(@Param('id') id: number) {
    return this.formsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete form by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Form deleted successfully' })
  async remove(@Param('id') id: number) {
    return this.formsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('status')
  @ApiOperation({ summary: 'Check if user has already submitted a form for the given template' })
  @ApiBody({
    schema: {
      example: { templateId: 123, userId: 7 },
    },
  })
  @ApiResponse({ status: 200, description: 'Returns status true if form exists', schema: { example: { status: true } } })
  async checkResponseStatus(@Body() body: { templateId: number; userId: string }): Promise<{ status: boolean }> {
    const { templateId, userId } = body;
    const form = await this.formsService.findByTemplateAndUser(templateId, userId);
    return { status: !!form };
  }
}


