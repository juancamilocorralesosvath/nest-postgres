import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Grade } from '../entities/grade.entity';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  @IsPositive()
  @IsOptional()
  age: number;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['Male', 'Female', 'Other'])
  gender: string;

  @IsArray()
  subjects: string[];

  @IsArray()
  @IsOptional()
  grades: Grade[];
}
