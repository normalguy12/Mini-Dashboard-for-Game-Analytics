import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnalyticsDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  duration?: number;

  @IsOptional()
  @IsObject()
  metadata?: object;
}
