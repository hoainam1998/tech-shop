import { IsBase64, IsString, IsArray, ValidateNested, IsOptional, IsDefined, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { category } from 'generated/prisma/tech-shop';
import Validate from './validator';

export class Category extends Validate {
  @IsDefined()
  @IsString()
  name!: string;

  @IsOptional()
  @IsBase64()
  icon!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  images!: string[];

  constructor(target: category) {
    super();
    Object.assign(this, target);
  }
}
