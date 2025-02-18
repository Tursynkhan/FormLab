export class CreateTemplateDto {
  readonly title: string;
  readonly description: string;
  readonly imageUrl?: string;
  readonly accessType?: string;
  readonly creatorId: number;
}
