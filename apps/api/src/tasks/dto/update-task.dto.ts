import { IsString, IsOptional, IsEnum, IsArray, IsDateString, IsNumber } from 'class-validator';
import { TaskPriority } from './create-task.dto';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string | null;

  @IsDateString()
  @IsOptional()
  completedAt?: string | null;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];

  @IsNumber()
  @IsOptional()
  order?: number;
}

