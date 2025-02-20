// src/comments/dto/create-comment.dto.ts
export class CreateCommentDto {
  readonly templateId: number;
  readonly userId: number;
  readonly content: string;
}
