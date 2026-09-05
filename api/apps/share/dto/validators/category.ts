import { IsString, IsDefined, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategory {
  @IsDefined()
  @IsString()
  name!: string;
}

export class CategorySelect {
  @IsOptional()
  @IsBoolean()
  name!: boolean;

  @IsOptional()
  @IsBoolean()
  icon!: boolean;
}
