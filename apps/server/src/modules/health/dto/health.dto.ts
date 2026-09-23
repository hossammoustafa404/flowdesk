import { createZodDto } from 'nestjs-zod';
import { HealthSchema } from '@flowdesk/schemas';

export class HealthDto extends createZodDto(HealthSchema) {}
