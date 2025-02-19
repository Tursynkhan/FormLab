// src/forms/dto/create-form.dto.ts
export class CreateFormDto {
  readonly templateId: number;
  readonly userId: number;
  readonly answers: {
    questionId: number;
    answerValue: string;
  }[];
}
